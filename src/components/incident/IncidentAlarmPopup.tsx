import { updateTerminate } from "@/actions/incident-action"
import { IncidentAlarmLogType, IncidentAlarmLogTypeKor } from "@/types/incident"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

type IncidentPopupProps = {
  incident: Partial<IncidentAlarmLogType>
  open: boolean
  handleClose: () => void
}

export function IncidentAlarmPopup({ incident, open, handleClose }: IncidentPopupProps) {
  const updateMutation = useMutation({
    mutationFn: () => updateTerminate(incident),
  })

  const handleSave = () => {
    updateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("저장했습니다.")
        handleClose()
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ height: "700px" }}>
      <DialogTitle>장애 상세</DialogTitle>
      <DialogContent>
        {IncidentAlarmLogTypeKor.map((obj) => {
          const value = incident[obj.key] || "" // 값이 없으면 빈 문자열로 처리

          return (
            <TextField
              key={`${obj.key}header`}
              label={obj.name}
              value={value}
              variant="outlined"
              size="small"
              fullWidth
              multiline={!!obj.text} // text가 true일 때 멀티라인 활성화
              minRows={obj.text ? 4 : undefined} // text가 true일 때 최소 4줄
              slotProps={{
                input: {
                  readOnly: true,
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

      <DialogActions>
        <Button onClick={handleSave} color="primary">
          수동 해제
        </Button>
        <Button onClick={handleClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}
