import { QueryKey, useQuery, UseQueryOptions } from "react-query"
import { fetcher } from "../utils/fetcher";

export const useEventLocation = <TData extends string>(
  id: string,
  options?: UseQueryOptions<unknown, Error, TData>
) => {
  const key = ['event', id, 'location'];

  return useQuery({
    ...options,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    queryKey: key as QueryKey,
    queryFn: async ({ queryKey }) => {
      const accessToken = window.localStorage.getItem("access_token");

      return (await fetcher(`/${queryKey.join('/')}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }))?.location
    },
  })
}