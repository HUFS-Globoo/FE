import styled from "styled-components";
import Study from "../assets/study-icon.svg";
import RandomMatch from "../assets/random-match-icon.svg";
import Message from "../assets/message-icon.svg"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
`
const MainCharacter = styled.img`
  width: 14.125rem;
  height: 18.1875rem;
`

const BannerContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  //padding-top: 3.9rem;
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
  text-align: center;
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

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartMatching = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
  
    if (!userId || !token) {
      // 로그인하지 않은 경우 ProtectedRoute가 처리하도록 그냥 이동
      navigate("/random-match");
      return;
    }
  
    // 로그인한 경우에만 매칭 대기열에 등록
    try {
      const response = await axiosInstance.post(
        "/api/matching/queue",
        { userId: Number(userId) }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("매칭 대기열 등록 성공:", response.data);

      navigate("/random-match", {
        state: { matchStatus: "WAITING", userId: Number(userId) },
      });
    } catch (error) {
      console.error("매칭 요청 실패:", error);
      alert(t("main.alert.matchingError"));
    }
  };

  return (
    <Container>
      <TransparentHeader />
      <Banner>
        <BannerContainer>
          <MainCharacter src={Character} alt="캐릭터"/>
          <BannerContentWrapper>
            <BannerTitle>{t("main.banner.title")}</BannerTitle>
            <BannerContent dangerouslySetInnerHTML={{ __html: t("main.banner.content") }} />
          </BannerContentWrapper>
        </BannerContainer>
      </Banner>
      <ContentContainer>
        <ContentTitle>{t("main.content.title")}</ContentTitle>
        <ServiceContainer>
          <ServiceCard>
            <Icon src={RandomMatch} />
            <CardTitle>{t("main.services.randomMatch.title")}</CardTitle>
            <CardContent dangerouslySetInnerHTML={{ __html: t("main.services.randomMatch.description") }} />
            <Button onClick={handleStartMatching}>{t("main.services.startButton")}</Button>
          </ServiceCard>

          <ServiceCard>
            <Icon src={Study} />
            <CardTitle>{t("main.services.study.title")}</CardTitle>
            <CardContent dangerouslySetInnerHTML={{ __html: t("main.services.study.description") }} />
            <Button  onClick={() => navigate("/study")}>{t("main.services.startButton")}</Button>
          </ServiceCard>

          <ServiceCard>
            <Icon src={Message} />
            <CardTitle>{t("main.services.message.title")}</CardTitle>
            <CardContent dangerouslySetInnerHTML={{ __html: t("main.services.message.description") }} />
            <Button  onClick={() => navigate("/message")}>{t("main.services.startButton")}</Button>
          </ServiceCard>
        </ServiceContainer>
      </ContentContainer>
    </Container>
  );
};

export default Main;