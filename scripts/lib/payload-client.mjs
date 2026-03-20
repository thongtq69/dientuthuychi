import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import config from './payload-config.mjs';
import { getPayload } from 'payload';

import { upsertMedia } from './media-utils.mjs';

const projectRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const PLACEHOLDER_IMAGE_SOURCE = '/images/product-placeholder.svg'

let payloadPromise;

export async function destroyPayloadClient() {
  if (!payloadPromise) {
    return
  }

  const payload = await payloadPromise
  payloadPromise = null
  await payload.destroy()
}

function toRichTextParagraphs(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  }
}

function normalizeStatus(status) {
  return status === 'out_of_stock' ? 'out-of-stock' : status || 'active'
}

function normalizeInventory(inventory) {
  if (!Array.isArray(inventory)) {
    return []
  }

  return inventory.map((item) => ({
    label: item.label || 'Kho mac dinh',
    quantity: Number(item.quantity || 0),
    available: item.available ?? Number(item.quantity || 0) > 0,
  }))
}

function normalizeHighlights(highlights) {
  if (!Array.isArray(highlights)) {
    return []
  }

  return highlights.filter(Boolean).map((value) => ({ value }))
}

function normalizeLabels(labels) {
  if (!Array.isArray(labels)) {
    return []
  }

  return labels.filter(Boolean).map((text) => ({ text }))
}

function normalizeVariants(variants, fallbackPrice) {
  if (!Array.isArray(variants)) {
    return []
  }

  const seen = new Set()

  return variants
    .map((variant, index) => ({
      name: variant.name || variant.label || `Variant ${index + 1}`,
      sku: variant.sku || variant.slug || null,
      price: typeof variant.price === 'number' ? variant.price : fallbackPrice,
      stock: typeof variant.stock === 'number' ? variant.stock : 0,
      color: variant.color || variant.label || null,
    }))
    .filter((variant) => {
      const key = `${variant.sku || ''}::${variant.name}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
}

function normalizeSource(source, product) {
  return {
    provider: Array.isArray(source?.mergedDatasets) ? source.mergedDatasets.join(', ') : source?.dataset || null,
    sourceId: Array.isArray(source?.ids) ? source.ids.join(', ') : source?.id || null,
    url: product.raw?.href || product.raw?.source_url || null,
    lastSyncedAt: new Date().toISOString(),
  }
}

async function getOrCreateCategory(payload, product) {
  const existing = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      slug: {
        equals: product.categorySlug,
      },
    },
  })

  if (existing.docs.length > 0) {
    return existing.docs[0]
  }

  return payload.create({
    collection: 'categories',
    data: {
      title: product.category,
      slug: product.categorySlug,
      description: `Auto-created by Task 2 product importer for ${product.category}.`,
      isActive: true,
    },
    overrideAccess: true,
  })
}

async function resolveMedia(payload, source, alt, tempDir, report, slug = alt) {
  const targetSource = source || PLACEHOLDER_IMAGE_SOURCE

  try {
    const mediaDoc = await upsertMedia(payload, targetSource, {
      alt,
      projectRoot,
      report,
      tempDir,
    })

    return mediaDoc?.id || null
  } catch (error) {
    if (targetSource === PLACEHOLDER_IMAGE_SOURCE) {
      throw error
    }

    report.brokenMappings?.push({ slug, reason: `${error.message}; fallback placeholder image` })

    const fallbackDoc = await upsertMedia(payload, PLACEHOLDER_IMAGE_SOURCE, {
      alt,
      projectRoot,
      report,
      tempDir,
    })

    return fallbackDoc?.id || null
  }
}

async function buildProductData(payload, product, tempDir, report) {
  const category = await getOrCreateCategory(payload, product)
  const image = await resolveMedia(payload, product.image, product.name, tempDir, report, product.slug)
  const inventory = normalizeInventory(product.inventory)
  const gallery = []

  for (const source of product.gallery || []) {
    const galleryImageId = await resolveMedia(payload, source, product.name, tempDir, report, product.slug)

    if (galleryImageId && galleryImageId !== image && !gallery.some((item) => item.image === galleryImageId)) {
      gallery.push({ image: galleryImageId, alt: product.name })
    }
  }

  return {
    name: product.name,
    slug: product.slug,
    productGroup: product.productGroup || undefined,
    sku: product.source?.sku || product.raw?.sku || undefined,
    status: normalizeStatus(product.status),
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    inventory,
    stock: inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    isActive: normalizeStatus(product.status) === 'active',
    category: category.id,
    categorySlug: product.categorySlug,
    brand: product.brand || undefined,
    family: product.raw?.family || undefined,
    image,
    mainImage: image,
    gallery,
    description: toRichTextParagraphs(product.description || []),
    highlights: normalizeHighlights(product.highlights),
    specs: product.specs || [],
    technical_specifications: product.technical_specifications || {},
    specifications: product.technical_specifications || product.specs || {},
    variants: normalizeVariants(product.variants, product.price),
    labels: normalizeLabels(product.labels),
    seo: {
      title: product.seo?.title || product.name,
      description: product.seo?.description || null,
      image,
    },
    source: normalizeSource(product.source, product),
  }
}

async function syncProductVariants(payload, productId, variants, report, slug) {
  try {
    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        variants,
      },
      overrideAccess: true,
    })
  } catch (error) {
    report.brokenMappings?.push({ slug, reason: `Variant sync skipped: ${error.message}` })
  }
}

export async function getPayloadClient() {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config })
  }

  return payloadPromise
}

export async function upsertProductsToPayload(products, report = {}) {
  const payload = await getPayloadClient()
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'task-2-products-'))
  const variantPatches = []
  const result = {
    created: 0,
    updated: 0,
    skipped: 0,
  }

  try {
    for (const product of products) {
      try {
        const duplicateField = product.productGroup ? 'productGroup' : 'slug'
        const duplicateValue = product.productGroup || product.slug
        const existing = await payload.find({
          collection: 'products',
          depth: 0,
          limit: 1,
          pagination: false,
          overrideAccess: true,
          where: {
            [duplicateField]: {
              equals: duplicateValue,
            },
          },
        })

        if (existing.docs.length === 0 && duplicateField !== 'slug') {
          const existingBySlug = await payload.find({
            collection: 'products',
            depth: 0,
            limit: 1,
            pagination: false,
            overrideAccess: true,
            where: {
              slug: {
                equals: product.slug,
              },
            },
          })

          if (existingBySlug.docs.length > 0) {
            existing.docs = existingBySlug.docs
          }
        }

        const data = await buildProductData(payload, product, tempDir, report)
        const variants = data.variants
        const baseData = {
          ...data,
          variants: [],
        }
        if (!data.image) {
          report.missingImageSources?.push({ slug: product.slug, reason: 'missing-primary-image' })
          result.skipped += 1
          continue
        }

        if (existing.docs.length > 0) {
          await payload.update({
            collection: 'products',
            id: existing.docs[0].id,
            data: baseData,
            overrideAccess: true,
          })
          if (variants.length > 0) {
            variantPatches.push({ id: existing.docs[0].id, slug: product.slug, variants })
          }
          result.updated += 1
          if ((report.sampleChecks?.length || 0) < 5) {
            report.sampleChecks?.push({
              slug: product.slug,
              mode: 'updated',
              categorySlug: product.categorySlug,
              productGroup: product.productGroup || null,
              galleryCount: data.gallery.length,
              variantCount: data.variants.length,
            })
          }
          continue
        }

        try {
          await payload.create({
            collection: 'products',
            data: baseData,
            overrideAccess: true,
          })
        } catch (error) {
          if (String(error.message || '').includes('slug')) {
            const existingBySlug = await payload.find({
              collection: 'products',
              depth: 0,
              limit: 1,
              pagination: false,
              overrideAccess: true,
              where: {
                slug: {
                  equals: product.slug,
                },
              },
            })

            if (existingBySlug.docs.length > 0) {
              await payload.update({
                collection: 'products',
                id: existingBySlug.docs[0].id,
                data: baseData,
                overrideAccess: true,
              })
              if (variants.length > 0) {
                variantPatches.push({ id: existingBySlug.docs[0].id, slug: product.slug, variants })
              }
              result.updated += 1
              continue
            }
          }

          throw error
        }
        const createdDocLookup = await payload.find({
          collection: 'products',
          depth: 0,
          limit: 1,
          pagination: false,
          overrideAccess: true,
          where: {
            slug: {
              equals: product.slug,
            },
          },
        })
        if (createdDocLookup.docs[0] && variants.length > 0) {
          variantPatches.push({ id: createdDocLookup.docs[0].id, slug: product.slug, variants })
        }
        result.created += 1
        if ((report.sampleChecks?.length || 0) < 5) {
          report.sampleChecks?.push({
            slug: product.slug,
            mode: 'created',
            categorySlug: product.categorySlug,
            productGroup: product.productGroup || null,
            galleryCount: data.gallery.length,
            variantCount: data.variants.length,
          })
        }
      } catch (error) {
        report.brokenMappings?.push({ slug: product.slug, reason: error.message })
        result.skipped += 1
      }
    }

    for (const patch of variantPatches) {
      await syncProductVariants(payload, patch.id, patch.variants, report, patch.slug)
    }

    return result
  } finally {
    await fs.rm(tempDir, { force: true, recursive: true })
  }
}
