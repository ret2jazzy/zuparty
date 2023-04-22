import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useState } from "react";
import styled from "styled-components";
import { Button } from '../../components/core/Button';
import { Login } from '../../components/Login';
import { RSVPOverlay } from '../../components/shared/RSVPOverlay';
import { useEvent } from '../../hooks/useEvent';
import { useEventLocation } from '../../hooks/useEventLocation';
import { SEMAPHORE_GROUP_URL } from '../../src/util';
import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { RsvpList } from '../../components/RsvpList';

export default function EventPage() {
  const router = useRouter()
  const eventId = router.query['id'] as string;
  const [showRsvp, setShowRsvp] = useState(false);
  const [hasRsvp, setHasRsvp] = useState(false);
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [showRsvpList, setShowRsvpList] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string | undefined | null>();
  const { data: event, isLoading } = useEvent(eventId);
  // console.log("event data: ", event);
  // const { data: eventLocation } = useEventLocation(eventId, {
  //   enabled: eventId !== undefined && showLocation && accessToken !== undefined && accessToken !== null,
  // });

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    setAccessToken(window.localStorage.getItem('access_token'));
  }, []);

  const handleViewLocation = () => {
    setShowLocation(true);
  }

  const updateAccessToken = (token: string | null, _group: string | null) => {
    setAccessToken(token);
    if (!token) {
      window.localStorage.removeItem("access_token");
    } else {
      window.localStorage.setItem("access_token", token);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (!isLoading && !event) return <p>Event not found.</p>

  return (
    <Container>
      <Body>
        <EventTitle>
          <h1>{event.name}</h1>
        </EventTitle>
        {event.expiry &&
          <Description>
            <h5>Event start:</h5>
            <p>{format(parseISO(event.expiry), 'PPPPp')}</p>
          </Description>
        }
        <Description>
          <h5>Description:</h5>
          <p>{event.description}</p>
        </Description>
        <ButtonRow>
          <Button onClick={() => setShowRsvp(true)}>
            RSVP / View details
          </Button>
        </ButtonRow>
        {showRsvp && (
          <RSVPOverlay
            eventId={eventId}
            onClose={() => setShowRsvp(false)}
            onSuccess={() => {
              setShowRsvp(false);
              setHasRsvp(true)
            }}
          />
        )}
        <br />
        <ButtonRow>
          <Button onClick={() => setShowRsvpList(true)}>
            Manage event (host only)
          </Button>
        </ButtonRow>
      </Body>
      {showRsvpList && (
        <RsvpList eventId={eventId} />
      )}
    </Container >
  );
}

const Container = styled.div`
  margin-top: 1rem;
`;

const EventTitle = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 40px;
`;

const Description = styled.div`
  font-size: 18px;
  margin-bottom: 40px;
  margin-top: -12px;
  overflow-wrap: break-word;
`;

const Body = styled.div`
  border-radius: 16px;
  padding: 48px;
  background: linear-gradient(0deg, rgba(23, 23, 23, 0.3), rgba(23, 23, 23, 0.3)), center url(/images/wine.png);
  background-size: cover;
  color: #fff;
  margin: 2rem;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;

const BgImage = styled.div`
`;