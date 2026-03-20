const VALID_DATA_MODES = new Set(['payload-first', 'fallback-local', 'payload-only']);

function normalizeDataMode(value) {
  if (!value) {
    return 'fallback-local';
  }

  const normalized = String(value).trim().toLowerCase();
  return VALID_DATA_MODES.has(normalized) ? normalized : 'fallback-local';
}

export function getPayloadDataMode(overrides = {}) {
  return normalizeDataMode(
    overrides.dataMode ??
      process.env.PAYLOAD_DATA_MODE ??
      process.env.NEXT_PUBLIC_PAYLOAD_DATA_MODE,
  );
}

export function getPayloadDataFlags(overrides = {}) {
  const mode = getPayloadDataMode(overrides);

  return {
    mode,
    payloadFirst: mode === 'payload-first',
    fallbackLocal: mode !== 'payload-only',
    payloadOnly: mode === 'payload-only',
  };
}

export function shouldReadFromPayload(overrides = {}) {
  const { mode } = getPayloadDataFlags(overrides);
  return mode === 'payload-first' || mode === 'payload-only';
}

export function shouldAllowLocalFallback(overrides = {}) {
  return getPayloadDataFlags(overrides).fallbackLocal;
}
