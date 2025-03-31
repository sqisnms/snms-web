import { getCmsMainInfo, updateMainCms } from "@/actions/cms-action"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"

function CmsMain() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

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

  const { data: cmsMainList, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <Box className="flex min-h-[400px] items-center justify-center">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="mx-auto">
      <Paper elevation={3} className="mb-6 rounded-lg bg-gray-100 p-4">
        <Typography
          variant="h6"
          component="h1"
          className="mb-3 border-b pb-2 font-bold text-gray-800"
        >
          메인 페이지 설정
        </Typography>

        {/* 여기에서 flex-col을 모바일 환경에서 적용하도록 변경 */}
        <Box className={`flex ${isMobile ? "flex-col" : "flex-row flex-wrap"} gap-4`}>
          {/* 배경 이미지 */}
          <Box className={`${isMobile ? "w-full" : "min-w-[30%] flex-1"}`}>
            <Typography variant="subtitle1" className="mb-2 font-medium text-gray-700">
              배경 이미지
            </Typography>

            <Card className="bg-gray-50 transition-shadow duration-300 hover:shadow-md">
              <CardContent>
                <Box className="mb-4">
                  <FormControl variant="outlined" fullWidth>
                    <OutlinedInput
                      id="bg_upload"
                      type="file"
                      className="bg-white"
                      notched
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFileChange("bg", e.target.files?.[0] ?? null)
                      }
                      startAdornment={<CloudUploadIcon className="mr-2 text-gray-500" />}
                    />
                  </FormControl>
                </Box>

                {cms.bgPath ? (
                  <Box className="mt-3 rounded-md border border-solid border-gray-300 bg-white p-2">
                    <Image
                      src={`/api/file?fileName=${cms.bgPath}`}
                      width={300}
                      height={150}
                      alt="배경 이미지"
                      className="h-auto w-full rounded object-cover"
                      unoptimized
                    />
                    <Typography variant="caption" className="mt-1 block text-gray-500">
                      현재 배경 이미지: {cms.bgPath?.split("/").pop()}
                    </Typography>
                  </Box>
                ) : (
                  <Box className="mt-3 flex h-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-100 p-4">
                    <Typography variant="body2" className="text-center text-gray-500">
                      배경 이미지가 설정되지 않았습니다
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* 로고 이미지 */}
          <Box className={`${isMobile ? "w-full" : "min-w-[30%] flex-1"}`}>
            <Typography variant="subtitle1" className="mb-2 font-medium text-gray-700">
              로고 이미지
            </Typography>

            <Card className="bg-gray-50 transition-shadow duration-300 hover:shadow-md">
              <CardContent>
                <Box className="mb-4">
                  <FormControl variant="outlined" fullWidth>
                    <OutlinedInput
                      id="logo_upload"
                      type="file"
                      className="bg-white"
                      notched
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFileChange("logo", e.target.files?.[0] ?? null)
                      }
                      startAdornment={<CloudUploadIcon className="mr-2 text-gray-500" />}
                    />
                  </FormControl>
                </Box>

                {cms.logoPath ? (
                  <Box className="mt-3 rounded-md border border-solid border-gray-300 bg-white p-2">
                    <Box className="flex h-20 items-center justify-center">
                      <Image
                        src={`/api/file?fileName=${cms.logoPath}`}
                        width={200}
                        height={60}
                        alt="로고 이미지"
                        className="max-h-16 object-contain"
                        unoptimized
                      />
                    </Box>
                    <Typography variant="caption" className="mt-1 block text-gray-500">
                      현재 로고 이미지: {cms.logoPath?.split("/").pop()}
                    </Typography>
                  </Box>
                ) : (
                  <Box className="mt-3 flex h-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-100 p-4">
                    <Typography variant="body2" className="text-center text-gray-500">
                      로고 이미지가 설정되지 않았습니다
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* 텍스트 설정 */}
          <Box className={`${isMobile ? "w-full" : "min-w-[30%] flex-1"}`}>
            <Typography variant="subtitle1" className="mb-2 font-medium text-gray-700">
              텍스트 설정
            </Typography>

            <Card className="bg-gray-50 transition-shadow duration-300 hover:shadow-md">
              <CardContent>
                <Grid container spacing={3} direction="column">
                  {/* 메인 타이틀 */}
                  <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="mainTitle" shrink className="bg-gray-50 px-1">
                        메인 타이틀
                      </InputLabel>
                      <OutlinedInput
                        id="mainTitle"
                        type="text"
                        value={cms.mainTitle}
                        label="메인 타이틀"
                        className="bg-white"
                        placeholder="메인 페이지 타이틀을 입력하세요"
                        notched
                        onChange={(e) => handleTextChange("mainTitle", e.target.value)}
                      />
                      <Typography variant="caption" className="mt-1 text-gray-500">
                        메인 페이지에 표시될 큰 제목입니다
                      </Typography>
                    </FormControl>
                  </Grid>

                  {/* 서브 타이틀 */}
                  <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="subTitle" shrink className="bg-gray-50 px-1">
                        서브 타이틀
                      </InputLabel>
                      <OutlinedInput
                        id="subTitle"
                        type="text"
                        value={cms.subTitle}
                        label="서브 타이틀"
                        className="bg-white"
                        placeholder="서브 타이틀을 입력하세요"
                        notched
                        onChange={(e) => handleTextChange("subTitle", e.target.value)}
                      />
                      <Typography variant="caption" className="mt-1 text-gray-500">
                        메인 타이틀 아래에 표시될 부제목입니다
                      </Typography>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            size="large"
            className="bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700"
            startIcon={<SaveIcon />}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "저장 중..." : "설정 저장"}
          </Button>
        </Box>
      </Paper>

      {/* 미리보기 섹션 */}
      <Paper elevation={3} className="rounded-lg bg-white p-4">
        <Typography
          variant="h6"
          component="h2"
          className="mb-4 border-b pb-2 font-medium text-gray-800"
        >
          미리보기
        </Typography>

        <Box
          className="relative overflow-hidden rounded-lg border border-gray-300"
          style={{ height: "200px" }}
        >
          {cms.bgPath ? (
            <Image
              src={`/api/file?fileName=${cms.bgPath}`}
              fill
              alt="배경 미리보기"
              className="object-cover"
              unoptimized // 이게 있어야 /api/file 이 제대로 먹힘. 최적화 방지.
            />
          ) : (
            <Box className="flex h-full w-full items-center justify-center bg-gray-200">
              <Typography variant="body2" className="text-gray-500">
                배경 이미지 미리보기
              </Typography>
            </Box>
          )}

          <Box
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            {cms.logoPath && (
              <Box className="mb-4 rounded bg-white p-2">
                <Image
                  src={`/api/file?fileName=${cms.logoPath}`}
                  width={180}
                  height={60}
                  alt="로고 미리보기"
                  className="h-12 w-auto object-contain"
                  unoptimized
                />
              </Box>
            )}

            {cms.mainTitle && (
              <Typography variant="h4" className="text-shadow mb-2 text-center font-bold">
                {cms.mainTitle}
              </Typography>
            )}

            {cms.subTitle && (
              <Typography variant="subtitle1" className="text-shadow text-center">
                {cms.subTitle}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default CmsMain
