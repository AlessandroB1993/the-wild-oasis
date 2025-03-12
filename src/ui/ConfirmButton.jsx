import styled from "styled-components";

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  color: var(--color-red-100);
  background-color: var(--color-red-700);
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;

  &:hover {
    background-color: var(--color-red-800);
  }
`;

function ConfirmButton({ onClick }) {
  return <Button onClick={onClick}>Confirm</Button>;
}

export default ConfirmButton;
