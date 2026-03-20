import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const MIME_TYPES = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

export async function GET(_req, context) {
  const params = await context.params
  const rawFilename = Array.isArray(params?.filename) ? params.filename[0] : params?.filename

  if (!rawFilename) {
    return Response.json({ error: 'Missing filename' }, { status: 400 })
  }

  const filename = path.basename(decodeURIComponent(rawFilename))
  const filePath = path.resolve(process.cwd(), 'media', filename)

  try {
    const fileBuffer = await fs.readFile(filePath)
    const extension = path.extname(filename).toLowerCase()

    return new Response(fileBuffer, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(fileBuffer.byteLength),
        'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      },
    })
  } catch {
    return Response.json({ error: 'File not found' }, { status: 404 })
  }
}
