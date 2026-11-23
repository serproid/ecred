interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  SIGILOPAY_PUBLIC_KEY: string
  SIGILOPAY_SECRET_KEY: string
  SIGILOPAY_API_BASE?: string
  SIGILOPAY_CALLBACK_URL?: string
}

const DEFAULT_API_BASE = 'https://app.sigilopay.com.br/api/v1'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

async function sigiloFetch(env: Env, path: string, init: RequestInit = {}) {
  const base = (env.SIGILOPAY_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '')
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'x-public-key': env.SIGILOPAY_PUBLIC_KEY,
      'x-secret-key': env.SIGILOPAY_SECRET_KEY,
      ...(init.headers as Record<string, string> | undefined),
    },
  })
}

function extractPix(payload: any) {
  const pix = payload?.pix ?? payload?.order?.pix ?? null
  if (!pix) return { code: '', image: '' }

  const code =
    pix.code ?? pix.payload ?? pix.emv ?? pix.qrCode ?? pix.qrcode ?? ''
  let image = ''
  if (pix.base64) {
    image = String(pix.base64).startsWith('data:image')
      ? String(pix.base64)
      : `data:image/png;base64,${pix.base64}`
  } else if (pix.image) {
    image = String(pix.image)
  } else if (pix.imageUrl) {
    image = String(pix.imageUrl)
  } else if (pix.qrCodeImageUrl) {
    image = String(pix.qrCodeImageUrl)
  }

  return { code: String(code), image }
}

async function createPix(request: Request, env: Env) {
  if (!env.SIGILOPAY_PUBLIC_KEY || !env.SIGILOPAY_SECRET_KEY) {
    return json({ error: 'SigiloPay não configurado.' }, 500)
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return json({ error: 'JSON inválido.' }, 400)
  }

  const amount = Number(body?.amount)
  if (!Number.isFinite(amount) || amount < 0.01) {
    return json({ error: 'Valor inválido.' }, 400)
  }

  const client = body?.client ?? {}
  const document = String(client.document ?? '').replace(/\D/g, '')
  if (!document) {
    return json({ error: 'CPF é obrigatório para gerar o PIX.' }, 400)
  }

  const identifier = String(
    body?.identifier ||
      `ecred_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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

  if (env.SIGILOPAY_CALLBACK_URL) {
    payload.callbackUrl = env.SIGILOPAY_CALLBACK_URL
  }

  let response: Response
  try {
    response = await sigiloFetch(env, '/gateway/pix/receive', {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(45000),
    })
  } catch {
    return json(
      { error: 'Não foi possível conectar ao SigiloPay. Tente novamente.' },
      502,
    )
  }

  const text = await response.text()
  let data: any = null
  try {
    data = JSON.parse(text)
  } catch {
    data = null
  }

  const { code, image } = extractPix(data ?? {})

  if (!response.ok || !data || !code) {
    return json(
      {
        error: data?.message ?? 'Não foi possível gerar o PIX.',
        errorCode: data?.errorCode,
        details: data?.details,
      },
      502,
    )
  }

  return json({
    transactionId: data.transactionId ?? data.id ?? '',
    identifier,
    amount: payload.amount,
    code,
    image,
    expiresAt: data?.pix?.expiresAt ?? '',
    status: data?.status ?? '',
    transactionStatus: data?.transactionStatus ?? '',
  })
}

async function pixStatus(url: URL, env: Env) {
  const id = url.searchParams.get('id')
  if (!id) return json({ error: 'id obrigatório.' }, 400)

  let response: Response
  try {
    response = await sigiloFetch(
      env,
      `/gateway/transactions?id=${encodeURIComponent(id)}`,
      { method: 'GET', signal: AbortSignal.timeout(15000) },
    )
  } catch {
    return json({ status: 'PENDING', paid: false })
  }

  const text = await response.text()
  let data: any = null
  try {
    data = JSON.parse(text)
  } catch {
    data = null
  }

  if (!response.ok || !data) {
    return json({ status: 'PENDING', paid: false })
  }

  const transaction = data.transaction ?? data
  const status = String(transaction.status ?? data.status ?? 'PENDING')
  const paid = status === 'COMPLETED' || status === 'PAID'

  return json({ status, paid })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/pix' && request.method === 'POST') {
      return createPix(request, env)
    }

    if (url.pathname === '/api/pix/status' && request.method === 'GET') {
      return pixStatus(url, env)
    }

    if (
      url.pathname === '/api/sigilopay/webhook' &&
      request.method === 'POST'
    ) {
      return json({ ok: true })
    }

    return env.ASSETS.fetch(request)
  },
}
