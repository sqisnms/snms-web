import { getProcessMast, insertProcessMast, updateProcessMast } from "@/actions/system-actions"
import { defaultProcessMast, ProcessMastType, ProcessMastTypeKor } from "@/types/system"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

type ProcessMastEditPopupProps = {
  open: boolean
  handleClose: () => void
  param: { serverId: string; processName: string } | null
  type: "add" | "mod"
}

export function ProcessMastEditPopup({
  open,
  handleClose,
  param,
  type,
}: ProcessMastEditPopupProps) {
  const queryClient = useQueryClient()
  const [editData, setEditData] = useState<ProcessMastType>(defaultProcessMast)

  const { data } = useQuery({
    queryKey: ["getProcessMast", param],
    queryFn: () => getProcessMast(param ?? { serverId: "", processName: "" }),
    enabled: type === "mod",
  })

  const insertMutation = useMutation({
    mutationFn: insertProcessMast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProcessMonitorList"],
      })
      queryClient.invalidateQueries({
        queryKey: ["getProcessMast"],
      })
      handleClose()
      toast.success("저장되었습니다")
    },
    onError: (e) => {
      toast.error(e.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateProcessMast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProcessMonitorList"],
      })
      queryClient.invalidateQueries({
        queryKey: ["getProcessMast"],
      })
      handleClose()
      toast.success("수정되었습니다")
    },
  })

  const handleSavePopup = () => {
    if (!editData.server_id || !editData.process_name) {
      toast.error("Server_ID 와 프로세스명은 필수항목입니다")
      return
    }
    if (type === "add") {
      insertMutation.mutate(editData)
    } else {
      updateMutation.mutate(editData)
    }
  }

  const handleChange = (key: string, value: string) => {
    setEditData({ ...editData, [key]: value })
  }

  useEffect(() => {
    if (type === "add") {
      setEditData(defaultProcessMast)
    } else if (data) {
      setEditData(data)
    } else {
      // 여기 들어올 일은 없음
      setEditData(defaultProcessMast)
    }
  }, [data, type, open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "435px",
          maxHeight: "435px",
        },
      }}
    >
      <DialogTitle className="dark:text-white">
        {type === "add" ? "프로세스 등록" : "프로세스 수정"}
      </DialogTitle>
      <DialogContent>
        {ProcessMastTypeKor.map((obj) => {
          return (
            <TextField
              key={`${obj.key}header`}
              label={obj.name}
              value={editData[obj.key]}
              onChange={(e) => {
                handleChange(obj.key, e.target.value)
              }}
              variant="outlined"
              size="small"
              fullWidth
              multiline={!!obj.text} // text가 true일 때 멀티라인 활성화
              minRows={obj.text ? 4 : undefined} // text가 true일 때 최소 4줄
              slotProps={{
                input: {
                  disabled: type === "mod" && !!obj.readOnlyOnUpdate,
                },
              }}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  fontSize: "0.875rem",
                  whiteSpace: "pre-wrap", // 줄바꿈 유지
                  wordBreak: "break-word", // 긴 문자열 줄바꿈 처리
                },
              }}
            />
          )
        })}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions className="p-4 pt-0 dark:bg-black">
        <Button onClick={handleSavePopup}>저장</Button>
        <Button onClick={handleClose} color="primary" className="dark:text-white">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}
