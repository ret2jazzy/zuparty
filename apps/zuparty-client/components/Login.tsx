import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { login } from "../src/api";
import { PASSPORT_URL } from "../src/util";
import { Button } from "./core/Button";
import { ErrorOverlay, ZupartyError } from "./shared/ErrorOverlay";

/**
 * Login for the user who belongs to the specified semaphore group.
 * Generate a semaphore proof, calls the /login endpoint on the server, and
 * gets a JWT. The JWT can be used to make other requests to the server.
 * @param onLoggedIn a callback function which will be called after the user
 * logged in with the JWT.
 */
export function Login({
  onLoggedIn,
  requestedGroup,
  prompt,
  deemphasized,
}: {
  onLoggedIn: (token: string, group: string) => void;
  requestedGroup: string;
  prompt: string;
  deemphasized?: boolean;
}) {
  const [error, setError] = useState<ZupartyError>();
  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (!pcdStr) return;

    const sendLogin = async () => {
      const res = await login(requestedGroup, pcdStr);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error login to the server: ", resErr);
        const err = {
          title: "Login failed",
          message: "Fail to connect to the server, please try again later.",
        } as ZupartyError;
        setError(err);
        return;
      }
      const token = await res.json();
      return token.accessToken;
    };

    sendLogin().then((accessToken) => {
      onLoggedIn(accessToken, requestedGroup);
    });
  }, [pcdStr, requestedGroup, onLoggedIn]);

  const ButtonComponent = deemphasized ? DeemphasizedLoginButton : Button;

  return (
    <>
      <ButtonComponent
        onClick={() => {
          openZuzaluMembershipPopup(
            PASSPORT_URL,
            window.location.origin + "/popup",
            requestedGroup,
            "zuparty"
          );
        }}
      >
        {prompt}
      </ButtonComponent>
      {error && (
        <ErrorOverlay error={error} onClose={() => setError(undefined)} />
      )}
    </>
  );
}

const DeemphasizedLoginButton = styled(Button)`
  background-color: #eee;
  font-weight: normal;
  border: 1px solid #888;

  &:hover {
    background-color: #e8e8e8;
  }

  &:active {
    background-color: #e3e3e3;
  }
`;
