import styled from "styled-components";
import { SEMAPHORE_GROUP_URL } from "../src/util";
import { Login } from "./Login";

export function LoginScreen({
  updateAccessToken,
}: {
  updateAccessToken: (token: string | null, group: string | null) => void;
}) {
  return (
    <Bg>
      <Body>
        <Description>
          <p>
            <strong>This app lets anyone with a Zuzalu passport host events.</strong>
          </p>
        </Description>
        <LoginRow>
          <Login
            onLoggedIn={updateAccessToken}
            requestedGroup={SEMAPHORE_GROUP_URL}
            prompt="Log in"
          />
        </LoginRow>
      </Body>
    </Bg>
  );
}

const Bg = styled.div`
  max-width: 512px;
`;

const Description = styled.div`
  font-size: 18px;
  margin-bottom: 48px;
  margin-top: -12px;
`;

const Body = styled.div`
  border-radius: 16px;
  padding: 48px;
`;

const LoginRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;
