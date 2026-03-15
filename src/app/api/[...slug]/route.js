import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import config from '../../../payload.config'

export const GET = (req, args) => {
  console.log('API GET:', req.url, args);
  return REST_GET(config)(req, args);
}
export const POST = (req, args) => {
  console.log('API POST:', req.url, args);
  return REST_POST(config)(req, args);
}
export const DELETE = (req, args) => REST_DELETE(config)(req, args);
export const PATCH = (req, args) => REST_PATCH(config)(req, args);
export const OPTIONS = (req, args) => REST_OPTIONS(config)(req, args);
export const PUT = (req, args) => REST_POST(config)(req, args);
