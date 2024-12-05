import { getTeamList } from "@/actions/team-actions"
import { TeamNamesType, TeamType } from "@/types/team"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Box, CircularProgress } from "@mui/material"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

interface TeamNode extends TeamType {
  children: TeamNode[]
}

type TeamTreeProps = {
  onSelectCode: (equipId: string) => void
}

export function TeamTree({ onSelectCode }: TeamTreeProps) {
  const { data: teamList, isLoading } = useQuery({
    queryKey: ["teamList"],
    queryFn: () => getTeamList(),
  })

  const buildTree = ({
    teamData,
    // breadcrumbs,
  }: {
    teamData: TeamType[]
    breadcrumbs: TeamNamesType[]
  }) => {
    const map: Record<string, TeamNode> = {}
    const roots: TeamNode[] = []

    teamData.forEach((node) => {
      map[node.team_code] = { ...node, children: [] }
    })

    teamData.forEach((node) => {
      if (node.upper_team_code) {
        map[node.upper_team_code].children.push(map[node.team_code])
      } else {
        roots.push(map[node.team_code])
      }
    })

    return roots
  }

  const getTreeData = useCallback(() => {
    return buildTree(teamList ?? { teamData: [], breadcrumbs: [] })
  }, [teamList])

  const renderTreeItems = (nodes: TeamNode[]) =>
    nodes.map((node) => (
      <TreeItem
        key={node.team_code}
        itemId={node.team_code}
        label={node.team_name}
        onClick={() => onSelectCode(node.team_code ?? "")}
        className="tree-depth2"
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
