import { getRequestHeader, readBody, createError, defineEventHandler } from 'h3'

// ─── Simple in-memory rate limiter ───────────────────────────────────────────
// Note: each Lambda cold-start gets a fresh map, but it still throttles
// repeated rapid submissions within a single warm instance.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 3   // max requests per window
const RATE_WINDOW = 60_000 // 1 minute in ms

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // ── 1. Honeypot check ───────────────────────────────────────────────────────
  // Hidden field '_honey' should always be empty. Bots fill it in.
  if (body._honey) {
    console.warn(`[contact] Honeypot field detected. Value: "${body._honey}". Silently ignoring.`)
    // Silently respond OK so bots don't know they were caught
    return { ok: true }
  }

  // ── 2. Speed check ──────────────────────────────────────────────────────────
  // Bots submit instantly. Humans take at least a few seconds.
  const elapsed = body._timestamp ? Date.now() - Number(body._timestamp) : Infinity
  if (elapsed < 3000) {
    console.warn('[contact] Submission too fast:', elapsed, 'ms')
    throw createError({ statusCode: 429, statusMessage: 'Submitted too fast.' })
  }

  // ── 3. Rate limiting by IP ──────────────────────────────────────────────────
  const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')
  const ip = (typeof xForwardedFor === 'string' ? xForwardedFor.split(',')[0]?.trim() : Array.isArray(xForwardedFor) ? xForwardedFor[0] : null) ?? 'unknown'
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (entry && now < entry.resetTime) {
    if (entry.count >= RATE_LIMIT) {
      throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please wait a minute.' })
    }
    entry.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
  }

  // ── 4. Server-side field validation ────────────────────────────────────────
  const { name, email, message } = body

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid name.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || typeof email !== 'string' || !emailRegex.test(email) || email.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address.' })
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
    throw createError({ statusCode: 400, statusMessage: 'Message must be between 10 and 2000 characters.' })
  }

  // ── 5. Send to Telegram ─────────────────────────────────────────────────────
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('[contact] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars')
    throw createError({ statusCode: 500, statusMessage: 'Server not configured.' })
  }

  const text = [
    '📬 *New message from portfolio*',
    '',
    `👤 *Name:* ${escapeMarkdown(name.trim())}`,
    `📧 *Email:* ${escapeMarkdown(email.trim())}`,
    '',
    '💬 *Message:*',
    escapeMarkdown(message.trim()),
  ].join('\n')

  const tgResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2',
      }),
    }
  )

  if (!tgResponse.ok) {
    const err = await tgResponse.text()
    console.error('[contact] Telegram API error:', err)
    throw createError({ statusCode: 502, statusMessage: 'Failed to deliver message.' })
  }

  return { ok: true }
})

// MarkdownV2 requires escaping special characters
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&')
}
