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

export default function EventPage() {
  const router = useRouter()
  const eventId = router.query['id'] as string;
  const [rsvp, setRsvp] = useState<boolean | undefined>();
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | undefined | null>();
  const { data: event, isLoading } = useEvent(eventId);
  const { data: eventLocation } = useEventLocation(eventId, {
    enabled: eventId !== undefined && showLocation && accessToken !== undefined && accessToken !== null,
  });

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
        <Description>
          {event.deadline &&
            <p>
              <strong>{format(parseISO(event.deadline), 'PPPP')}</strong>
            </p>
          }
        </Description>
        <Description>
          { /* make these parts only show up when confirmed RSVP*/}
          {eventLocation ?
            <p>{eventLocation}</p>
            :
            accessToken ?
              <Button onClick={handleViewLocation} style={{ width: 300 }}>
                View location
              </Button> :
              <Login
                onLoggedIn={updateAccessToken}
                requestedGroup={SEMAPHORE_GROUP_URL}
                prompt='Login to view location'
              />

          }
        </Description>
        <Description>
          <h6>Description:</h6>
          <p>{event.description}</p>
        </Description>
        <ButtonRow>
          <Button onClick={() => setRsvp(true)}>
            RSVP to see details
          </Button>
        </ButtonRow>
        {rsvp && (
          <RSVPOverlay
            eventId={eventId}
            onClose={() => setRsvp(false)} />
        )}
      </Body>
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
`;

const Description = styled.div`
  font-size: 18px;
  margin-bottom: 48px;
  margin-top: -12px;
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