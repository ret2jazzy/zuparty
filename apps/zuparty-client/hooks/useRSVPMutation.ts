import { useMutation } from "react-query"
import { fetcher } from "../utils/fetcher";

export const useRSVPMutation = () => {
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
    }
  )
}

type RSVPRequest = {
  name: string;
  telegram: string;
  uuid: string | undefined;
  email: string;
  eventId: string
};