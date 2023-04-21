import * as React from "react";
import { FormEventHandler, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Overlay } from "./Overlay";
import { Button } from "../core/Button";
import { useRSVPMutation } from "../../hooks/useRSVPMutation";
import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { sha256 } from "js-sha256";
import stableStringify from "json-stable-stringify";
import { generateMessageHash } from "@pcd/semaphore-signature-pcd";
import {
  PASSPORT_URL,
  SEMAPHORE_GROUP_URL,
} from "../../src/util";

type RSVPOverlayProps = {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

enum RSVPState {
  DEFAULT,
  AWAITING_PCDSTR,
  RECEIVED_PCDSTR,
}

export function RSVPOverlay({
  eventId,
  onClose,
  onSuccess,
}: RSVPOverlayProps) {
  const { mutate, isLoading } = useRSVPMutation({
    onSuccess: () => {
      onSuccess()
    }
  });

  const rsvpState = useRef<RSVPState>(RSVPState.DEFAULT);
  const [rsvpName, setRsvpName] = useState<string>("");
  const [rsvpTelegram, setRsvpTelegram] = useState<string>("");
  const [rsvpEmail, setRsvpEmail] = useState<string>("");

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();


  useEffect(() => {
    if (rsvpState.current === rsvpState.AWAITING_PCDSTR) {
      rsvpState.current = rsvpState.RECEIVED_PCDSTR;
    }
  }, [pcdStr]);

  useEffect(() => {
    if (rsvpState.current !== rsvpState.RECEIVED_PCDSTR) return;
    rsvpState.current = rsvpState.DEFAULT;

    // const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));
    // const request: CreateEventRequest = {
    //   name: partyName,
    //   description: partyDescription,
    //   expiry: partyExpiry,
    //   location: partyLocation,
    //   spotsAvailable: partyCapacity,
    //   proof: parsedPcd.pcd,
    // };

    // async function doRequest() {
    //   const res = await createEvent(request);
    //   if (!res.ok) {
    //     const resErr = await res.text();
    //     console.error("error posting post to the server: ", resErr);
    //     const err = {
    //       title: "Create poll failed",
    //       message: `Server Error: ${resErr}`,
    //     } as ZupollError;
    //     onError(err);
    //     return;
    //   }
    //   const jsonRes = await res.json();

    //   onCreated(jsonRes.eventId);
    //   setPartyDescription("");
    //   setPartyExpiry(new Date(new Date().getTime() + 1000 * 60 * 60 * 24));
    // }

    // doRequest();
  }, [pcdStr]);

  const signal : RSVPSignal = {
    id: eventId
  };

  const signalHash = sha256(stableStringify(signal));
  const sigHashEnc = generateMessageHash(signalHash).toString();

  rsvpState.current = rsvpState.AWAITING_PCDSTR;

  openZuzaluMembershipPopup(
    PASSPORT_URL,
    window.location.origin + "/popup",
    SEMAPHORE_GROUP_URL,
    "zuparty",
    sigHashEnc,
    sigHashEnc
  );

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    mutate({
      name: rsvpName,
      telegram: rsvpTelegram,
      email: rsvpEmail,
      eventId,
      uuid: undefined,
    })
  };

  return (
    <Overlay onClose={onClose}>
      <Body>
        <h1>RSVP</h1>
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel htmlFor="name">
            Name
          </StyledLabel>
          <StyledInput
            type="text"
            id="name"
            autoComplete="off"
            value={rsvpName}
            onChange={(e) => setRsvpName(e.target.value)}
            required
          />
          <StyledLabel htmlFor="telegram">
            Telegram handle
          </StyledLabel>
          <StyledInput
            type="text"
            id="telegram"
            autoComplete="off"
            value={rsvpTelegram}
            onChange={(e) => setRsvpTelegram(e.target.value)}
            required
          />
          <StyledLabel htmlFor="email">
            Email address
          </StyledLabel>
          <StyledInput
            type="text"
            id="email"
            autoComplete="off"
            value={rsvpEmail}
            onChange={(e) => setRsvpEmail(e.target.value)}
            required
          />
          <SubmitRow>
            <Button type={'submit'}
              disabled={isLoading}>
              {isLoading ? 'Submitting...' : `I'm coming!`}
            </Button>
          </SubmitRow>
        </StyledForm>
      </Body>
    </Overlay>
  );
}

export type RSVPSignal = {
  id: string;
};

export type RSVPRequest = {
  name: string;
  telegram: string;
  uuid: string | undefined;
  email: string;
  eventId: string
};

const Body = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  color: #000;
`;

const SubmitRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledInput = styled.input`
  display: flex;
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  border: 1px solid #555;
  width: 100%;
  margin-bottom: 16px;
`;

const StyledLabel = styled.label`
  margin-bottom: 8px;
  font-size: 16px;
  display: flex;
  width: 100%;
  text-align: left;
`;