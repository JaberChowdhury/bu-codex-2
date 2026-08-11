/**
 * Utility to compress and resize image files on the client side using HTML5 Canvas.
 * Converts large high-resolution images (JPEG/PNG) to optimized WEBP files.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  } = {}
): Promise<File> {
  const { maxWidth = 1000, maxHeight = 1000, quality = 0.75 } = options

  // If not an image or already smaller than 100KB, return original
  if (!file.type.startsWith("image/") || file.size < 100 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        } else {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        return resolve(file)
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file)

          const originalExt = file.name.split(".").pop() || "jpg"
          const baseName = file.name.replace(
            new RegExp(`\\.${originalExt}$`, "i"),
            ""
          )
          const newFileName = `${baseName}.webp`

          const compressedFile = new File([blob], newFileName, {
            type: "image/webp",
            lastModified: Date.now(),
          })

          // Return compressed file if it achieved size reduction
          if (compressedFile.size < file.size) {
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        "image/webp",
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}
