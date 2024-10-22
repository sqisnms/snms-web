import { sampleClickHouse, sampleMariaDB, samplePostgres } from "@/actions/sample-actions"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

export const usePostgresSample = (
  param?: Record<string, string>,
  queryOptions?: Partial<UseQueryOptions>,
) => {
  const queryKey = ["samplePostgres"]
  const action = samplePostgres

  const result = useQuery({
    queryKey,
    queryFn: () => action(), // param 이 있는 경우 action(param)
    ...(queryOptions ?? {}),
  })

  return {
    ...result,
    data: result.data as Awaited<ReturnType<typeof action>>,
    queryKey,
  }
}

export const useMariaDBSample = (
  param?: Record<string, string>,
  queryOptions?: Partial<UseQueryOptions>,
) => {
  const queryKey = ["sampleMariaDB"]
  const action = sampleMariaDB

  const result = useQuery({
    queryKey,
    queryFn: () => action(), // param 이 있는 경우 action(param)
    ...(queryOptions ?? {}),
  })

  return {
    ...result,
    data: result.data as Awaited<ReturnType<typeof action>>,
    queryKey,
  }
}
export const useClickHouseSample = (
  param?: Record<string, string>,
  queryOptions?: Partial<UseQueryOptions>,
) => {
  const queryKey = ["sampleClickHouse"]
  const action = sampleClickHouse

  const result = useQuery({
    queryKey,
    queryFn: () => action(), // param이 있는 경우 action(param)
    ...(queryOptions ?? {}),
  })

  return {
    ...result,
    data: result.data as Awaited<ReturnType<typeof action>>,
    queryKey,
  }
}
