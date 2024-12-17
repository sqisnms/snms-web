import { getMenu } from "@/actions/menu-actions"
import { BreadcrumbType, MenuType } from "@/types/menu"
import AddIcon from "@mui/icons-material/Add"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

interface MenuNode extends MenuType {
  children: MenuNode[]
}

type MenuTreeProps = {
  onSelectCode: (equipId: string) => void
  setTempMenu: (tempMenu: Partial<MenuType> | undefined) => void
}

export function MenuTree({ onSelectCode, setTempMenu }: MenuTreeProps) {
  const { data: menuList, isLoading } = useQuery({
    queryKey: ["menuList"],
    queryFn: () => getMenu(),
  })

  const buildTree = ({
    menuData,
    // breadcrumbs,
  }: {
    menuData: MenuType[]
    breadcrumbs: BreadcrumbType[]
  }) => {
    const map: Record<string, MenuNode> = {}
    const roots: MenuNode[] = []

    menuData.forEach((node) => {
      map[node.menu_id] = { ...node, children: [] }
    })

    menuData.forEach((node) => {
      if (node.upper_menu_id) {
        map[node.upper_menu_id].children.push(map[node.menu_id])
      } else {
        roots.push(map[node.menu_id])
      }
    })

    return roots
  }

  const getTreeData = useCallback(() => {
    return buildTree(menuList ?? { menuData: [], breadcrumbs: [] })
  }, [menuList])

  function getNextMenuId() {
    // 숫자 부분 추출 및 최대값 계산
    const maxNumber =
      menuList?.menuData
        .map((menu) => parseInt(menu.menu_id.replace("MENU", ""), 10)) // "MENU001" -> 1
        .reduce((max, num) => Math.max(max, num), 0) ?? 0 // 최대값 찾기

    // 다음 ID 계산
    const nextNumber = maxNumber + 1

    // 숫자 부분에 패딩 추가 (최대 3자리)
    const paddedNumber = String(nextNumber).padStart(3, "0")

    // 새로운 ID 생성
    return `MENU${paddedNumber}`
  }

  const getNextMenuOrder = (upper_menu_id: string) => {
    const treeData = getTreeData()
    const parentMenu = treeData.find((d) => {
      return d.menu_id === upper_menu_id
    })

    const order =
      parentMenu?.children
        .map((menu) => menu.menu_order ?? 0)
        .reduce((max, num) => Math.max(max, num), 0) ?? 0

    return order + 1
  }

  const handleAddChild = (upper_menu_id: string) => {
    const newMenu = {
      menu_id: getNextMenuId(),
      upper_menu_id,
      menu_order: getNextMenuOrder(upper_menu_id),
      use_yn_code: "Y",
    } as Partial<MenuType>
    setTempMenu(newMenu)
  }

  const renderTreeItems = (nodes: MenuNode[]) =>
    nodes.map((node) => (
      <TreeItem
        key={node.menu_id}
        itemId={node.menu_id}
        // label={node.menu_name}
        // onClick={() => onSelectCode(node.menu_id ?? "")}
        className="tree-depth2"
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={(e) => {
              e.stopPropagation()
              onSelectCode(node.menu_id ?? "")
            }}
          >
            <Box>{node.menu_name}</Box>
            <Tooltip title={`${node.menu_name} (${node.menu_id}) 하위 메뉴 추가`} arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation() // 부모 노드 확장을 막음
                  handleAddChild(node.menu_id)
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
        sx={{
          padding: "0",
        }}
      >
        {node.children.length > 0 && renderTreeItems(node.children)}
      </TreeItem>
    ))

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
      {renderTreeItems(getTreeData())}
    </SimpleTreeView>
  )
}
