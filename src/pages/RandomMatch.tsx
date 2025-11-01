import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import CrownIcon from "../assets/icon1.svg";
import HatIcon from "../assets/icon2.svg";
import FaceHair from "../assets/icon3.svg";
import HairIcon from "../assets/icon4.svg";
import Character from "../assets/character-2.svg";
import RandomMatchCard from "../components/RandomMatchCard";

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const Icon = styled.img`
  position: absolute;
  animation: ${float} 4s ease-in-out infinite;
`

const Container = styled.div`
  max-width: 100%;
  max-height: 100%;
  display: flex;
  height: 100vh;
  position: relative;
  //overflow: hidden; 
`

const CharacterImg = styled.img`
  position: absolute;
  bottom: -8rem;
  right: 1%; 
  width: 27.8125rem;
  height: 35.75rem;
`

const ContentContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`

const ContentTitle = styled.div`
  font-family: "Hakgyoansim Dunggeunmiso OTF";
  font-size: 2rem;
  font-weight: 400;
  padding-top: 2.12rem;
  text-align: center;
`

const Content = styled.div`
  margin: 0 auto;
  text-align: center;
  font-family: "Hakgyoansim Dunggeunmiso TTF";
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.625rem;
`


const RandomMatch = () => {

  const navigate = useNavigate();

  return (
    <Container>
      <Icon src={HatIcon} style={{ top: "11.78rem", left: "80%", animationDelay: "0s" }} />
      <Icon src={HairIcon} style={{ top: "30rem", left: "10%", animationDelay: "0.8s" }} />
      <Icon src={CrownIcon} style={{ top: "5rem", left: "10rem", animationDelay: "0.4s" }} />
      <Icon src={FaceHair} style={{ top: "20rem", left: "5rem", animationDelay: "1.2s" }} />
      <CharacterImg src={Character} alt="Character" />
      <ContentContainer>
        <ContentTitle>친구 랜덤 매칭</ContentTitle>
        <Content>취향과 성격을 기반으로 <br />교내 외국인 친구를 자동 매칭합니다.</Content>
        <RandomMatchCard />
      </ContentContainer>
    </Container>
  );
};

export default RandomMatch;