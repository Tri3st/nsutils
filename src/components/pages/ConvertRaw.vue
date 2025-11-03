<script setup lang="ts">

import {computed, ref} from "vue";
import { useAuthStore } from '@/stores/auth'
import { api } from "@/api";

const { isLoading } = useAuthStore();

type MimeGuess = {
  mime: string
  ext: string
}

const rawInput = ref<string>('');
const dataUrl = ref<string>('');
const error = ref<string>('');
const isConverting = ref<boolean>(false);
const isUploading = ref<boolean>(false);
const isDownloading = ref<boolean>(false);
const fileType = ref<string>('');

const fileName = ref<string>('image');

// Derived filename with extension based on mime type
const suggestedFileName = computed (() => {
  const { mime, ext } = parseMimeFromDataUrl(dataUrl.value) ?? { mime: '', ext: 'png' };
  console.log("suggestedFileName computed:", { mime, ext });
  fileType.value = ext;
  return fileName.value ? `${fileName.value}.${ext}` : `image.${ext}`;
})

function onSubmitConvert() {
  error.value = ''
  isConverting.value = true
  try {
    const normalized = normalizeToDataUrl(rawInput.value)
    dataUrl.value = normalized
    rawInput.value = normalized;
  } catch (e: any) {
    error.value = e?.message || 'Failed to convert input to an image.'
    dataUrl.value = ''
  } finally {
    isConverting.value = false
  }

}

// Normalize input into a proper data URL for an image
function normalizeToDataUrl(input: string): string {
  if (!input) throw new Error('Input is empty.')
  const trimmed = input.trim()

  const noQuotes = trimmed.replace(/^['"]|['"]$/g, '');

  // If it is an HTML element, try to extract src
  const htmlMatch = noQuotes.match(/<img [^>]*src=["']([^"']+)["'][^>]*>/i);

  let matched;

  if (htmlMatch) {
    matched = htmlMatch[1];
  } else {
    matched = noQuotes;
  }

  // If already a data URL with image mime, just return
  if (/^data:image\/[a-zA-Z0-9+.-]+;base64,/.test(matched)) {
    // minimal validation that the base64 part looks plausible
    const base64Part = matched.split(',')[1] ?? ''
    if (!isPlausibleBase64(base64Part)) {
      error.value = 'Provided data URL does not contain valid-looking base64.';
      throw new Error('Provided data URL does not contain valid-looking base64.');
    }
    return matched
  }

  // Otherwise, attempt to treat it as raw base64 (possibly with whitespace)
  const cleaned = matched.replace(/\s+/g, '')
  if (!isPlausibleBase64(cleaned)) {
    error.value = 'Input does not look like base64 image data.';
    throw new Error('Input does not look like base64 image data.');
  }

  const guess = guessMimeFromBase64(cleaned)
  return `data:${guess.mime};base64,${cleaned}`
}

// Heuristic base64 validation (not exhaustive, just to catch obvious issues)
function isPlausibleBase64(s: string): boolean {
  // Base64 chars + optional "=" padding
  // Also ensure length is reasonable
  if (s.length < 16) return false
  return /^[A-Za-z0-9+/]+={0,2}$/.test(s)
}

// Guess mime and extension from common image signatures
function guessMimeFromBase64(b64: string): MimeGuess {
  // Check common magic numbers in base64:
  // JPEG: /9j
  // PNG: iVBORw0
  // GIF: R0lGOD
  // WEBP: UklGR (RIFF WEBP) often starts with "UklGR" (lossless) or "RIFF" base64 "UklGR"
  // BMP: Qk
  // SVG: PHN2Zy (starts with "<svg" => PHN2Zy in base64)
  if (b64.startsWith('/9j')) return { mime: 'image/jpeg', ext: 'jpg' }
  if (b64.startsWith('iVBORw0')) return { mime: 'image/png', ext: 'png' }
  if (b64.startsWith('R0lGOD')) return { mime: 'image/gif', ext: 'gif' }
  if (b64.startsWith('UklGR') || b64.startsWith('R0lGRi')) return { mime: 'image/webp', ext: 'webp' }
  if (b64.startsWith('Qk')) return { mime: 'image/bmp', ext: 'bmp' }
  if (b64.startsWith('PHN2Zy')) return { mime: 'image/svg+xml', ext: 'svg' }
  // Default fallback
  return { mime: 'image/png', ext: 'png' }
}

function parseMimeFromDataUrl(url: string): MimeGuess | null {
  if (!url) return null
  const m = url.match(/^data:([^;]+);base64,/)
  if (!m) return null
  const mime = m[1]
  const ext = mimeToExt(mime)
  return { mime, ext }
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case 'image/jpeg': return 'jpg'
    case 'image/jpg': return 'jpg'
    case 'image/png': return 'png'
    case 'image/gif': return 'gif'
    case 'image/webp': return 'webp'
    case 'image/bmp': return 'bmp'
    case 'image/svg+xml': return 'svg'
    default: return 'bin'
  }
}

function dataUrlToBlob(url: string): { blob: Blob; mime: string } {
  const parsed = parseMimeFromDataUrl(url)
  if (!parsed) {
    error.value = 'Invalid data URL.';
    throw new Error('Invalid data URL.');
  }
  const base64 = url.split(',')[1]
  const byteChars = atob(base64)
  const byteNums = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNums)
  return { blob: new Blob([byteArray], { type: parsed.mime }), mime: parsed.mime }
}

function downloadImage() {
  error.value = ''
  isDownloading.value = true
  if (!dataUrl.value) return
  const a = document.createElement('a')
  a.href = dataUrl.value
  a.download = suggestedFileName.value
  document.body.appendChild(a)
  a.click()
  a.remove()
  isDownloading.value = false
}

async function uploadImage() {
  if (!dataUrl.value) return
  error.value = ''
  isUploading.value = true
  const { blob } = dataUrlToBlob(dataUrl.value)
  try {
    // Send file to API
    const formData = new FormData()
    formData.append('file', blob, suggestedFileName.value)

    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (response.status !== 200 && response.status !== 201) {
      error.value = `Upload failed with status ${response.status}.`;
      throw new Error(`Upload failed with status ${response.status}`);
    }
  } catch (e: any) {
    error.value = e?.message || 'Upload failed.'
  } finally {
    isUploading.value = false
  }
}


</script>

<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
    <span>Loading...</span>
  </div>
  <h1 class="text-3xl font-bold text-center mb-4">ConvertRaw</h1>
  <form @submit.prevent="onSubmitConvert" class="space-y-6">
    <textarea
        name="rawimage"
        id="rawimage"
        cols="150" rows="30"
        class="w-full h-64 p-2 border rounded font-mono"
        v-model="rawInput"
        placeholder="Paste base64 data here. With or without a header like: data:image/png;base64,iVBORw0... An HTML <img /> tag with src attribute is also accepted."
    ></textarea>
    <div class="flex items-center gap-2">
      <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          :disabled="isConverting || !rawInput.trim()"
      >
        {{ isConverting ? 'Converting...' : 'Convert' }}
      </button>

      <input
          type="text"
          class="border p-2 rounded"
          v-model="fileName"
          placeholder="Base file name (no extension)"
          aria-label="File name"
      />
      <span class="text-sm text-gray-600">Will save as: {{ suggestedFileName }}</span>

    </div>
  </form>

  <p class="text-red-600" v-if="error">{{ error }}</p>

  <div class="space-y-3" v-if="dataUrl">
    <h3 class="font-semibold">Preview</h3>
    <h4 class="font-normal text-lg border rounded p-2">Type: {{ fileType }}</h4>
    <div class="border rounded p-2 in;ine-block max-w-full">
      <img :src="dataUrl" alt="Converted Preview" class="max-w-full h-auto" />
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        :disabled="isUploading"
        @click="uploadImage"
      >
        {{ isUploading ? 'Uploading...' : 'Upload' }}
      </button>
    </div>
    <div class="flex items-center gap-2">
      <button
          type="button"
          class="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          :disabled="isDownloading"
          @click="downloadImage"
      >
        {{ isDownloading ? 'Downloading...' : 'Download' }}
      </button>
    </div>
  </div>


</template>