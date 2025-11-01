import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import CardImg from "../assets/card.svg";
import Color from "../assets/colorCard.svg";

const Wrapper = styled.div`
  position: relative;
  width: 29.5625rem;
  height: 37.4375rem;
  margin: 0 auto;
  overflow: visible; 
  box-sizing: border-box;
`

const Container = styled.div`
  margin: 0 auto;
  width: 29.5625rem;
  height: 37.4375rem;
  top: -0.4rem; 
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
  border-radius: 2rem;
  border: 1.8px solid #FFF;
  border-radius: 2rem;
  background: url({CardImg}) lightgray 50% / cover no-repeat, linear-gradient(111deg, rgba(255, 255, 255, 0.50) -4.87%, rgba(255, 255, 255, 0.00) 103.95%);
  backdrop-filter: blur(25px);
  z-index: 1;
  box-sizing: border-box;
`
const ColorBackground = styled.div`
  position: absolute;
  bottom: -0.56rem;
  right: 0.56rem; 
  width: 100%;
  height: 100%; 
  border-radius: 2rem;
  background: linear-gradient(242deg, #FFE6A2 30.46%, #BDB68E 47.83%, #9CA698 67.52%, rgba(0, 45, 86, 0.50) 94.11%);
  z-index: 0;
  box-sizing: border-box;
`

const Title = styled.div`
  font-family: "Hakgyoansim Dunggeunmiso TTF";
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.48213rem;
  letter-spacing: 0.075rem;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerWrapper = styled.div`
  margin-top: 10rem;
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid rgba(0, 0, 0, 0.1);
  border-top: 0.25rem solid #002d56; 
  border-radius: 50%;
  animation: ${spin} 3s linear infinite; 
  box-sizing: border-box;
`

const CancelButton = styled.div`
  margin: 0 auto;
  margin-top: 17rem;
  color: rgba(0, 0, 0, 0.50);
  width: 7rem;
  border-bottom:  solid rgba(0, 0, 0, 0.50);;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.48213rem; 
  letter-spacing: 0.04375rem;
  text-align: center;
  cursor: pointer;
`

export default function RandomMatchCard() {

  const navigate = useNavigate();

  return(
    <Wrapper>
      <ColorBackground />
      <Container>
        <Title>랜덤 매칭 중입니다...</Title>
        <SpinnerWrapper />
        <CancelButton onClick={() => navigate("/")}>매칭 다음에 하기</CancelButton>
      </Container>
    </Wrapper>

  )
}

