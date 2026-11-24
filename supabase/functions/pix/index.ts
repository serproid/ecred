const API_BASE =
  Deno.env.get('SIGILOPAY_API_BASE') ?? 'https://app.sigilopay.com.br/api/v1'
const PUBLIC_KEY = Deno.env.get('SIGILOPAY_PUBLIC_KEY') ?? ''
const SECRET_KEY = Deno.env.get('SIGILOPAY_SECRET_KEY') ?? ''

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

async function sigilo(path: string, init: RequestInit = {}) {
  const base = API_BASE.replace(/\/$/, '')
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'x-public-key': PUBLIC_KEY,
      'x-secret-key': SECRET_KEY,
    },
  })
}

function extractPix(payload: any) {
  const pix = payload?.pix ?? payload?.order?.pix ?? null
  if (!pix) return { code: '', image: '' }

  const code =
    pix.code ?? pix.payload ?? pix.emv ?? pix.qrCode ?? pix.qrcode ?? ''

  let image = ''
  if (pix.image) image = String(pix.image)
  else if (pix.imageUrl) image = String(pix.imageUrl)
  else if (pix.qrCodeImageUrl) image = String(pix.qrCodeImageUrl)

  return { code: String(code), image }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Método não permitido.' }, 405)
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400)
  }

  const action = String(body?.action ?? 'create')

  if (action === 'status') {
    const id = String(body?.id ?? '')
    if (!id) return json({ ok: false, paid: false, status: 'PENDING' })

    try {
      const response = await sigilo(
        `/gateway/transactions?id=${encodeURIComponent(id)}`,
        { method: 'GET', signal: AbortSignal.timeout(15000) },
      )
      const data = await response.json().catch(() => null)
      if (!response.ok || !data) {
        return json({ ok: false, paid: false, status: 'PENDING' })
      }
      const transaction = data.transaction ?? data
      const status = String(transaction.status ?? data.status ?? 'PENDING')
      return json({
        ok: true,
        status,
        paid: status === 'COMPLETED' || status === 'PAID',
      })
    } catch {
      return json({ ok: false, paid: false, status: 'PENDING' })
    }
  }

  if (!PUBLIC_KEY || !SECRET_KEY) {
    return json({ ok: false, error: 'SigiloPay não configurado.' }, 500)
  }

  const amount = Number(body?.amount)
  if (!Number.isFinite(amount) || amount < 0.01) {
    return json({ ok: false, error: 'Valor inválido.' }, 400)
  }

  const client = body?.client ?? {}
  const document = String(client.document ?? '').replace(/\D/g, '')
  if (!document) {
    return json({ ok: false, error: 'CPF é obrigatório para gerar o PIX.' }, 400)
  }

  const identifier = String(
    body?.identifier ||
      `ecred_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
  )

  const amountValue = Math.round(amount * 100) / 100

  const products =
    Array.isArray(body?.products) && body.products.length > 0
      ? body.products
      : [
          {
            id: 'pagamento-ecred',
            name: 'Pagamento Ecred',
            quantity: 1,
            price: amountValue,
          },
        ]

  const metadata =
    body?.metadata && typeof body.metadata === 'object'
      ? { provider: 'Ecred', orderId: identifier, ...body.metadata }
      : { provider: 'Ecred', orderId: identifier }

  const payload: any = {
    identifier,
    amount: amountValue,
    client: {
      name: String(client.name ?? '').trim() || 'Cliente',
      email: String(client.email ?? ''),
      phone: String(client.phone ?? '').replace(/\D/g, ''),
      document,
    },
    products,
    metadata,
  }

  const callback = Deno.env.get('SIGILOPAY_CALLBACK_URL')
  if (callback) payload.callbackUrl = callback

  try {
    const response = await sigilo('/gateway/pix/receive', {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(45000),
    })
    const data = await response.json().catch(() => null)
    const { code, image } = extractPix(data ?? {})

    if (
      data?.status &&
      ['FAILED', 'REJECTED', 'CANCELED', 'CANCELLED'].includes(
        String(data.status),
      )
    ) {
      return json({
        ok: false,
        error:
          data?.errorDescription ??
          'Não foi possível gerar o PIX. Tente novamente.',
        errorCode: data?.errorCode ?? data?.status,
      })
    }

    if (!response.ok || !data || !code) {
      return json({
        ok: false,
        error: data?.message ?? 'Não foi possível gerar o PIX.',
        errorCode: data?.errorCode,
        details: data?.details,
      })
    }

    return json({
      ok: true,
      transactionId: data.transactionId ?? '',
      identifier,
      amount: payload.amount,
      code,
      image,
      expiresAt: data?.pix?.expiresAt ?? '',
      status: data?.status ?? '',
      transactionStatus: data?.transactionStatus ?? '',
    })
  } catch {
    return json({
      ok: false,
      error: 'Não foi possível conectar ao SigiloPay. Tente novamente.',
    })
  }
})
