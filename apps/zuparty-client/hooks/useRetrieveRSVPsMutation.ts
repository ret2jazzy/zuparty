import { useMutation, UseMutationOptions } from "react-query"
import { RSVP } from "../src/types";
import { fetcher } from "../utils/fetcher";

export const useRetrieveRSVPsMutation = (options?: Omit<UseMutationOptions<RSVP[], any, RetrieveRSVPRequest, any>, 'mutationFn'>) => {
  return useMutation(
    (data: RetrieveRSVPRequest) => {
      return fetcher(`/rsvp/${data.eventId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    },
    options
  )
}

type RetrieveRSVPRequest = {
  proof: string;
  eventId: string;
};