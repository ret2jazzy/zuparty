import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useState } from "react";
import styled from "styled-components";
import { RsvpCheckRequest } from '../../src/types';
import { checkRSVP } from '../../src/api';
import { ZupartyError } from '../../components/shared/ErrorOverlay';

export default function EventPage() {

  enum LoadState {
    WAIT,
    IS_RSVP,
    NOT_RSVP,
    ALREADY_RSVP
  }
  const router = useRouter();
  const eventId = router.query['id'] as string;
  const [loadState, setLoadState] = useState<LoadState>(LoadState.WAIT);

  useEffect(() => {
    console.log("stuff is going to happen");
    console.log("eventId:",eventId);
    if (eventId == undefined) return;
    const pcdStr = localStorage.getItem(eventId+"-pcdstr");
    if (pcdStr == null) {
      console.log("did not find pcdstr");
      return;
    }
    console.log("got pcdstr:",pcdStr);
    const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));

    const request: RsvpCheckRequest = {
      proof: parsedPcd.pcd
    };

    const params1 = new URLSearchParams(window.location.search);
    const id = params1.get("rsvpId");
    let rsvpId = "";
    if (id != null) {
      rsvpId = id;
    } 

    console.log("rsvpId:",rsvpId);

    async function doRequest() {
      console.log("gana hit up checkRSVP");
      const res = await checkRSVP(request, rsvpId);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error posting post to the server: ", resErr);
        const err = {
          title: "get rsvp list failed",
          message: `Server Error: ${resErr}`,
        } as ZupartyError;
        return;
      }
      console.log("result:",res);
      const jsonRes = await res.json();

      if (jsonRes.data === 200) {
        setLoadState(LoadState.IS_RSVP);
      } else if (jsonRes.data == "already_checked_in") {
        setLoadState(LoadState.ALREADY_RSVP);
      } else {
        setLoadState(LoadState.NOT_RSVP);
      }

    }

    doRequest();
  }, [eventId, router, LoadState.ALREADY_RSVP, LoadState.IS_RSVP, LoadState.NOT_RSVP]);

  return (
    <Container>
      <Body>
        <EventTitle>
          {(loadState == LoadState.IS_RSVP) && "Valid RSVP"}
          {(loadState == LoadState.ALREADY_RSVP) && "Already checked in"}
          {(loadState == LoadState.NOT_RSVP) && "Invalid RSVP"}
          {(loadState == LoadState.WAIT) && "Waiting for response..."}
        </EventTitle>
        <br />
      </Body>
    </Container >
  );
}

const Container = styled.div`
  margin: 1rem auto;
  width: 75ch;
  max-width: 90vw;
`;

const EventTitle = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 40px;
  overflow-wrap: break-word;
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
  background-size: cover;
  color: #fff;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;

const BgImage = styled.div`
`;