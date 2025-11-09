import styled from "styled-components";
import Study from "../assets/study-icon.svg";
import RandomMatch from "../assets/random-match-icon.svg";
import Message from "../assets/message-icon.svg"
import { useNavigate } from "react-router-dom";
import BannerImg from "../assets/banner-background.svg";
import Header from "../components/Header";
import Character from "../assets/main-character.svg";
import axiosInstance from "../../axiosInstance";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`
const TransparentHeader = styled(Header)`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent; /* 배너 이미지가 뒤에서 보이게 */
  z-index: 10;
`;

const Banner = styled.div`
  top: -3.81rem;
  height: 28.75rem;
  background: url(${BannerImg}) center/cover no-repeat;
  position: relative;
  pointer-events: none;
`

const BannerContainer = styled.div`
  padding-top: 6rem;
  box-sizing: border-box;
  display: flex;
  gap: 2.44rem;
  justify-content: center;
  flex-wrap: wrap;
`
const MainCharacter = styled.img`
  width: 14.125rem;
  height: 18.1875rem;
`

const BannerContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 3.9rem;
  gap: 2.94rem;
`

const BannerTitle = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 2rem;
  font-weight: 600;
  padding-left: 3.87rem;
`

const BannerContent = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.875rem; /* 125% */
  letter-spacing: 0.036rem;
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5.37rem;
  //padding-top: 3.44rem;
  //justify-content: center;
  align-items: center;
  padding-bottom: 2rem;
`

const ContentTitle = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 2rem;
  font-weight: 400;
`

const ServiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap:3.5rem;
`

const ServiceCard = styled.div`
  position: relative;
  width: 18.5625rem;
  height: 21.1875rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  background: rgba(0, 45, 86, 0.10);
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
`

const Icon = styled.img`
  position: absolute; 
  top: -4.2rem; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 7rem;
  height: 7rem;
`

const CardTitle = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 1.5rem;
  font-weight: 400;
  line-height: normal;
`

const CardContent = styled.div`
  padding-top: 2.37rem;
  text-align: center;
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.625rem; /* 185.714% */
`

const Button = styled.div`
  margin-top: 2rem;
  width: 6.87rem;
  height: 2.06rem;
  display: flex;
  font-size: 1rem;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  background: #FFE6A2;
  cursor: pointer;
`

const Main = () => {

  const navigate = useNavigate();

  const handleStartMatching = async () => {
    try {
      const response = await axiosInstance.post("/api/matching/queue", {
        userId: 1, // 실제 로그인 유저 ID로 교체 (ex: localStorage에서 가져오기)
      });

      const result = response.data.data;
      console.log("매칭 결과:", result);

      // WAITING이면 대기 상태로 RandomMatch 이동
      // FOUND면 바로 매칭된 상태로 RandomMatch 이동
      navigate("/random-match", { state: { matchStatus: result } });

    } catch (error) {
      console.error("매칭 요청 오류:", error);
      alert("매칭 대기열 진입 중 오류가 발생했습니다.");
    }
  };


  return (
    <Container>
      <TransparentHeader />
      <Banner>
        <BannerContainer>
          <MainCharacter src={Character} alt="캐릭터"/>
          <BannerContentWrapper>
            <BannerTitle>새로운 문화와 친구, 지금 우리 학교 안에서 시작해요</BannerTitle>
            <BannerContent>학교 이메일 인증으로 안전하게, 취향·성격·관심사 기반으로 나와 잘 맞는 외국인 친구를 찾아드려요.<br /> 1:1 채팅으로 자연스럽게 언어를 배우고 문화를 나누며, 교내에서 시작되는 글로벌 네트워킹을 경험하세요.</BannerContent>
          </BannerContentWrapper>
        </BannerContainer>
      </Banner>
      <ContentContainer>
        <ContentTitle>주요 서비스 소개</ContentTitle>
        <ServiceContainer>
          <ServiceCard>
            <Icon src={RandomMatch} />
            <CardTitle>친구 랜덤 매칭</CardTitle>
            <CardContent>취향과 성격을 기반으로 <br />교내 외국인 친구를 자동 매칭합니다.</CardContent>
            <Button onClick={handleStartMatching}>시작하기</Button>
          </ServiceCard>

          <ServiceCard>
            <Icon src={Study} />
            <CardTitle>스터디 모집</CardTitle>
            <CardContent>언어 교환부터 전공 스터디까지,<br /> 관심 분야별 팀을 쉽게 만들 수 있습니다.</CardContent>
            <Button  onClick={() => navigate("/study")}>시작하기</Button>
          </ServiceCard>

          <ServiceCard>
            <Icon src={Message} />
            <CardTitle>채팅</CardTitle>
            <CardContent>매칭된 친구와 실시간으로 대화하며<br /> 자연스럽게 언어와 문화를 교류합니다.</CardContent>
            <Button  onClick={() => navigate("/message")}>시작하기</Button>
          </ServiceCard>
        </ServiceContainer>
      </ContentContainer>
    </Container>
  );
};

export default Main;