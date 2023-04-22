import { useEffect, useState } from "react";
import styled from "styled-components";
import { ZupollError } from "./shared/ErrorOverlay";
import { RSVP, RsvpListRequest } from "../src/types";
import { getRsvpList } from "../src/api";
import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { PASSPORT_URL, SEMAPHORE_GROUP_URL } from "../src/util";

enum LoadState {
  WAIT,
  NOT_HOST,
  IS_HOST
}

export function RsvpList({
  eventId,
}: {
  eventId: string;
}) {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.WAIT);
  const [rsvpList, setRsvpList] = useState<Array<RSVP>>([]);

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (pcdStr === "") return;
    console.log("gang");

    console.log(pcdStr);
    const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));

    const request : RsvpListRequest = {
      proof: parsedPcd.pcd
    };

    async function doRequest() {
      const res = await getRsvpList(request, eventId);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error posting post to the server: ", resErr);
        const err = {
          title: "Create poll failed",
          message: `Server Error: ${resErr}`,
        } as ZupollError;
        return;
      }
      const jsonRes = await res.json();

      if (jsonRes.found === null) {
        setLoadState(LoadState.NOT_HOST);
      } else {
        console.log("non-null location!");
        setRsvpList(jsonRes);
        setLoadState(LoadState.IS_HOST);
      }

    }

    doRequest();
  }, [pcdStr]);

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

  switch(loadState) {
    case LoadState.NOT_HOST: {
      return (
        <Container>
          bruv u ain't the host
        </Container>
      );
      break;
    }
    case LoadState.IS_HOST: {
      return (
        <Container>
          {rsvpList.map((rsvp) => (
            <div>
              rsvp detail goes here
            </div>
          ))}
        </Container>
      );
      break;
    }
    default: {
      return (<div>wut.</div>);
      break;
    }
  }
}

const Container = styled.div`
  width: 100%;
  margin-bottom: 256px;
`;
