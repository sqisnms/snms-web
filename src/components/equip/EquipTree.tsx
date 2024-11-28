import { getEquipList } from "@/actions/equip-actions"
import { EquipType } from "@/types/equip"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Box, CircularProgress } from "@mui/material"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useQuery } from "@tanstack/react-query"

type EquipTreeProps = {
  onSelectEquipTypeCode: (equipId: string) => void
}

export function EquipTree({ onSelectEquipTypeCode }: EquipTreeProps) {
  const { data: equipList = [], isLoading } = useQuery({
    queryKey: ["equipList"],
    queryFn: () => getEquipList(),
  })

  const groupBy = (array: Partial<EquipType>[], key: "net_type_code" | "equip_type_code") => {
    return array.reduce(
      (acc, currentValue) => {
        const groupKey = currentValue[key]
        if (!groupKey) return acc

        return {
          ...acc,
          [groupKey]: [...(acc[groupKey] || []), currentValue],
        }
      },
      {} as Record<string, Partial<EquipType>[]>,
    )
  }

  // 트리 항목을 렌더링하는 함수
  const renderTreeItems = () => {
    // 먼저 NET_TYPE_CODE로 그룹화
    const netTypeGroups = groupBy(equipList, "net_type_code")

    return Object.keys(netTypeGroups).map((netType, index) => (
      <TreeItem key={netType} itemId={netType} label={netType}>
        {/* 각 NET_TYPE_CODE 아래에서 다시 EQUIP_TYPE_CODE로 그룹화 */}
        {groupBy(netTypeGroups[netType], "equip_type_code") &&
          Object.keys(groupBy(netTypeGroups[netType], "equip_type_code")).map((equipType) => (
            <TreeItem
              key={equipType}
              itemId={equipType + index}
              label={equipType}
              onClick={() => onSelectEquipTypeCode(equipType ?? "")}
              className="tree-depth2"
              sx={{
                padding: "0",
              }}
            >
              {/* 3뎁스라면 - 각 EQUIP_TYPE_CODE 아래에서 실제 장비 목록을 렌더링 */}
              {/* {netTypeGroups[netType]
                .filter((item) => item.EQUIP_TYPE_CODE === equipType)
                .map((equip) => (
                  <TreeItem
                    key={equip.EQUIP_ID}
                    itemId={equip.EQUIP_ID ?? ""}
                    label={equip.EQUIP_NAME}
                    onClick={() => onSelectEquipId(equip.EQUIP_ID ?? "")}
                  />
                ))} */}
            </TreeItem>
          ))}
      </TreeItem>
    ))
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10rem",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <SimpleTreeView
      slots={{
        collapseIcon: ExpandMoreIcon,
        expandIcon: ChevronRightIcon,
      }}
      sx={{ p: 2, borderRadius: 1, boxShadow: 1 }}
    >
      {renderTreeItems()}
    </SimpleTreeView>
  )
}
