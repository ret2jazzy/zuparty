import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react'
import { useState } from "react";
import styled from "styled-components";
import { Button } from '../../components/core/Button';
import { RSVPOverlay } from '../../components/shared/RSVPOverlay';
import { useEvent } from '../../hooks/useEvent';

export default function EventPage() {
  const router = useRouter()
  const { id } = router.query
  const [rsvp, setRsvp] = useState<boolean | undefined>();
  const { data: event, isLoading } = useEvent(id as string);

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
          {/* <p>
            5:00pm – 7:00pm
          </p> */}
        </Description>
        <Description>
          { /* make these parts only show up when confirmed RSVP*/}
          <p>
            <a href="https://goo.gl/maps/ZSJCD4JZ4J3423Jz9">
              Špilja Luštica Bay (former Kiki’s location)
            </a>
          </p>
          <p>{event.description}</p>
          {/* <p>
              We'd like to keep the event fairly small, but please feel free to bring a wine-loving or wine-curious friend.
            </p>
            <p>
              We will be focusing mostly on Central/Eastern European wines.
            </p> */}
        </Description>
        <ButtonRow>
          <Button onClick={() => setRsvp(true)}>
            RSVP to see details
          </Button>
        </ButtonRow>
        {rsvp && (
          <RSVPOverlay onClose={() => setRsvp(false)} />
        )}
      </Body>
      <br />
      Create Event coming soon!
    </Container>
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