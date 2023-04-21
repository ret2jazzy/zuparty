import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useEvent } from "../../hooks/useEvent";
import { useRetrieveRSVPsMutation } from "../../hooks/useRetrieveRSVPsMutation";
import { RSVP } from "../../src/types";

export default function RSVPSPage() {
  const router = useRouter()
  const eventId = router.query['id'] as string;
  const { data: event, isLoading } = useEvent(eventId);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  const { mutate, isLoading: isLoadingRsvps } = useRetrieveRSVPsMutation({
    onSuccess: (data) => {
      setRsvps(data)
    }
  });

  useEffect(() => {
    if (!event) return;
    mutate({
      eventId: eventId,
      proof: '',
    });
  })

  if (isLoadingRsvps || isLoading) return null;
  return (
    <>
      {rsvps.map(rsvp => (
        <div key={rsvp.id}>
          <p>{rsvp.name}</p>
          <p>{rsvp.email}</p>
        </div>
      ))}
    </>
  )
}