import fs from 'fs/promises'
import path from 'path'

import { v2 as cloudinary } from 'cloudinary'

let configured = false

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return null
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  }
}

export function hasCloudinaryConfig() {
  return Boolean(getCloudinaryConfig())
}

export function getCloudinaryClient() {
  const config = getCloudinaryConfig()

  if (!config) {
    throw new Error('Cloudinary env vars are missing')
  }

  if (!configured) {
    cloudinary.config(config)
    configured = true
  }

  return cloudinary
}

export function getMediaFilePath(filename) {
  if (!filename) return null
  return path.resolve(process.cwd(), 'media', filename)
}

export async function uploadMediaFileToCloudinary(filePath, options = {}) {
  const client = getCloudinaryClient()
  const { folder = 'thuychi/payload-media', publicId } = options

  await fs.access(filePath)

  return client.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
    unique_filename: false,
    use_filename: !publicId,
  })
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId || !hasCloudinaryConfig()) return null

  const client = getCloudinaryClient()
  return client.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: 'image',
  })
}

export function getCloudinaryPublicUrl(doc) {
  return doc?.cloudinary?.secureUrl || doc?.externalURL || doc?.url || null
}

const CLOUDINARY_SIZE_PRESETS = {
  thumbnail: { width: 400, height: 300, crop: 'fill' },
  card: { width: 768, height: 1024, crop: 'fill' },
  tablet: { width: 1024, crop: 'limit' },
  banner: { width: 1600, crop: 'limit' },
  hero: { width: 1800, crop: 'limit' },
}

export function optimizeCloudinaryUrl(url, preset = 'default') {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url || null
  }

  try {
    const parsed = new URL(url)
    const uploadMarker = '/image/upload/'
    const markerIndex = parsed.pathname.indexOf(uploadMarker)

    if (markerIndex === -1) {
      return url
    }

    const transformation = ['f_auto', 'q_auto']
    const sizePreset = CLOUDINARY_SIZE_PRESETS[preset] || CLOUDINARY_SIZE_PRESETS.default || null

    if (sizePreset?.width) transformation.push(`w_${sizePreset.width}`)
    if (sizePreset?.height) transformation.push(`h_${sizePreset.height}`)
    if (sizePreset?.crop) transformation.push(`c_${sizePreset.crop}`)

    const before = parsed.pathname.slice(0, markerIndex + uploadMarker.length)
    const after = parsed.pathname.slice(markerIndex + uploadMarker.length)

    if (/^(?:[A-Za-z]_\w+|[a-z]{1,3}_[^/]+|f_[^/]+|q_[^/]+)/.test(after)) {
      return url
    }

    parsed.pathname = `${before}${transformation.join(',')}/${after}`
    return parsed.toString()
  } catch {
    return url
  }
}
