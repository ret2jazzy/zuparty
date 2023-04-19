import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { SEMAPHORE_ADMIN_GROUP_URL, SEMAPHORE_GROUP_URL } from "../src/util";
import { Button } from "./core/Button";
import { RSVPOverlay } from "./shared/RSVPOverlay";

export function EventPage() {
  const [rsvp, setRsvp] = useState<boolean | undefined>();

  return (
    <Bg>
      <Header>
        <img src="/zuparty-logo.png" alt="Zuzalu" width="160" height="42" />
      </Header>
      <Body>
      <BgImage />
        <EventTitle>
          <h1>ZuVino Social</h1>
        </EventTitle>
        <Description>
          <p>
            <strong>Thursday, April 20, 2023</strong>
          </p>
          <p>
            5:00pm – 7:00pm
          </p>
        </Description>
        <Description>
          { /* make these parts only show up when confirmed RSVP*/ } 
          <p>
            <a href="https://goo.gl/maps/ZSJCD4JZ4J3423Jz9">
            Špilja Luštica Bay (former Kiki’s location)
            </a>
          </p>
          <p>
            We'd like to keep the event fairly small, but please feel free to bring a wine-loving or wine-curious friend.
          </p>
          <p>
            We will be focusing mostly on Central/Eastern European wines.
          </p>
        </Description>
        <ButtonRow>
          <Button onClick={setRsvp}>
            RSVP to see details  
          </Button>
        </ButtonRow>
        {rsvp && (
          <RSVPOverlay onClose={() => setRsvp(false)} />
        )}
      </Body>
      <br />
      Create Event coming soon!
    </Bg>
  );
}

const Bg = styled.div`
  max-width: 512px;
`;

const EventTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
`;

const Description = styled.div`
  font-size: 18px;
  margin-bottom: 48px;
  margin-top: -12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  padding: 0 16px 0 4px;
`;

const H1 = styled.h1`
  color: #eee;
  margin-top: 0;
  font-size: 30px;
`;

const Body = styled.div`
  background: #eee;
  border-radius: 16px;
  padding: 48px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;

const BgImage = styled.div`
  background-image: url(./public/wine.png);
`;