import { QueryKey, useQuery, UseQueryOptions } from "react-query"
import { ZuEvent } from "../src/types";
import { fetcher } from "../utils/fetcher";

export const useEvent = <TData extends ZuEvent>(id: string,
  options?: UseQueryOptions<unknown, Error, TData>) => {

  const key = ['event', id];

  return useQuery({
    ...options,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    queryKey: key as QueryKey,
    enabled: id !== undefined,
    queryFn: async ({ queryKey }) => {
      return await fetcher(`/${queryKey.join('/')}`)
    },
  })
}