import { getCmsMainInfo, updateMainCms } from "@/actions/cms-action"
import { Box, Button, FormControl, InputLabel, OutlinedInput } from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"

function CmsMain() {
  type MainCmsType = {
    bg: File | null
    logo: File | null
    mainTitle: string
    subTitle: string
    bgPath: string | null
    logoPath: string | null
  }
  const emptyCms = {
    bg: null,
    logo: null,
    mainTitle: "",
    subTitle: "",
    bgPath: null,
    logoPath: null,
  } as MainCmsType
  const [cms, setCms] = useState<MainCmsType>(emptyCms)
  const [validToSave, setValidToSave] = useState(false)

  const { data: cmsMainList } = useQuery({
    queryKey: ["getCmsMainInfo"],
    queryFn: () => getCmsMainInfo(),
  })

  const updateMutation = useMutation({
    mutationFn: () =>
      updateMainCms({
        bg: cms.bgPath ?? "",
        logo: cms.logoPath ?? "",
        mainTitle: cms.mainTitle,
        subTitle: cms.subTitle,
      }),
  })

  useEffect(() => {
    const newCms = cmsMainList?.reduce((acc, curr) => {
      if (curr.config_name === "INIT_MAIN_LOGO") {
        acc.logoPath = curr.value6
      } else if (curr.config_name === "INIT_MAIN_BG") {
        acc.bgPath = curr.value6
      } else if (curr.config_name === "INIT_MAIN_TITLE") {
        acc.mainTitle = curr.value6 ?? ""
      } else if (curr.config_name === "INIT_MAIN_SUBTITLE") {
        acc.subTitle = curr.value6 ?? ""
      }
      return acc
    }, emptyCms)
    setCms(newCms ?? emptyCms)
  }, [cmsMainList])

  useEffect(() => {
    if (!validToSave || !cms.bgPath || !cms.logoPath) return
    updateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("저장되었습니다.")
        setValidToSave(false)
      },
      onError: (error) => {
        setValidToSave(false)
        console.error("Error saving changes:", error)
      },
    })
  }, [validToSave, cms.bgPath, cms.logoPath])

  const handleFileChange = async (key: string, value: File | null) => {
    let additionalProps
    if (key === "bg") {
      additionalProps = { bgPath: null }
    } else if (key === "logo") {
      additionalProps = { logoPath: null }
    } else {
      additionalProps = {}
    }
    setCms({
      ...cms,
      [key]: value,
      ...additionalProps,
    })
  }

  const handleTextChange = (key: string, value: string) => {
    setCms({
      ...cms,
      [key]: value,
    })
  }

  const handleSave = async () => {
    // 이미 저장된 이미지를 사용할 경우 새로 업로드할 필요 없음.
    if (cms.bgPath && cms.logoPath) {
      setValidToSave(true)
      return
    }

    // 새로 업로드할 파일이 지정되지 않았을 경우
    if (!cms.bg || !cms.logo) {
      toast.error("배경과 로고는 필수 항목입니다.")
      return
    }

    // 파일업로드 시 action 을 이용하는 법. File 자체는 전달안되고 base64로 전달가능하며
    // 기본 1MB 제한이 있지만, next.config.mjs 에서 bodySizeLimit 설정으로 늘려줄 수 있음.
    // updateMutation.mutate()

    // 파일업로드 시 page api 를 이용하는 법. File 을 form 에 넣어 직접 전달 가능.
    const formData = new FormData()
    // if (cms.bg) formData.append("files", cms.bg)
    // if (cms.logo) formData.append("logo", cms.logo)
    // formData.append("mainTitle", cms.mainTitle)
    // formData.append("subTitle", cms.subTitle)
    const files = [cms.bg, cms.logo]
    files.forEach((file) => formData.append("files", file))

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to save CMS")
    }

    const { fileNames } = (await response.json()) as { fileNames: string[] }
    if (fileNames.length !== files.length) {
      toast.error("파일 업로드에 문제가 발생했습니다.")
      return
    }
    setCms({
      ...cms,
      bgPath: fileNames[0],
      logoPath: fileNames[1],
    })
    setValidToSave(true)
  }

  return (
    <Box>
      <Box>
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="bg_upload" shrink>
            배경 업로드
          </InputLabel>
          <OutlinedInput
            id="bg_upload"
            type="file"
            label="배경 업로드"
            notched
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFileChange("bg", e.target.files?.[0] ?? null)
            }
          />
        </FormControl>

        {cms.bgPath && (
          <Image
            src={`/api/file?fileName=${cms.bgPath}`}
            width="130"
            height="40"
            alt="로고"
            className="h-10 border border-solid border-gray-500 bg-gray-100"
            unoptimized // 이게 있어야 /api/file 이 제대로 먹힘. 최적화 방지.
          />
        )}
      </Box>
      <Box>
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="logo_upload" shrink>
            로고 업로드
          </InputLabel>
          <OutlinedInput
            id="logo_upload"
            type="file"
            label="로고 업로드"
            notched
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFileChange("logo", e.target.files?.[0] ?? null)
            }
          />

          {cms.logoPath && (
            <Image
              src={`/api/file?fileName=${cms.logoPath}`}
              width="130"
              height="40"
              alt="로고"
              className="h-10 border border-solid border-gray-500 bg-gray-100"
              unoptimized // 이게 있어야 /api/file 이 제대로 먹힘. 최적화 방지.
            />
          )}
        </FormControl>
      </Box>
      <Box>
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="mainTitle" shrink>
            메인 타이틀
          </InputLabel>
          <OutlinedInput
            id="mainTitle"
            type="text"
            value={cms.mainTitle}
            label="메인 타이틀"
            notched
            sx={{ mb: 2 }}
            onChange={(e) => handleTextChange("mainTitle", e.target.value)}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="subTitle" shrink>
            서브 타이틀
          </InputLabel>
          <OutlinedInput
            id="subTitle"
            type="text"
            value={cms.subTitle}
            label="서브 타이틀"
            notched
            sx={{ mb: 2 }}
            onChange={(e) => handleTextChange("subTitle", e.target.value)}
          />
        </FormControl>
      </Box>
      <Button onClick={handleSave} color="primary" variant="outlined">
        저장
      </Button>
    </Box>
  )
}

export default CmsMain
