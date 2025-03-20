import { createReadStream } from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import path from "path"
import { pipeline } from "stream"

const filePath = process.env.NEXT_PUBLIC_FILE_PATH ?? ""

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fileName = req.query.fileName as string
  const filePathWithFileName = path.join(filePath, fileName)

  try {
    const fileStream = createReadStream(filePathWithFileName)
    res.setHeader("Content-Type", "image/jpg")
    pipeline(fileStream, res, (error) => {
      if (error) console.error(error)
    })
  } catch (error) {
    console.error("Error serving file:", error)
    res.status(404).json({ message: "File not found" })
  }
}
