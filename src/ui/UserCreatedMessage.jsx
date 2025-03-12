import styled from "styled-components";
import { useMoveBack } from "../hooks/useMoveBack.js";
import ButtonText from "./ButtonText.jsx";
import Heading from "./Heading.jsx";

const Headings = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0%.5;
`;

export function UserCreatedMessage() {
  const moveBack = useMoveBack();
  return (
    <Headings>
      <Heading as="h3">
        User successfully created. An email for confirmation has been sent.
      </Heading>
      <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
    </Headings>
  );
}

export default UserCreatedMessage;
