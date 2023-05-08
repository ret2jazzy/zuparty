import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { generateMessageHash } from "@pcd/semaphore-signature-pcd";
import { sha256 } from "js-sha256";
import stableStringify from "json-stable-stringify";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createEvent } from "../src/api";
import { Overlay } from "./shared/Overlay";
import {
  EventSignal,
  CreateEventRequest
} from "../src/types";
import {
  PASSPORT_URL,
  SEMAPHORE_GROUP_URL,
} from "../src/util";
import { Button } from "./core/Button";
import { ZupartyError } from "./shared/ErrorOverlay";
import { format } from "date-fns";

enum CreateEventState {
  DEFAULT,
  AWAITING_PCDSTR,
  RECEIVED_PCDSTR,
}

type CreateEventProps = {
  onCreated: (eventId: string) => void;
  onError: (err: ZupartyError) => void;
  onClose: () => void;
}

const today = format(new Date(), 'yyyy-MM-dd');

export function CreateEvent({
  onCreated,
  onError,
  onClose,
}: CreateEventProps) {
  const createState = useRef<CreateEventState>(CreateEventState.DEFAULT);
  const [partyName, setPartyName] = useState<string>("");
  const [partyDescription, setPartyDescription] = useState<string>("");
  const [partyLocation, setPartyLocation] = useState<string>("");
  const [partyCapacity, setPartyCapacity] = useState<number>(10);
  const [partyExpiry, setPartyExpiry] = useState<Date>(
    new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
  );
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (createState.current === CreateEventState.AWAITING_PCDSTR) {
      createState.current = CreateEventState.RECEIVED_PCDSTR;
    }
  }, [pcdStr]);

  useEffect(() => {
    if (createState.current !== CreateEventState.RECEIVED_PCDSTR) return;
    createState.current = CreateEventState.DEFAULT;
    console.log("pcdstr: ",pcdStr);

    const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));
    const request: CreateEventRequest = {
      name: partyName,
      description: partyDescription,
      expiry: partyExpiry,
      location: partyLocation,
      spotsAvailable: partyCapacity,
      proof: parsedPcd.pcd,
    };

    async function doRequest() {
      setDisableButton(true);
      const res = await createEvent(request);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error posting post to the server: ", resErr);
        const err = {
          title: "Create event failed",
          message: `Server Error: ${resErr}`,
        } as ZupartyError;
        onError(err);
        setDisableButton(false);
        return;
      }
      const jsonRes = await res.json();

      onCreated(jsonRes.eventId);
      localStorage.setItem(jsonRes.eventId+"-pcdstr", pcdStr);
      console.log("stored in local storage:",localStorage.getItem(jsonRes.eventId+"-pcdstr"));
      setPartyDescription("");
      setPartyExpiry(new Date(new Date().getTime() + 1000 * 60 * 60 * 24));
    }

    doRequest();
  }, [pcdStr, onCreated, onError, partyName, partyDescription, partyCapacity, partyExpiry, partyLocation]);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    createState.current = CreateEventState.AWAITING_PCDSTR;

    const signal: EventSignal = {
      name: partyName,
      description: partyDescription,
      expiry: partyExpiry,

    };
    const signalHash = sha256(stableStringify(signal));
    const sigHashEnc = generateMessageHash(signalHash).toString();

    openZuzaluMembershipPopup(
      PASSPORT_URL,
      window.location.origin + "/popup",
      SEMAPHORE_GROUP_URL,
      "zuparty",
      sigHashEnc,
      sigHashEnc
    );
  };

  function getDateString(date: Date) {
    const newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate.toISOString().slice(0, 16);
  }

  return (
    <Overlay onClose={onClose}>
      <Container>
        <h1>Create Event</h1>
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel htmlFor="eventTitle">
            Event title
          </StyledLabel>
          <StyledInput
            type="text"
            id="eventTitle"
            autoComplete="off"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            required
          />
          <StyledLabel htmlFor="eventDescription">
            Event description
          </StyledLabel>
          <StyledInput
            type="text"
            id="eventDescription"
            autoComplete="off"
            value={partyDescription}
            onChange={(e) => setPartyDescription(e.target.value)}
            required
          />
          <StyledLabel htmlFor="eventLocation">
            Location
          </StyledLabel>
          <StyledInput
            type="text"
            id="eventLocation"
            autoComplete="off"
            value={partyLocation}
            onChange={(e) => setPartyLocation(e.target.value)}
            required
          />
          <StyledLabel htmlFor="eventCapacity">
            Capacity
          </StyledLabel>
          <StyledInput
            type="number"
            min={1}
            max={999999}
            id="eventCapacity"
            autoComplete="off"
            value={partyCapacity}
            onChange={(e) => setPartyCapacity(Number(e.target.value))}
            required
          />
          <StyledLabel htmlFor="eventStart">
            Start time
          </StyledLabel>
          <StyledInput
            type="datetime-local"
            autoComplete="off"
            id="eventStart"
            min={today}
            value={getDateString(partyExpiry)}
            onChange={(e) => setPartyExpiry(new Date(e.target.value))}
            required
          />
          <SubmitRow>
            <Button type="submit" disabled={disableButton}>
              {disableButton ? 'Creating event...' : 'Create Event'}
            </Button>
          </SubmitRow>
          {disableButton && 'This may take a few seconds, page will update once event created.'}
        </StyledForm>
      </Container>
    </Overlay>
  );
}

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
  margin-bottom: 24px;
`;

const StyledLabel = styled.label`
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  width: 100%;
  text-align: left;
`;

const Container = styled.div`
  box-sizing: border-box;
  font-family: system-ui, sans-serif;
  border: 1px solid #bbb;
  background: #eee;
  border-radius: 16px;
  width: 100%;
  padding: 16px;
  margin-bottom: 32px;
  color: #000;
`;
