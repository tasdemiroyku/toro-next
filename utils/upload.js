/**
 * utils/upload.js
 *
 * Reusable image upload utility for Supabase Storage.
 * Output is compressed, converted to WebP, and returns the Public URL.
 */

import { createClient } from '@/utils/supabase/client'

const BUCKET = 'toro-uploads'
const MAX_DIMENSION = 1200
const COMPRESSION_QUALITY = 0.82
const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateImageFile(file) {
  if (!file) throw new Error('No file provided.')
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, WebP, or GIF image.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be smaller than 5 MB.')
  }
}

export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width / height) * MAX_DIMENSION)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      const outputType = canvas.toDataURL('image/webp').startsWith('data:image/webp')
        ? 'image/webp'
        : 'image/jpeg'

      canvas.toBlob(
        blob => {
          if (!blob) reject(new Error('Canvas toBlob failed'))
          else resolve(blob)
        },
        outputType,
        COMPRESSION_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for compression'))
    }

    img.src = url
  })
}

async function uploadBlob(blob, storagePath) {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, blob, {
      contentType: blob.type,
      upsert: true,
      cacheControl: '3600',
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

// ─── Public Functions ─────────────────────────────────────────────────────────

export async function uploadAvatar(file, userId) {
  validateImageFile(file)
  const blob = await compressImage(file)
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  return uploadBlob(blob, `avatars/${userId}/avatar.${ext}`)
}

export async function uploadListingImage(file, userId, listingId) {
  validateImageFile(file)
  const blob = await compressImage(file)
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  
  const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Date.now().toString()
    
  return uploadBlob(blob, `listings/${userId}/${listingId}/${uniqueId}.${ext}`)
}