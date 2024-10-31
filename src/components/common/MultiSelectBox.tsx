import { CommonCode } from "@/types/commonCode"
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from "@mui/material"

interface MultiSelectBoxProps {
  label: string
  options: Partial<CommonCode>[]
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
  allOptionCode?: string
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

// MUI에서 사용할 수 있는 Chip 색상 목록
const chipColors: Array<
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = ["primary", "secondary", "error", "info", "success", "warning"]

const MultiSelectBox = (props: MultiSelectBoxProps) => {
  const { label, selectedItems, setSelectedItems, options, allOptionCode } = props

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event
    const selectedValues = typeof value === "string" ? value.split(",") : value
    if (allOptionCode) {
      const prevSelected = selectedItems.includes(allOptionCode)
      const nowSelected = selectedValues.includes(allOptionCode)

      if (!prevSelected && nowSelected) {
        setSelectedItems([allOptionCode])
        return
      } else if (prevSelected && nowSelected) {
        setSelectedItems(selectedValues.filter((item) => item !== allOptionCode))
        return
      } else if (selectedValues.length === 0) {
        setSelectedItems([allOptionCode])
        return
      }
    }
    setSelectedItems(selectedValues)
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
      <FormControl fullWidth>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          size="small"
          labelId={`${label}-label`}
          id="demo-controlled-open-select"
          label={label}
          multiple
          value={selectedItems}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((code, index) => {
                const option = options.find((item) => item.CODE === code)
                return (
                  <Chip
                    key={code}
                    label={option?.CODE_NAME || code}
                    color={chipColors[index % chipColors.length]}
                    size="small"
                    variant="outlined"
                  />
                )
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((item) => (
            <MenuItem key={item.CODE} value={item.CODE}>
              {item.CODE_NAME}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default MultiSelectBox
