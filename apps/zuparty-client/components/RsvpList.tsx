import { useEffect, useState } from "react";
import styled from "styled-components";
import { ZupartyError } from "./shared/ErrorOverlay";
import { RSVP, RsvpListRequest, EventSignal, RsvpApproveRequest } from "../src/types";
import { approveRSVP, getRsvpList } from "../src/api";
import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { PASSPORT_URL, SEMAPHORE_GROUP_URL } from "../src/util";
import Link from "next/link";
import { sha256 } from "js-sha256";
import { generateMessageHash } from "@pcd/semaphore-group-pcd";
import { RSVPSignal } from "./shared/RSVPOverlay";
import stableStringify from "json-stable-stringify";
import { Button } from "./core/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";

enum LoadState {
  WAIT,
  NOT_HOST,
  IS_HOST
}

enum ApproveState {
  DEFAULT,
  WAIT,
}

export function RsvpList({
  eventId, eventName, eventDescription, eventExpiry
}: {
  eventId: string;
  eventName: string;
  eventDescription: string;
  eventExpiry: Date;
}) {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.WAIT);
  const [approveState, setApproveState] = useState<ApproveState>(ApproveState.DEFAULT);
  const [rsvpList, setRsvpList] = useState<Array<RSVP>>([]);

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();
  const [storedPcdStr, setStoredPcdStr] = useLocalStorage(eventId+"-pcdstr","");
  console.log("pcdStr:",pcdStr);
  console.log("storedPcdStr:",storedPcdStr);

  useEffect(() => {
    if (storedPcdStr === "" && pcdStr === "") return;
    let parsedPcd;
    if (storedPcdStr != "") {
      parsedPcd = storedPcdStr;
    } else {
      parsedPcd = JSON.parse(decodeURIComponent(pcdStr));
    }

    const request: RsvpListRequest = {
      proof: parsedPcd.pcd
    };

    async function doRequest() {
      const res = await getRsvpList(request, eventId);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error posting post to the server: ", resErr);
        const err = {
          title: "get rsvp list failed",
          message: `Server Error: ${resErr}`,
        } as ZupartyError;
        return;
      }
      const jsonRes = await res.json();

      if (jsonRes.data === null) {
        setLoadState(LoadState.NOT_HOST);
      } else {
        setRsvpList(jsonRes.data);
        console.log("rsvpList:",jsonRes.data);
        setLoadState(LoadState.IS_HOST);
      }

    }

    doRequest();
  }, [pcdStr, eventId, storedPcdStr]);

  async function submitApproval(
    id: string | undefined
  ) {
    if (id == undefined) id = "";
    if (storedPcdStr === "" && pcdStr === "") return;
    setApproveState(ApproveState.WAIT);
    let parsedPcd;
    if (storedPcdStr != "") {
      parsedPcd = storedPcdStr;
    } else {
      parsedPcd = JSON.parse(decodeURIComponent(pcdStr));
    }
    const req : RsvpApproveRequest = {
      proof: parsedPcd.pcd
    };
    console.log("rsvpId: ", id);
    console.log("proof", req);
    console.log("about to send some shit");
    const res = await approveRSVP(req, id);
    if (!res.ok) {
      const resErr = await res.text();
      console.error("error posting post to the server: ", resErr);
      const err = {
        title: "approve rsvp failed",
        message: `Server Error: ${resErr}`,
      } as ZupartyError;
      return;
    }
    console.log("approve result: ", res);
    rsvpList.find
    // do additional stuff
    const temp = rsvpList.map((item) => {
      if (item.id === id) {
        item.approved = true;
      }
      return item
    });
    setRsvpList(temp);
    
    setApproveState(ApproveState.DEFAULT);
  }

  useEffect(() => {
    if (storedPcdStr != "" || pcdStr != "") return;
    const signal: EventSignal = {
      name: eventName,
      description: eventDescription,
      expiry: eventExpiry
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

  }, [eventId, eventDescription, eventExpiry, eventName, pcdStr, storedPcdStr])

  switch(loadState) {
    case LoadState.WAIT: {
      return (
        <Container>
          Verifying host...
        </Container>
      )
    }
    case LoadState.NOT_HOST: {
      return (
        <Container>
          bruv u ain't the host
        </Container>
      );
    }
    case LoadState.IS_HOST: {
      return (
        <Container>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Telegram</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {rsvpList?.map((rsvp) => (
                <tr key={rsvp.id}>
                  <Td>{rsvp.name}</Td>
                  <Td>{rsvp.email}</Td>
                  <Td>{rsvp.telegram}</Td>
                  <Td>{rsvp.approved ? "Approved" : "Pending approval"}</Td>
                  <Td>
                    {/* if approved, shows approved. else shows approve button */}
                    {!rsvp.approved &&
                    <Button 
                      disabled={approveState == ApproveState.WAIT}
                      onClick={() => submitApproval(rsvp.id)}>
                      {(approveState == ApproveState.DEFAULT) ? "Approve" : "Approving..."}
                    </Button>
                    }
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {rsvpList?.length === 0 && (
            <p>No RSVPs.</p>
          )}
        </Container>
      );
    }
    default: {
      return (<div>wut.</div>);
    }
  }
}

const Container = styled.div`
  margin: 2rem;
`;

const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse; 
`

const Th = styled.th`
  border-bottom: 1px solid #fff;
  padding: 0.5rem;
`

const Td = styled.td`
  padding: 0.5rem;
`
