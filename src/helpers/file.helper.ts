const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error("Failed to read file"))
      }
    }
    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }
    reader.readAsDataURL(file)
  })
}

interface Base64ToFileOptions {
  base64: string
  filename: string
}

const base64ToFile = ({ base64, filename }: Base64ToFileOptions): File => {
  const arr = base64.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])

  const charCodes = Array.from(bstr).map((char) => char.charCodeAt(0))
  const u8arr = new Uint8Array(charCodes)

  return new File([u8arr], filename, { type: mime })
}

export { base64ToFile, fileToBase64 }
