import styled from "styled-components";
import Logo from "../assets/logo.svg";
import GlobalStyle  from '../styles/GlobalStyle';
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 3.81rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 37.96rem;
`
const HeaderLogo = styled.img`
  width: 120px;
  height: auto;
  display: block;
  object-fit: contain;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3.5rem;
`
const MenuItem = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.0125rem;
  cursor: pointer;
`


export default function Header() {

  const navigate = useNavigate();

  return(
    <Container>
      <HeaderLogo src={Logo} alt="logo"/>
      <Menu>
        <MenuItem onClick={() => navigate("/")}>홈</MenuItem>
        <MenuItem onClick={() => navigate("/random-match")}>랜덤 매칭</MenuItem>
        <MenuItem onClick={() => navigate("/study")}>스터디 모집</MenuItem>
        <MenuItem onClick={() => navigate("/profile")}>프로필 조회</MenuItem>
        <MenuItem onClick={() => navigate("/message")}>대화방</MenuItem>
        <MenuItem onClick={() => navigate("/mypage")}>MYPAGE</MenuItem>
      </Menu>
    </Container>
  )
}

