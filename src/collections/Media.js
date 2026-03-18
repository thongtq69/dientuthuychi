import { deleteFromCloudinary, getMediaFilePath, hasCloudinaryConfig, uploadMediaFileToCloudinary } from '../lib/cloudinary.js'

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : value)

const normalizeURL = (value) => {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined

  return /^https?:\/\//.test(trimmed) ? trimmed : undefined
}

export const Media = {
  slug: 'media',
  admin: {
    group: 'Media',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
    create: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: null,
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        data.alt = normalizeText(data.alt)
        data.externalURL = normalizeURL(data.externalURL)
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        if (context?.skipCloudinarySync || !hasCloudinaryConfig()) {
          return doc
        }

        const filePath = getMediaFilePath(doc?.filename)
        if (!filePath) {
          return doc
        }

        const shouldUpload =
          !doc?.cloudinary?.secureUrl ||
          previousDoc?.filename !== doc?.filename

        if (!shouldUpload) {
          return doc
        }

        try {
          const uploaded = await uploadMediaFileToCloudinary(filePath, {
            folder: 'thuychi/payload-media',
            publicId: doc?.cloudinary?.publicId || undefined,
          })

          return await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              externalURL: uploaded.secure_url,
              cloudinary: {
                publicId: uploaded.public_id,
                secureUrl: uploaded.secure_url,
                resourceType: uploaded.resource_type,
                format: uploaded.format,
                bytes: uploaded.bytes,
                version: uploaded.version?.toString?.() || null,
              },
            },
            overrideAccess: true,
            context: {
              ...context,
              skipCloudinarySync: true,
            },
          })
        } catch (error) {
          req.payload.logger.error({ err: error, collection: 'media', id: doc.id }, 'Cloudinary sync failed')
          return doc
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (!doc?.cloudinary?.publicId) {
          return doc
        }

        try {
          await deleteFromCloudinary(doc.cloudinary.publicId)
        } catch {
          return doc
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Chú thích',
    },
    {
      name: 'externalURL',
      type: 'text',
      label: 'URL gốc',
      admin: {
        description: 'Dùng khi ảnh được sync từ CDN/external source.',
      },
    },
    {
      name: 'mime',
      type: 'text',
      hidden: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => siblingData?.mimeType || value,
        ],
      },
    },
    {
      name: 'cloudinary',
      type: 'group',
      label: 'Cloudinary',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'publicId',
          type: 'text',
          label: 'Public ID',
        },
        {
          name: 'secureUrl',
          type: 'text',
          label: 'Secure URL',
        },
        {
          name: 'resourceType',
          type: 'text',
          label: 'Resource type',
        },
        {
          name: 'format',
          type: 'text',
          label: 'Format',
        },
        {
          name: 'bytes',
          type: 'number',
          label: 'Size',
        },
        {
          name: 'version',
          type: 'text',
          label: 'Version',
        },
      ],
    },
  ],
}
