import * as React from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "../../components/ProfileBanner";

const mockProfilesForLanding = [
  {
    userId: 35,
    nickname: "뽀또",
    campus: "GLOBAL" as const,
    country: "US" as const,
    mbti: "ENFP",
    profileImage: null,
    languages: {
      native: ["en"],
      learn: ["en", "zh"]
    },
    keywords: ["솔직한", "산책", "아이돌"],
    intro: "Hi! 다양한 문화에 관심이 많아요\n함께 언어교환하며 친구가 되어봐요!"
  },
  {
    userId: 33,
    nickname: "jack",
    campus: "GLOBAL" as const,
    country: "US" as const,
    mbti: "ENFP",
    profileImage: null,
    languages: {
      native: ["en"],
      learn: ["zh", "ko"]
    },
    keywords: ["활발한", "영화 시청", "음악"],
    intro: "Nice to meet you!\nI love Korean culture and food. Let's be friends!"
  },
  {
    userId: 32,
    nickname: "田中さくら",
    campus: "GLOBAL" as const,
    country: "KR" as const,
    mbti: "ENFP",
    profileImage: null,
    languages: {
      native: ["ko"],
      learn: ["zh", "en"]
    },
    keywords: ["솔직한", "차분한", "음악감상"],
    intro: "반갑습니다! 군고구마를 좋아하는 한국외대 학생입니다"
  },
  {
    userId: 31,
    nickname: "마라탕후루",
    campus: "GLOBAL" as const,
    country: "CN" as const,
    mbti: "SEOUL",
    profileImage: null,
    languages: {
      native: ["zh"],
      learn: ["ko", "en"]
    },
    keywords: ["열정적인", "운동", "공부"],
    intro: "مرحبا! أحب الثقافة الكورية\nLet's exchange languages and cultures!"
  },
  {
    userId: 30,
    nickname: "모하메드",
    campus: "GLOBAL" as const,
    country: "ar" as const,
    mbti: "ENFP",
    profileImage: null,
    languages: {
      native: ["ar"],
      learn: ["ko"]
    },
    keywords: ["활발한", "운동", "환경"],
    intro: "你好! 很高兴认识大家\n한국어 공부하고 있어요. 친구해요!"
  }
  ,{
    userId: 29,
    nickname: "진수진수",
    campus: "GLOBAL" as const,
    country: "IT" as const,
    mbti: "ISFP",
    profileImage: null,
    languages: {
      native: ["it"],
      learn: ["it"]
    },
    keywords: ["활발한", "운동", "음악"],
    intro: "Gratum est vos convenire!"
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
  justify-content: center;
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

// 개별 떠있는 프로필 컨테이너 - 스케일로 크기 조정
const FloatingProfile = styled.div<{ 
  $index: number; 
  $size: 'small' | 'medium' | 'large' 
}>`
  position: absolute;
  width: 420px; /* 모든 카드를 기본 큰 크기로 통일 */
  opacity: 0.6;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center;
  
  /* 크기별 스케일링으로 내부 요소들 비례 조정 */
  ${props => props.$size === 'small' && css`
    transform: scale(0.7); /* 70% 크기 */
  `}
  
  ${props => props.$size === 'medium' && css`
    transform: scale(0.85); /* 85% 크기 */
  `}
  
  ${props => props.$size === 'large' && css`
    transform: scale(1.0); /* 100% 크기 */
  `}

  /* 각 프로필별 위치 설정 - 6개 카드에 맞게 배치 */
  ${props => props.$index === 0 && css`
    top: 8%;
    left: 3%;
    animation: ${float1} 4s ease-in-out infinite;
  `}
  
  ${props => props.$index === 1 && css`
    top: 5%;
    left: 28%;
    animation: ${float2} 5s ease-in-out infinite;
  `}
  
  ${props => props.$index === 2 && css`
    top: 35%;
    left: 8%;
    animation: ${float3} 6s ease-in-out infinite;
  `}
  
  ${props => props.$index === 3 && css`
    top: 10%;
    right: 3%;
    animation: ${float1} 4.5s ease-in-out infinite;
  `}
  
  ${props => props.$index === 4 && css`
    bottom: 15%;
    right: 20%;
    animation: ${float2} 5.5s ease-in-out infinite;
  `}
  
  ${props => props.$index === 5 && css`
    bottom: 8%;
    left: 25%;
    animation: ${float3} 7s ease-in-out infinite;
  `}

  &:hover {
    opacity: 1;
    transform: ${props => 
      props.$size === 'small' ? 'scale(0.75) translateY(-20px)' :
      props.$size === 'medium' ? 'scale(0.9) translateY(-20px)' :
      'scale(1.05) translateY(-20px)'
    };
    z-index: 10;
  }

  @media (max-width: 1200px) {
    ${props => props.$size === 'small' && css`
      transform: scale(0.6);
    `}
    
    ${props => props.$size === 'medium' && css`
      transform: scale(0.75);
    `}
    
    ${props => props.$size === 'large' && css`
      transform: scale(0.85);
    `}

    &:hover {
      transform: ${props => 
        props.$size === 'small' ? 'scale(0.65) translateY(-15px)' :
        props.$size === 'medium' ? 'scale(0.8) translateY(-15px)' :
        'scale(0.9) translateY(-15px)'
      };
    }
  }

  @media (max-width: 768px) {
    ${props => props.$size === 'small' && css`
      transform: scale(0.45);
    `}
    
    ${props => props.$size === 'medium' && css`
      transform: scale(0.55);
    `}
    
    ${props => props.$size === 'large' && css`
      transform: scale(0.65);
    `}

    &:hover {
      transform: ${props => 
        props.$size === 'small' ? 'scale(0.5) translateY(-10px)' :
        props.$size === 'medium' ? 'scale(0.6) translateY(-10px)' :
        'scale(0.7) translateY(-10px)'
      };
    }
  }
`;

// 중앙 CTA 영역
const CTASection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 5;
  animation: ${fadeIn} 1s ease-out;
  text-align: center;
  max-width: 500px;
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 90%;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
  background: linear-gradient(45deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
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

  // 프로필 크기 패턴 - 6개에 맞게 조정
  const getSizePattern = (index: number): 'small' | 'medium' | 'large' => {
    const patterns: ('small' | 'medium' | 'large')[] = ['large', 'small', 'medium', 'medium', 'small', 'large'];
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
              profileImageUrl={profile.profileImage}
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
          <Title className="H1">
            새로운 친구들을<br />
            만나보세요! 👋
          </Title>
          <Subtitle className="Body1">
            전 세계 다양한 친구들과<br />
            함께하는 외대 생활!<br />
            당신과 딱 맞는 친구를 만나고 공부도 같이해봐요!
          </Subtitle>
        </div>
        <Button onClick={handleExploreClick} className="Button1">
          프로필 찾아보기 ✨
        </Button>
      </CTASection>
    </Container>
  );
};

export default ProfileLanding;