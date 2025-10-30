import styled from "styled-components";


const Container = styled.button`
  display: flex;
  width: 10.0625rem;
  padding: 0.875rem 0;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  background: #FFE6A2;
  font-size: 1rem;
  font-weight: 500;

`

interface SubmitButtonProps {
  onClick?: () => void;
}

export default function SubmitButton({ onClick }: SubmitButtonProps) {

  return(
  <Container onClick={onClick}>다음</Container>
  )
}

