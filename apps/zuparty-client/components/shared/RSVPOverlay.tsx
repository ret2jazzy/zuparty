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
import { getLocation } from "../../src/api";
import { ZupartyError } from "./ErrorOverlay";
import QRCode from "react-qr-code";

type RSVPOverlayProps = {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

enum LoadState {
  WAIT,
  NOT_RSVP,
  RSVP_UNCONFIRMED,
  RSVP_CONFIRMED
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

  const [loadState, setLoadState] = useState<LoadState>(LoadState.WAIT);
  const [rsvpName, setRsvpName] = useState<string>("");
  const [rsvpTelegram, setRsvpTelegram] = useState<string>("");
  const [rsvpEmail, setRsvpEmail] = useState<string>("");
  const [eventLocation, setEventLocation] = useState<string | null>(null);
  const [rsvpId, setRsvpId] = useState<string | null>(null);

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (pcdStr === "") return;
    console.log("gang");

    console.log(pcdStr);
    const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));

    const locrequest : LocationRequest = {
      proof: parsedPcd.pcd
    };

    async function doRequest() {
      const res = await getLocation(locrequest, eventId);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error posting post to the server: ", resErr);
        const err = {
          title: "get location failed",
          message: `Server Error: ${resErr}`,
        } as ZupartyError;
        return;
      }
      const jsonRes = await res.json();

      if (jsonRes.found === null) {
        setLoadState(LoadState.NOT_RSVP);
      } else if(!jsonRes.found.approved){
        setLoadState(LoadState.RSVP_UNCONFIRMED);
      } else {
        console.log("found:",jsonRes.found);
        setRsvpId(jsonRes.found.id);
        setEventLocation(jsonRes.found.Event.location);
        setLoadState(LoadState.RSVP_CONFIRMED);
      }
    }

    doRequest();
  }, [pcdStr, eventId]);

  useEffect(() => {
    const signal: RSVPSignal = {
      id: eventId
    };
    const signalHash = sha256(stableStringify(signal));
    const sigHashEnc = generateMessageHash(signalHash).toString();
    // debugger;
    openZuzaluMembershipPopup(
      PASSPORT_URL,
      window.location.origin + "/popup",
      SEMAPHORE_GROUP_URL,
      "zuparty",
      sigHashEnc,
      sigHashEnc
    );

  }, [eventId])


  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));

    mutate({
      name: rsvpName,
      telegram: rsvpTelegram,
      email: rsvpEmail,
      eventId,
      proof: parsedPcd.pcd
    })
  };

  switch(loadState) {
    case LoadState.WAIT: {
      return (
        <Overlay onClose={onClose}>
          <Body>
            <h1>Waiting on zupass...</h1>
          </Body>
        </Overlay>
      );
      break;
    }
    case LoadState.NOT_RSVP: {
      return (
        <Overlay onClose={onClose}>
          <Body>
            <h1>RSVP</h1>
            <p>You have not RSVPed, please fill out the details</p>
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
                  {isLoading ? 'Submitting RSVP...' : `I'm coming!`}
                </Button>
              </SubmitRow>
            </StyledForm>
          </Body>
        </Overlay>
      );
      break;
    }
    case LoadState.RSVP_CONFIRMED: {
      return (
        <Overlay onClose={onClose}>
          <Body>
            <h5>Event location:</h5>
            {eventLocation?.toString()}
            <br /><br />
            Show the host the following QR code to confirm your RSVP:
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={"http://zuzalu.party/verify/"+eventId+"?rsvpId="+rsvpId}
              viewBox={`0 0 256 256`}
            />
          </Body>
        </Overlay>
      );
    }
    case LoadState.RSVP_UNCONFIRMED: {
      return (
        <Overlay onClose={onClose}>
          <Body>
            <h1>Pending approval</h1>
            <p>Your RSVP is currently awaiting host approval!</p>
          </Body>
        </Overlay>
      );
      break;
    }
    default: {
      return (<div>wut.</div>);
      break;
    }

  }

}

export type RSVPSignal = {
  id: string;
};

export type LocationRequest = {
  proof: string;
}


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
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  width: 100%;
  text-align: left;
`;