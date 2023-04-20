import styled from "styled-components";

export const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 18px;
  font-weight: bold;
  border: none;
  opacity: 1;
  cursor: pointer;
  color: #26463F;

  background-color: #F5D47F;
  transition: .2s

  &:hover {
    background-color: #f1d99b;
  }

  &:active {
    background-color: #f1d99b;
  }
`;
