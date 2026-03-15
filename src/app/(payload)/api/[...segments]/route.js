import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import config from '../../../../payload.config'

export const GET = (req) => REST_GET(req, { config })
export const POST = (req) => REST_POST(req, { config })
export const DELETE = (req) => REST_DELETE(req, { config })
export const PATCH = (req) => REST_PATCH(req, { config })
export const OPTIONS = (req) => REST_OPTIONS(req, { config })
export const PUT = (req) => REST_POST(req, { config })
