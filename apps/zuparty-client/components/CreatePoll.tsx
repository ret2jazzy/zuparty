import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { generateMessageHash } from "@pcd/semaphore-signature-pcd";
import { sha256 } from "js-sha256";
import stableStringify from "json-stable-stringify";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPoll } from "../src/api";
import { Overlay } from "./shared/Overlay";
import {
  CreatePollRequest,
  PollSignal,
  PollType,
  UserType,
} from "../src/types";
import {
  PASSPORT_URL,
  SEMAPHORE_ADMIN_GROUP_URL,
  SEMAPHORE_GROUP_URL,
} from "../src/util";
import { Button } from "./core/Button";
import { ZupollError } from "./shared/ErrorOverlay";

enum CreatePollState {
  DEFAULT,
  AWAITING_PCDSTR,
  RECEIVED_PCDSTR,
}

export function CreatePoll({
  onCreated,
  onError,
  onClose,
}: {
  onCreated: (newPoll: string) => void;
  onError: (err: ZupollError) => void;
  onClose: () => void;
}) {
  const createState = useRef<CreatePollState>(CreatePollState.DEFAULT);
  const [pollBody, setPollBody] = useState<string>("");
  const [pollOptions, setPollOptions] = useState<Array<string>>([]);
  const [pollExpiry, setPollExpiry] = useState<Date>(
    new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
  );

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (createState.current === CreatePollState.AWAITING_PCDSTR) {
      createState.current = CreatePollState.RECEIVED_PCDSTR;
    }
  }, [pcdStr]);

  useEffect(() => {
    if (createState.current !== CreatePollState.RECEIVED_PCDSTR) return;
    createState.current = CreatePollState.DEFAULT;

    const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));
    const request: CreatePollRequest = {
      pollsterType: UserType.ANON,
      pollsterSemaphoreGroupUrl: SEMAPHORE_ADMIN_GROUP_URL,
      pollType: PollType.REFERENDUM,
      body: pollBody,
      expiry: pollExpiry,
      options: pollOptions,
      voterSemaphoreGroupUrls: [SEMAPHORE_GROUP_URL],
      proof: parsedPcd.pcd,
    };

    async function doRequest() {
      const res = await createPoll(request);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error posting post to the server: ", resErr);
        const err = {
          title: "Create poll failed",
          message: `Server Error: ${resErr}`,
        } as ZupollError;
        onError(err);
        return;
      }
      onCreated(pollBody);
      setPollBody("");
      setPollOptions([]);
      setPollExpiry(new Date(new Date().getTime() + 1000 * 60 * 60 * 24));
    }

    doRequest();
  }, [pcdStr, onCreated, onError, pollBody, pollExpiry, pollOptions]);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    createState.current = CreatePollState.AWAITING_PCDSTR;

    const signal: PollSignal = {
      /*
      name: string,
      description: string;
      spotsAvailable: number;
      hostuuid: string;
      hostCommitment: string;
      expiry: Date;
      */

      pollType: PollType.REFERENDUM,
      body: pollBody,
      expiry: pollExpiry,
      options: pollOptions,
      voterSemaphoreGroupUrls: [SEMAPHORE_GROUP_URL],
    };
    const signalHash = sha256(stableStringify(signal));
    const sigHashEnc = generateMessageHash(signalHash).toString();

    openZuzaluMembershipPopup(
      PASSPORT_URL,
      window.location.origin + "/popup",
      SEMAPHORE_ADMIN_GROUP_URL,
      "zupoll",
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
      {/* <Header>Admin Create Poll</Header> */}
      <StyledForm onSubmit={handleSubmit}>
        <StyledLabel htmlFor="eventTitle">
          Event title
        </StyledLabel>
        <StyledInput
          type="text"
          id="eventTitle"
          autoComplete="off"
          value={pollBody}
          onChange={(e) => setPollBody(e.target.value)}
          required
        />
        <StyledLabel htmlFor="eventTitle">
          Event description
        </StyledLabel>
        <StyledInput
          type="text"
          id="eventDescription"
          autoComplete="off"
          value={pollBody}
          onChange={(e) => setPollBody(e.target.value)}
          required
        />
        <StyledLabel htmlFor="eventTitle">
          Location
        </StyledLabel>
        <StyledInput
          type="text"
          id="eventLocation"
          autoComplete="off"
          value={pollBody}
          onChange={(e) => setPollBody(e.target.value)}
          required
        />
        <StyledLabel htmlFor="eventTitle">
          Capacity
        </StyledLabel>
        <StyledInput
          type="number"
          id="eventCapacity"
          autoComplete="off"
          value={pollBody}
          onChange={(e) => setPollBody(e.target.value)}
          required
        />
        <StyledLabel htmlFor="expiry">
          Start time
        </StyledLabel>
        <StyledInput
          type="datetime-local"
          autoComplete="off"
          id="eventStart"
          value={getDateString(pollExpiry)}
          onChange={(e) => setPollExpiry(new Date(e.target.value))}
          required
        />
        <SubmitRow>
          <Button type="submit">Create Event</Button>
        </SubmitRow>
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
  margin-bottom: 16px;
`;

const StyledLabel = styled.label`
  margin-bottom: 8px;
  font-size: 16px;
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
  margin: 10px;
  padding: 16px;
  margin-bottom: 32px;
`;
