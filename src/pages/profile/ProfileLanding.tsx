import * as React from "react";
import styled, { keyframes, css } from "styled-components";  // css 추가!
import { useNavigate } from "react-router-dom";
import ProfileBanner from "../../components/ProfileBanner";

const mockProfilesForLanding = [
  {
    userId: 1,
    nickname: "김민수",
    campus: "GLOBAL" as const,
    country: "KR" as const,
    mbti: "ENFP",
    profileImage: null,
    languages: {
      native: ["ko"],
      learn: ["en", "ja"]
    },
    keywords: ["활발한", "음악감상", "여행"],
    intro: "안녕하세요! 다양한 문화에 관심이 많아요\n함께 언어교환하며 친구가 되어요!"
  },
  {
    userId: 2,
    nickname: "Sarah Johnson",
    campus: "GLOBAL" as const,
    country: "US" as const,
    mbti: "ISFJ",
    profileImage: null,
    languages: {
      native: ["en"],
      learn: ["ko", "ja"]
    },
    keywords: ["친절한", "요리", "영화시청"],
    intro: "Nice to meet you!\nI love Korean culture and food. Let's be friends!"
  },
  {
    userId: 3,
    nickname: "田中さくら",
    campus: "SEOUL" as const,
    country: "JP" as const,
    mbti: "INFP",
    profileImage: null,
    languages: {
      native: ["ja"],
      learn: ["ko", "en"]
    },
    keywords: ["차분한", "독서", "사진촬영"],
    intro: "こんにちは！\n韓国語を勉強しています。一緒に頑張りましょう！"
  },
  {
    userId: 4,
    nickname: "Ahmed Hassan",
    campus: "GLOBAL" as const,
    country: "EG" as const,
    mbti: "ESTP",
    profileImage: null,
    languages: {
      native: ["ar"],
      learn: ["ko", "en"]
    },
    keywords: ["열정적인", "운동", "음식"],
    intro: "مرحبا! أحب الثقافة الكورية\nLet's exchange languages and cultures!"
  },
  {
    userId: 5,
    nickname: "李小美",
    campus: "SEOUL" as const,
    country: "CN" as const,
    mbti: "ESFP",
    profileImage: null,
    languages: {
      native: ["zh"],
      learn: ["ko"]
    },
    keywords: ["유쾌한", "카페가기", "패션"],
    intro: "你好! 很高兴认识大家\n한국어 공부하고 있어요. 친구해요!"
  }
];

// 애니메이션
const float1 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(-10px); }
  50% { transform: translateY(-25px); }
`;

const float3 = keyframes`
  0%, 100% { transform: translateY(-5px); }
  50% { transform: translateY(-20px); }
`;

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center; /* 중앙 정렬! */
  padding: 2rem;
`;

// 떠있는 프로필들이 배치될 배경 영역
const FloatingArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// 개별 떠있는 프로필 컨테이너
const FloatingProfile = styled.div<{ 
  $index: number; 
  $size: 'small' | 'medium' | 'large' 
}>`
  position: absolute;
  width: ${props => 
    props.$size === 'small' ? '320px' :
    props.$size === 'medium' ? '380px' :
    '450px'
  };
  opacity: 0.6; /* 좀 더 투명하게 */
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;

  /* 각 프로필별 위치 설정 */
  ${props => props.$index === 0 && css`
    top: 8%;
    left: 5%;
    animation: ${float1} 4s ease-in-out infinite;
  `}
  
  ${props => props.$index === 1 && css`
    top: 20%;
    left: 30%;
    animation: ${float2} 5s ease-in-out infinite;
  `}
  
  ${props => props.$index === 2 && css`
    top: 50%;
    left: 8%;
    animation: ${float3} 6s ease-in-out infinite;
  `}
  
  ${props => props.$index === 3 && css`
    top: 15%;
    right: 5%;
    animation: ${float1} 4.5s ease-in-out infinite;
  `}
  
  ${props => props.$index === 4 && css`
    bottom: 10%;
    right: 25%;
    animation: ${float2} 5.5s ease-in-out infinite;
  `}

  &:hover {
    opacity: 1;
    transform: translateY(-20px) scale(1.05);
    z-index: 10;
  }

  @media (max-width: 1200px) {
    width: ${props => 
      props.$size === 'small' ? '250px' : 
      props.$size === 'medium' ? '300px' : '350px'
    };
  }
`;

// 중앙 CTA 영역
const CTASection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  gap: 2rem;
  z-index: 5;
  animation: ${fadeIn} 1s ease-out;
  text-align: center; /* 텍스트 중앙 정렬 */
  max-width: 500px;
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
  background: linear-gradient(45deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Button = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #2980b9, #3498db);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

// 배경 장식 요소들
const BackgroundCircle = styled.div<{ 
  $size: number; 
  $top: string; 
  $left: string; 
}>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db15, #2980b910);
  top: ${props => props.$top};
  left: ${props => props.$left};
  animation: ${float1} 8s ease-in-out infinite;
  pointer-events: none;
`;

const ProfileLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const handleExploreClick = () => {
    navigate('/profile');
  };

  // 프로필 크기 패턴
  const getSizePattern = (index: number): 'small' | 'medium' | 'large' => {
    const patterns: ('small' | 'medium' | 'large')[] = ['large', 'small', 'medium', 'small', 'medium'];
    return patterns[index] || 'medium';
  };

  return (
    <Container>
      {/* 배경 장식 요소들 */}
      <BackgroundCircle $size={100} $top="15%" $left="10%" />
      <BackgroundCircle $size={60} $top="65%" $left="85%" />
      <BackgroundCircle $size={80} $top="80%" $left="15%" />

      {/* 떠있는 프로필들 */}
      <FloatingArea>
        {mockProfilesForLanding.map((profile, index) => (
          <FloatingProfile
            key={profile.userId}
            $index={index}
            $size={getSizePattern(index)}
            onClick={() => handleProfileClick(profile.userId)}
          >
            <ProfileBanner
              userId={profile.userId}
              nickname={profile.nickname}
              campus={profile.campus}
              country={profile.country}
              mbti={profile.mbti}
              profileImage={profile.profileImage}
              languages={profile.languages}
              keywords={profile.keywords}
              intro={profile.intro}
            />
          </FloatingProfile>
        ))}
      </FloatingArea>

      {/* 중앙 CTA 영역 */}
      <CTASection>
        <div>
          <Title className='H1'>
            새로운 친구들을<br />
            만나보세요! 👋
          </Title>
          <Subtitle>
            전 세계 다양한 친구들과<br />
            함께하는 외대 생활!<br />
            당신과 딱 맞는 친구를 만나고 공부도 같이해봐요!
          </Subtitle>
        </div>
        <Button onClick={handleExploreClick} className='H4'>
          프로필 찾아보기 ✨
        </Button>
      </CTASection>
    </Container>
  );
};

export default ProfileLanding;
