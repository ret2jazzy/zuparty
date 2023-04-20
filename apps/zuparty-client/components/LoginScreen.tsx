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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  padding: 0 16px 0 4px;
`;

const H1 = styled.h1`
  color: #eee;
  margin-top: 0;
  font-size: 30px;
`;

const Body = styled.div`
  background: #eee;
  border-radius: 16px;
  padding: 48px;
`;

const LoginRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;
