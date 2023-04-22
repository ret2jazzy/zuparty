import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "../components/core/Button";
import { CreateEvent } from "../components/CreateEvent";
import { ErrorOverlay, ZupartyError } from "../components/shared/ErrorOverlay";

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [error, setError] = useState<ZupartyError>();
  const [createModal, setCreateModal] = useState<boolean | undefined>();
  const router = useRouter();

  function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  }

  useEffect(() => {
    if (accessToken) return;

    const token = window.localStorage.getItem("access_token");
    if (token !== null) {
      const group = parseJwt(token)["groupUrl"] || null;
      setGroup(group);
    }
    setAccessToken(token);
  }, [accessToken]);

  const onCreate = () => {
    setCreateModal(!createModal);
  }

  const onError = useCallback((err: ZupartyError) => setError(err), []);

  const Wrap = accessToken ? Wrapper : WrapDark;

  const handleNewEvent = (eventId: string) => {
    router.push(`/event/${eventId}`)
  }

  return (
    <Wrap>
      <Section>
        <img src="/images/zuparty-logo_image.png" alt="Zuzalu" width="240" height="237" />
        <img src="/images/zuparty-logo_text.png" alt="Zuzalu" width="238" height="88" />
        <PartyTitle>Parties by Zuzalians, for Zuzalians</PartyTitle>
        <br />
        <Button onClick={onCreate}>Create Event</Button>
        {createModal && (
          <CreateEvent onCreated={handleNewEvent} onError={onError} onClose={() => setCreateModal(false)} />
        )}
        {error && (
          <ErrorOverlay error={error} onClose={() => setError(undefined)} />
        )}
      </Section>
    </Wrap>
  );
}

const LoggedInHeader = styled.div`
  width: 100%;
  font-size: 2em;
  margin-bottom: 32px;
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;

const PartyTitle = styled.p`
  font-size: 1.5rem;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
  align-items: center;
`;

const WrapDark = styled(Wrapper)`
  background: rgb(28, 41, 40);
`;

const Section = styled.div`
  width: 75ch;
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 20px;
  padding: 20px;
`;
