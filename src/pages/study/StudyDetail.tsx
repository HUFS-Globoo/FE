// src/components/study/StudyDetail.tsx
import type { UserMeResponse } from "../../types/mypage&profile.types";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CommentSection from "../../components/CommentSection";
import { 
    getStudyDetail, deleteStudy, handleApiError 
} from "../../api/studyAPI"; 

import { 
    getCommentsByStudyId, 
    addCommentToStudy, 
    updateComment, 
    deleteComment 
} from "../../api/commentAPI";

import type { 
    StudyItem, 
    StudyDetailResponse, 
    StudyComment, 
    CommentRequest,
    StudyStatus
} from "../../types/study.types";


// 목데이터 (인증 구현 전까지 현재 로그인 사용자 정보로 사용)
const mockUserData = {
    id: 1, // 현재 로그인 사용자의 ID
    username: "홍길동",
    nickname: "멋쟁이",
    email: "likelion@hufs.ac.kr",
    profileImage: null,
    country: "KR"
};

import ParticipantImg from "../../assets/img-participant.svg";
import AmericaProfileImg from "../../assets/img-profile1-America.svg";
import KoreaProfileImg from "../../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../../assets/img-profile1-China.svg";
import axiosInstance from "../../../axiosInstance";

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

// 사용자 프로필 카드 (좌측)
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

const StatusBadge = styled.span<{ $status: StudyStatus }>`
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
    const { id: postId } = useParams<{ id: string }>();
    const studyId = Number(postId);
    const navigate = useNavigate();
    const [studyDetail, setStudyDetail] = useState<StudyItem | null>(null);
    const [comments, setComments] = useState<StudyComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false); 
    const [currentUser, setCurrentUser] = useState<UserMeResponse | null>(null);
    
    // 현재 로그인 사용자 정보 불러오기
    useEffect(() => {
      const fetchUserMe = async () => {
        try {
          const res = await axiosInstance.get<UserMeResponse>("/api/users/me");
          setCurrentUser(res.data);
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
        }
      };
      fetchUserMe();
    }, []);


    // 댓글 commeeent
    const fetchComments = useCallback(async () => {
        if (isNaN(studyId) || studyId === 0) return;

        setIsCommentsLoading(true);
        try {
            const response = await getCommentsByStudyId(studyId);
            setComments(response.content || []); 
        } catch (err) {
            console.error("댓글 로딩 실패:", err);
        } finally {
            setIsCommentsLoading(false);
        }
    }, [studyId]);


    // 게시글 상세 정보
    useEffect(() => {
        const fetchStudyDetail = async () => {
            if (isNaN(studyId) || studyId === 0) {
                setError("잘못된 게시글 ID입니다.");
                setIsLoading(false);
                return;
            }

            try {
                const response: StudyDetailResponse = await getStudyDetail(studyId);
                
                setStudyDetail(response.data); 
                setError(null);
                fetchComments(); 
            } catch (err) {
                const errorMessage = handleApiError(err);
                setError(`게시글 정보를 불러오는데 실패했습니다: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudyDetail();
    }, [studyId, fetchComments]);


    // 게시글 삭제
    const handleDeleteStudy = async () => {
        if (!studyDetail || !window.confirm(`"${studyDetail.title}" 게시글을 정말 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await deleteStudy(studyId);
            alert("게시글이 성공적으로 삭제되었습니다.");
            navigate('/study');
        } catch (err) {
            const errorMessage = handleApiError(err);
            alert(`게시글 삭제에 실패했습니다: ${errorMessage}`);
        }
    };

    // 댓글 추가
    const handleAddComment = async (content: string) => {
        if (!studyId || !content.trim()) return false;

        try {
            const data: CommentRequest = { content };
            await addCommentToStudy(studyId, data); 
            alert("댓글이 달렸습니다!");
            await fetchComments();
            return true;
        } catch (err) {
            const errorMessage = handleApiError(err);
            alert(`댓글 작성에 실패했습니다: ${errorMessage}`);
            return false;
        }
    };

    // 댓글 수정
    const handleEditComment = async (commentId: number, content: string) => {
        if (!content.trim()) return false;
        
        try {
            const data: CommentRequest = { content };
            await updateComment(studyId, commentId, data);
            await fetchComments(); 
            return true; 
        } catch (err) {
            const errorMessage = handleApiError(err);
            alert(`댓글 수정에 실패했습니다: ${errorMessage}`);
            return false;
        }
    };

    // 댓글 삭제 
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await deleteComment(studyId, commentId);
            alert("댓글이 삭제되었습니다!");
            await fetchComments(); 
        } catch (err) {
            const errorMessage = handleApiError(err);
            alert(`댓글 삭제에 실패했습니다: ${errorMessage}`);
        }
    };


    // 마이페이지/게시글 이동
    const handleMyPostsClick = () => { navigate("/mypage"); };
    const handleMyCommentsClick = () => { navigate("/mypage"); };
    const handleCreatePostClick = () => { navigate("/study/post"); };
    const handleJoinStudy = async () => {
    if (!studyDetail || !window.confirm(`"${studyDetail.title}" 스터디에 가입 요청을 하시겠습니까?`)) {
        return;
    }

    try {
        alert("스터디 가입 요청을 성공적으로 보냈습니다.");
        // navigate(0); // 새로고침
    } catch (err) {
        const errorMessage = handleApiError(err);
        alert(`스터디 가입 요청에 실패했습니다: ${errorMessage}`);
    }
};

    // 로딩 및 에러 처리 UI
    if (isLoading) {
        return (
            <Container>
                <ContentWrapper>
                    <div className="Body1">게시글을 불러오는 중...</div>
                </ContentWrapper>
            </Container>
        );
    }
    if (error) {
        return (
            <Container>
                <ContentWrapper>
                    <div className="Body1" style={{ color: 'red' }}>오류: {error}</div>
                </ContentWrapper>
            </Container>
        );
    }
    
    const studyData = studyDetail!;
// 데이터 가공
    const isAuthor = currentUser && studyData.authorId === currentUser.userId;

    
    const characterImage = studyData.authorProfileImageUrl || 
        countryCharacterImages[studyData.campus] || // 임시로 campus를 기반으로 이미지 선택
        KoreaProfileImg;

    // 캠퍼스 및 언어 매핑 (기존 로직 유지)
    const campusMap: { [key: string]: string } = { 'GLOBAL': '글로벌캠퍼스', 'SEOUL': '서울캠퍼스' };
    const languageMap: { [key: string]: string } = { '한국어': '한국어', '영어': '영어', '일본어': '일본어', '중국어': '중국어', '아랍어': '아랍어' };

    const tags = [];
    if (studyData.campus) tags.push(campusMap[studyData.campus] || studyData.campus);
    if (studyData.language) tags.push(languageMap[studyData.language] || studyData.language);
    // studyData.tags는 StudyItem에 없으므로 제거


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
                            <ActionButton $variant="secondary" className="Button1" onClick={handleMyPostsClick}>작성한 게시글</ActionButton>
                            <ActionButton $variant="secondary" className="Button1" onClick={handleMyCommentsClick}>작성한 댓글</ActionButton>
                            <ActionButton $variant="primary" className="Button1" onClick={handleCreatePostClick}>게시글 작성</ActionButton>
                        </ButtonGroup>
                    </UserProfileCard>
                </LeftPanel>

                <RightPanel>
                    <PageTitle className="H1">스터디 모집</PageTitle>
                    
                    <StudyDetailCard>
                        <StudyHeader>
                            <StudyAuthorSection>
                                <StudyAuthorImage src={characterImage} alt="작성자" />
                                <AuthorName className="H4">
                                    {studyData.authorNickname}
                                </AuthorName>
                            </StudyAuthorSection>
                            
                            <StudyInfo>
                                <StudyMetaInfo>
                                    <StatusBadge $status={studyData.status} className="Button2">
                                        {studyData.status}
                                    </StatusBadge>

                                    <ParticipantInfo className="Body2">
                                        <img src={ParticipantImg} alt="참여자" />
                                        {/* API에 currentParticipants 필드가 없으므로 임시로 0으로 표시 - pr하시면 다시 수정 */}
                                        0명 / {studyData.capacity}명
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
                        
                        
                        {isAuthor ? (
                            <ButtonGroup style={{ flexDirection: 'row', marginTop: '1rem', justifyContent: 'flex-end' }}>
                                <ActionButton $variant="secondary" className="Button1" onClick={() => navigate(`/study/edit/${studyId}`)}>
                                    수정
                                </ActionButton>
                                {/* 삭제하기 버튼: handleDeleteStudy 호출 */}
                                <ActionButton $variant="primary" className="Button1" onClick={handleDeleteStudy}>
                                    삭제
                                </ActionButton>
                            </ButtonGroup>
                        ) : (
                            <JoinButton className="Button1" onClick={handleJoinStudy} style={{ marginTop: '1rem' }}>
                                가입하기
                            </JoinButton>
                        )}

                        <JoinButton className="Button1" onClick={handleJoinStudy} style={{ marginTop: '1rem' }}>
                            가입하기
                        </JoinButton>
                    </StudyDetailCard>

                    <CommentSection 
                        studyId={studyId}
                        comments={comments}
                        currentUserId={Number(localStorage.getItem("userId"))}
                        onAddComment={handleAddComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        isCommentsLoading={isCommentsLoading}
                    />
                </RightPanel>
            </ContentWrapper>
        </Container>
    );
};

export default StudyDetail;