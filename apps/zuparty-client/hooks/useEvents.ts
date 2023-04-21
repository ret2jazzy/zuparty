import { QueryKey, useQuery, UseQueryOptions } from "react-query"
import { ZuEvent } from "../src/types";
import { fetcher } from "../utils/fetcher";

export const useEvents = <TData extends ZuEvent[]>(
  accessToken: string | undefined | null,
  options?: UseQueryOptions<unknown, Error, TData>
) => {
  const key = ['events', accessToken];

  return useQuery({
    ...options,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    queryKey: key as QueryKey,
    enabled: accessToken !== undefined && accessToken !== null,
    queryFn: async ({ queryKey }) => {
      return (await fetcher(`/events`, {
        headers: { Authorization: `Bearer ${queryKey[1]}` }
      }))?.events
    },
  })
}