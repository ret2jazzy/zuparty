import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    font-family: system-ui, sans-serif;
    margin: 0;
    max-width: 100vw;
    overflow-x: hidden;
    background: rgb(28, 41, 40);
  }

  body {
    margin: 0;
    max-width: 100vw;
    overflow-x: hidden;
  }
`;
