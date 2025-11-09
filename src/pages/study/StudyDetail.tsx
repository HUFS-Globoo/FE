import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CommentSection from "../../components/CommentSection";
import type { StudyCardItem, StudyComment } from "../../types/study.types";
import ParticipantImg from "../../assets/img-participant.svg";
import AmericaProfileImg from "../../assets/img-profile1-America.svg";
import KoreaProfileImg from "../../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../../assets/img-profile1-China.svg";

// 목데이터 - 나중에 API로 교체
const mockStudyDetail: StudyCardItem = {
  id: 3,
  title: "융인대생과 함께 배우는 아랍어 교실",
  content: "스터디 부원 모집해요! 스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요 스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요 스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요 스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요 스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요 스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요스터디 부원 모집해요 스터디 부원 모집해요스터디 부원 모집해요",
  status: "모집중",
  campus: "GLOBAL",
  language: "아랍어",
  capacity: 15,
  createdAt: "2025-10-15T00:00:00Z",
  updatedAt: "2025-10-15T00:00:00Z",
  currentParticipants: 11,
  authorId: 3,
  authorProfileImage: null,
  authorCountry: "EG",
  tags: ["아랍어", "이집트"]
};

const mockComments: StudyComment[] = [
  {
    id: 5,
    postId: 3,
    content: "영어 마침 배워보고 싶었는데 어떻게 참여하나요? 친구랑 같이 참여해보고 싶어요!영어 마침 배워보고 싶었는데 어떻게 참여하나요? 친구랑 같이 참여해보고 싶어요!영어 마침 배워보고 싶었는데 어떻게 참여하나요? 친구랑 같이 참여해보고 싶어요! 친구랑 같이 참여해보고 싶어요!",
    createdAt: "2025-11-08T00:00:00Z",
    updatedAt: "2025-11-08T00:00:00Z",
    author: {
      id: 3,
      nickname: "닉네임동백",
      profileImageUrl: null
    }
  },
  {
    id: 2,
    postId: 3,
    content: "멋지겠다",
    createdAt: "2025-11-07T00:00:00Z",
    updatedAt: "2025-11-07T00:00:00Z",
    author: {
      id: 2,
      nickname: "8812",
      profileImageUrl: null
    }
  }
];

const mockUserData = {
  id: 1,
  username: "홍길동",
  nickname: "멋쟁이",
  email: "likelion@hufs.ac.kr",
  profileImage: null,
  country: "KR"
};

// 국가별 캐릭터 이미지 매핑
const countryCharacterImages: { [key: string]: string } = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  EG: EgyptProfileImg,
  CN: ChinaProfileImg,
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--gray-text-filled);
  padding: 3rem 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
`;

const LeftPanel = styled.div`
  width: 350px;
  flex-shrink: 0;
`;

const RightPanel = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  margin-bottom: 2.5rem;
`;

// 사용자 프로필 카드 (좌측) - StudyList와 동일
const UserProfileCard = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--gray);
`;

const UserInfo = styled.div`
  text-align: center;
`;

const UserName = styled.div`
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.div`
  color: var(--gray-400);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.$variant === 'primary' ? 'var(--primary)' : 'var(--skyblue)'};
  border-radius: 0.75rem;
  background-color: ${props => props.$variant === 'primary' ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.$variant === 'primary' ? 'var(--white)' : 'var(--skyblue)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$variant === 'primary' ? 'var(--primary)' : 'var(--skyblue)'};
    color: var(--white);
  }
`;

// 스터디 상세 정보 카드
const StudyDetailCard = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const StudyHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StudyAuthorSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  min-width: 120px;
`;

const StudyAuthorImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled.div`
  color: var(--black);
  text-align: center;
  line-height: 1.3;
`;

const StudyInfo = styled.div`
  flex: 1;
`;

const StudyMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span<{ $status: '모집중' | '마감' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  background-color: ${props => props.$status === '모집중' ? 'var(--primary)' : 'var(--gray)'};
  color: ${props => props.$status === '모집중' ? 'var(--white)' : 'var(--gray-400)'};
`;

const ParticipantInfo = styled.span`
  color: var(--gray-700);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  background-color: var(--skyblue);
  color: var(--white);
`;

const StudyTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: var(--black);
`;

const StudyContent = styled.div`
  color: var(--gray-700);
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--gray-text-filled);
  border-radius: 0.75rem;
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--skyblue);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary);
  }
`;

const StudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studyData, setStudyData] = useState<StudyCardItem | null>(null);
  const [comments, setComments] = useState<StudyComment[]>([]);

  useEffect(() => {
    // 😭 실제 API 호출로 대체 필요
    // const fetchStudyDetail = async () => {
    //   const response = await fetch(`/api/studies/${id}`);
    //   const result = await response.json();
    //   setStudyData(result.data);
    // };
    // fetchStudyDetail();

    // 목데이터 설정
    setStudyData(mockStudyDetail);
    setComments(mockComments);
  }, [id]);

  const handleAddComment = (content: string) => {
    // 😭 실제 API 호출로 대체
    const newComment: StudyComment = {
      id: Date.now(),
      postId: parseInt(id!),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: mockUserData.id,
        nickname: mockUserData.nickname,
        profileImageUrl: mockUserData.profileImage
      }
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId: number, content: string) => {
    // 😭 실제 API 호출로 대체
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content, updatedAt: new Date().toISOString() }
        : comment
    ));
  };

  const handleDeleteComment = (commentId: number) => {
    // 😭 실제 API 호출로 대체
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleJoinStudy = () => {
    // 😭 실제 가입 API 호출로 대체
    alert("스터디에 가입되었습니다! 곧 작성자님이 연락드릴 거예요.");
  };

  const handleMyPostsClick = () => {
  navigate("/mypage");
};

const handleMyCommentsClick = () => {
  navigate("/mypage");
};

const handleCreatePostClick = () => {
  navigate("/study/post");
};

  if (!studyData) {
    return (
      <Container>
        <ContentWrapper>
          <div className="Body1">로딩 중...</div>
        </ContentWrapper>
      </Container>
    );
  }

  const characterImage = studyData.authorProfileImage || 
    countryCharacterImages[studyData.authorCountry || 'KR'] || 
    KoreaProfileImg;

  // 캠퍼스 및 언어 매핑
  const campusMap: { [key: string]: string } = {
    'GLOBAL': '글로벌캠퍼스',
    'SEOUL': '서울캠퍼스'
  };

  const languageMap: { [key: string]: string } = {
    '한국어': '한국어',
    '영어': '영어',
    '일본어': '일본어',
    '중국어': '중국어',
    '아랍어': '아랍어',
  };

  const tags = [];
  if (studyData.campus) tags.push(campusMap[studyData.campus] || studyData.campus);
  if (studyData.language) tags.push(languageMap[studyData.language] || studyData.language);
  if (studyData.tags) tags.push(...studyData.tags);

  return (
    <Container>
      <ContentWrapper>
        <LeftPanel>
          <UserProfileCard>
            <ProfileImage 
              src={mockUserData.profileImage || "/placeholder-profile.png"} 
              alt="프로필"
            />
            <UserInfo>
              <UserName className="H4">
                {mockUserData.username} / {mockUserData.nickname}
              </UserName>
              <UserEmail className="Body2">
                {mockUserData.email}
              </UserEmail>
            </UserInfo>
            <ButtonGroup>
              <ActionButton 
                $variant="secondary" 
                className="Button1"
                onClick={handleMyPostsClick}
              >
                작성한 게시글
              </ActionButton>
              <ActionButton 
                $variant="secondary" 
                className="Button1"
                onClick={handleMyCommentsClick}
              >
                작성한 댓글
              </ActionButton>
              <ActionButton 
                $variant="primary" 
                className="Button1"
                onClick={handleCreatePostClick}
              >
                게시글 작성
              </ActionButton>
            </ButtonGroup>
          </UserProfileCard>
        </LeftPanel>

        <RightPanel>
          <PageTitle className="H1">스터디 모집</PageTitle>
          
          <StudyDetailCard>
            <StudyHeader>
              <StudyAuthorSection>
                <StudyAuthorImage src={characterImage} alt="작성자" />
                {/* 임시로 주석처리 - 백엔드 작성자 API 확인 후 구현
                <AuthorName className="H4">
                  작성자 이름 / 닉네임
                </AuthorName>
                */}
              </StudyAuthorSection>
              
              <StudyInfo>
                <StudyMetaInfo>
                  <StatusBadge $status={studyData.status as '모집중' | '마감'} className="Button2">
                    {studyData.status}
                  </StatusBadge>

                  <ParticipantInfo className="Body2">
                    <img src={ParticipantImg} alt="참여자" />
                    {studyData.currentParticipants || 0}명 / {studyData.capacity}명
                  </ParticipantInfo>

                  <TagContainer>
                    {tags.map((tag, index) => (
                      <Tag key={index} className="Button2"># {tag}</Tag>
                    ))}
                  </TagContainer>
                </StudyMetaInfo>
                
                <StudyTitle className="H2">{studyData.title}</StudyTitle>
              </StudyInfo>
            </StudyHeader>

            <StudyContent className="Body1">
              {studyData.content}
            </StudyContent>

            <JoinButton className="Button1" onClick={handleJoinStudy}>
              가입하기
            </JoinButton>
          </StudyDetailCard>

          <CommentSection 
            studyId={parseInt(id!)}
            comments={comments}
            currentUserId={mockUserData.id} // 😭api에서 받아온 현재 사용자 ID로 대체 필요함
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </RightPanel>
      </ContentWrapper>
    </Container>
  );
};

export default StudyDetail;