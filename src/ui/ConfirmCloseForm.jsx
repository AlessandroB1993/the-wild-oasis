import styled from "styled-components";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";
import ConfirmButton from "./ConfirmButton.jsx";

const StyledConfirmCloseForm = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmCloseForm({ onClick, mode }) {
  return (
    <StyledConfirmCloseForm>
      <Heading as="h3">Are you sure?</Heading>
      <p>{`Do you want to cancel the ${mode} of the new cabin?`}</p>

      <div>
        <Button variation="secondary">Continue</Button>
        <ConfirmButton onClick={onClick} />
      </div>
    </StyledConfirmCloseForm>
  );
}

export default ConfirmCloseForm;
