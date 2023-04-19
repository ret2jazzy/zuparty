import * as React from "react";
import styled from "styled-components";
import { Overlay } from "./Overlay";
import { Button } from "../core/Button";

export function RSVPOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <Body>
      <br />
      <h1>RSVP</h1>
      <br />
      <p>Are you attending?</p>
      <br />
      <Button onClick={onClose}>Yes</Button>
      <Button onClick={onClose}>No</Button>
      </Body>
    </Overlay>
  );
}

const Body = styled.div`
  background: #eee;
  border-radius: 16px;
  padding: 48px;
`;