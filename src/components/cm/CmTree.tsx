import { getCMTree } from "@/actions/cm-actions"
import { CMTreeType } from "@/types/cm"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Box, CircularProgress } from "@mui/material"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"

interface CMTreeNode extends CMTreeType {
  children: CMTreeNode[]
}

type CMTreeProps = {
  onSelectCode: (equipId: string) => void
}

export function CMTree({ onSelectCode }: CMTreeProps) {
  const [selectedRow, setSelectedRow] = useState<string>("")
  const { data: treeList, isLoading } = useQuery({
    queryKey: ["cmTree"],
    queryFn: () => getCMTree(),
  })

  useEffect(() => {
    onSelectCode(selectedRow)
  }, [selectedRow, onSelectCode])

  const buildTree = ({ treeData }: { treeData: CMTreeType[] }) => {
    const map: Record<string, CMTreeNode> = {}
    const roots: CMTreeNode[] = []

    treeData.forEach((node) => {
      map[node.id] = { ...node, children: [] }
    })

    treeData.forEach((node) => {
      if (node.parent_id) {
        map[node.parent_id].children.push(map[node.id])
      } else {
        roots.push(map[node.id])
      }
    })

    return roots
  }

  const getTreeData = useCallback(() => {
    return buildTree(treeList ?? { treeData: [] })
  }, [treeList])

  const renderTreeItems = (nodes: CMTreeNode[]) =>
    nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={(e) => {
              if (node.children.length === 0) {
                // 리프 노드일 때만 onClick 동작 수행
                e.stopPropagation()
                setSelectedRow(node.id ?? "")
              }
            }}
          >
            <Box>{node.id}</Box>
          </Box>
        }
        // onClick={() => onSelectCode(node.team_code ?? "")}
        className="tree-depth2"
        sx={{
          padding: "0",
          cursor: "pointer",
          backgroundColor: selectedRow === node.id ? "#e0f7fa" : undefined,
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
      sx={{ p: 2, borderRadius: 1, boxShadow: 1, maxHeight: "600px", overflow: "auto" }}
    >
      <TreeItem
        key="all"
        itemId="all"
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            // onClick={(e) => {
            //   e.stopPropagation()
            //   onSelectCode("")
            // }}
          >
            <Box>전체</Box>
          </Box>
        }
      >
        {renderTreeItems(getTreeData())}
      </TreeItem>
    </SimpleTreeView>
  )
}
