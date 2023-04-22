import { useMutation, UseMutationOptions } from "react-query"
import { fetcher } from "../utils/fetcher";

export const useRSVPMutation = (options?: Omit<UseMutationOptions<unknown, any, RSVPRequest, any>, 'mutationFn'>) => {
  return useMutation(
    (data: RSVPRequest) => {
      return fetcher('/rsvp', {
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

type RSVPRequest = {
  name: string;
  telegram: string;
  email: string;
  eventId: string;
  proof: string
};