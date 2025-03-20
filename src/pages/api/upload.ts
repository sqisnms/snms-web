import formidable from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import path from "path"

const defaultFilePath = process.env.NEXT_PUBLIC_FILE_PATH ?? "/data/DOCKER_VOLUME/SNMS_WEB_FILES"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const form = formidable({})
      const [, files] = await form.parse(req)
      const filesArray = files.files
      if (!filesArray) {
        res.status(400).json({ message: "No files found" })
      }

      const filePaths = await Promise.all(
        filesArray?.map(async (file) => {
          const date = new Date()
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, "0")

          const prefix = `/${year}${month}/`
          const fileName = `${crypto.randomUUID()}_${file.originalFilename}`

          const filePathWithFileName = path.join(defaultFilePath, prefix + fileName)

          // 없는 경로 생성
          const folderPath = path.dirname(filePathWithFileName)
          await fs.promises.mkdir(folderPath, { recursive: true })

          // 파일 쓰기
          await fs.promises.rename(file.filepath, filePathWithFileName)
          return prefix + fileName
        }) ?? [],
      )

      res.status(201).json({ fileNames: filePaths })
    } catch (error) {
      console.error("Error uploading file:", error)
      res.status(500).json({ message: "Failed to upload file" })
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
