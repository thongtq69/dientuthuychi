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
