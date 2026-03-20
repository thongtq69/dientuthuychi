import { cache } from 'react'
import { getPayload as loadPayload } from 'payload'
import config from '../payload.config'

const PAYLOAD_DATA_MODES = new Set(['payload-first', 'payload-only', 'fallback-local', 'local-only'])

export const DEFAULT_PAYLOAD_DATA_MODE = 'payload-first'

export const getPayload = cache(async () => {
  return await loadPayload({ config })
})

export const resolvePayloadDataMode = (mode) => {
  if (PAYLOAD_DATA_MODES.has(mode)) return mode

  const envMode = process.env.PAYLOAD_DATA_MODE
  if (PAYLOAD_DATA_MODES.has(envMode)) return envMode

  return DEFAULT_PAYLOAD_DATA_MODE
}

export const shouldReadPayload = (mode) => {
  return resolvePayloadDataMode(mode) !== 'local-only'
}

export const shouldUseLocalFallback = (mode) => {
  return resolvePayloadDataMode(mode) !== 'payload-only'
}

export const readPayload = async (reader, options = {}) => {
  const mode = resolvePayloadDataMode(options.mode)

  if (!shouldReadPayload(mode)) {
    return {
      ok: false,
      skipped: true,
      mode,
      data: null,
      error: null,
    }
  }

  try {
    const payload = await getPayload()
    const data = await reader(payload)

    return {
      ok: true,
      skipped: false,
      mode,
      data,
      error: null,
    }
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      mode,
      data: null,
      error,
    }
  }
}
