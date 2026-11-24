const API_URL =
  Deno.env.get('CPFHUB_API_URL') ?? 'https://api.cpfhub.io/cpf/realtime'
const API_KEY = Deno.env.get('CPFHUB_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const RATE_LIMIT = 8
const RATE_WINDOW_SECONDS = 60

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8' },
  })
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

async function serviceFetch(path: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'content-type': 'application/json',
      ...(init.headers as Record<string, string> | undefined),
    },
  })
}

async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return { allowed: true, retryAfter: 0 }
  }

  try {
    const response = await serviceFetch('/rest/v1/rpc/check_rate_limit', {
      method: 'POST',
      body: JSON.stringify({
        p_key: key,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return { allowed: true, retryAfter: 0 }

    const data = await response.json()
    return {
      allowed: Boolean(data?.allowed),
      retryAfter: Number(data?.retryAfter ?? 0),
    }
  } catch {
    return { allowed: true, retryAfter: 0 }
  }
}

async function cpfExists(cpf: string): Promise<boolean> {
  if (!SUPABASE_URL || !SERVICE_KEY) return false

  try {
    const response = await serviceFetch(
      `/rest/v1/profiles?cpf=eq.${encodeURIComponent(cpf)}&select=id`,
      { method: 'GET', signal: AbortSignal.timeout(8000) },
    )
    if (!response.ok) return false
    const rows = await response.json()
    return Array.isArray(rows) && rows.length > 0
  } catch {
    return false
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Método não permitido.' }, 405)
  }

  if (!API_KEY) {
    return json(
      { ok: false, error: 'Consulta de CPF não configurada.' },
      500,
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400)
  }

  const cpf = onlyDigits(String(body?.cpf ?? ''))
  const birthDate = String(body?.birthDate ?? '').trim()

  if (cpf.length !== 11) {
    return json({ ok: false, error: 'Informe um CPF válido.' }, 400)
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    return json({ ok: false, error: 'Informe a data de nascimento.' }, 400)
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const rate = await checkRateLimit(
    `cpf:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS,
  )

  if (!rate.allowed) {
    return json({
      ok: false,
      error: 'Muitas tentativas. Aguarde alguns segundos.',
      retryAfter: rate.retryAfter,
      rateLimited: true,
    })
  }

  if (await cpfExists(cpf)) {
    return json({
      ok: false,
      existing: true,
      error: 'CPF já cadastrado. Faça login na sua conta.',
    })
  }

  let response: Response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ cpf, birthDate }),
      signal: AbortSignal.timeout(60000),
    })
  } catch {
    return json({
      ok: false,
      error:
        'A consulta demorou para responder. Tente novamente em alguns segundos.',
    })
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload) {
    const message =
      typeof payload?.error === 'string'
        ? payload.error
        : payload?.error?.message ?? 'Não foi possível consultar o CPF.'

    return json({
      ok: false,
      error: message,
      status: response.status,
      retryAfter: response.headers.get('retry-after') ?? '',
    })
  }

  const info = payload.data ?? {}
  const deathYear =
    typeof info.deathYear === 'number' ? info.deathYear : null
  const situation = String(info.situation ?? '')
  const blocked =
    deathYear !== null || situation.toUpperCase() === 'TITULAR FALECIDO'

  return json({
    ok: true,
    name: String(info.name ?? ''),
    birthDate: String(info.birthDate ?? birthDate),
    situation,
    deathYear,
    blocked,
  })
})
