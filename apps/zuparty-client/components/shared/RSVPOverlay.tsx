import * as React from "react";
import { FormEventHandler, useState } from "react";
import styled from "styled-components";
import { Overlay } from "./Overlay";
import { Button } from "../core/Button";

export function RSVPOverlay({
  onClose,
}: {
  onClose: () => void;
}) {

  const [rsvpName, setRsvpName] = useState<string>("");
  const [rsvpTelegram, setRsvpTelegram] = useState<string>("");
  const [rsvpEmail, setRsvpEmail] = useState<string>("");

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
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
          <Button onClick={onClose}>I'm coming!</Button>
        </SubmitRow>
      </StyledForm>
      </Body>
    </Overlay>
  );
}

export type RSVPRequest = {
  name: string;
  telegram: string;
  uuid: string | undefined;
  email: string;
  eventId: string
};

const Body = styled.div`
  background: #eee;
  border-radius: 16px;
  padding: 48px;
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