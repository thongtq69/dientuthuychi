export const dynamic = 'force-dynamic'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import config from '../../../payload.config'

const getPayloadParams = async (req, params) => {
  const p = await params
  const url = new URL(req.url, 'http://localhost')
  const segments = url.pathname.split('/').filter(Boolean)
  const apiIndex = segments.indexOf('api')
  const payloadSegments = apiIndex !== -1 ? segments.slice(apiIndex + 1) : (p?.payload || p?.slug || [])

  return {
    ...p,
    payload: payloadSegments,
    slug: payloadSegments,
  }
}

export const GET = async (req, { params }) => REST_GET(config)(req, { params: await getPayloadParams(req, params) })
export const POST = async (req, { params }) => REST_POST(config)(req, { params: await getPayloadParams(req, params) })
export const DELETE = async (req, { params }) => REST_DELETE(config)(req, { params: await getPayloadParams(req, params) })
export const PATCH = async (req, { params }) => REST_PATCH(config)(req, { params: await getPayloadParams(req, params) })
export const OPTIONS = async (req, { params }) => REST_OPTIONS(config)(req, { params: await getPayloadParams(req, params) })
export const PUT = async (req, { params }) => REST_POST(config)(req, { params: await getPayloadParams(req, params) })
