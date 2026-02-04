import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { StudyComment, CommentRequest } from "../types/study.types";

import { COUNTRY_ASSETS } from "../utils/countryAssets";

import MiniBooImg from "../assets/img-miniBoo.svg";
import { useEffect } from "react";
interface CommentSectionProps {
  studyId: number;
  comments: StudyComment[]; 
  currentUserId: number;
  authorId: number;
  onAddComment: (content: string) => Promise<boolean>;
  onEditComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => void;
  isCommentsLoading: boolean;
  currentUserProfileImageUrl?: string | null;
}


// 업로드 경로일 경우 API BASE URL을 붙여 정규화
const normalizeProfileUrl = (url?: string | null) => {
  if (!url || url.trim() === "") return null;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const cleanBase =
    BASE_URL && BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;

  // '/uploads/...' 또는 'uploads/...' 형태면 BASE_URL 붙이기
  if (url.startsWith("/uploads")) return `${cleanBase}${url}`.replace(/([^:]\/)\/+/g, "$1");
  if (url.startsWith("uploads/")) return `${cleanBase}/${url}`.replace(/([^:]\/)\/+/g, "$1");

  return url.replace(/([^:]\/)\/+/g, "$1");
};

const getCommentProfileImage = (
  comment: StudyComment,
  currentUserId: number,
  currentUserProfileImageUrl?: string | null
) => {
  const useDefaultProfile =
    localStorage.getItem("useDefaultProfileImage") === "true";

  // country 값이 없거나 undefined일 수 있으므로 안전하게 처리
  const country = comment.author?.country;
  const countryUpper = country ? country.toUpperCase() : "KR";

  // 매핑 누락/오타로 앱 터지는 거 방지 (보험)
  const fallbackCharacter =
    (COUNTRY_ASSETS[countryUpper] || COUNTRY_ASSETS["KR"]).character;


  // 🔹 내가 쓴 댓글인 경우
  if (comment.author.id === currentUserId) {
    // 🔸 기본이미지 모드면: 업로드 이미지 다 무시하고 국가 캐릭터 사용
    if (useDefaultProfile) {
      return fallbackCharacter;
    }

    // 🔸 기본이미지 모드가 아니면: 최신 프로필 > 서버 author.profileImageUrl
    const profileUrl = normalizeProfileUrl(comment.author?.profileImageUrl);
    const src =
      currentUserProfileImageUrl ||
      (profileUrl && profileUrl.trim() !== "" ? profileUrl : null) ||
      null;

    if (src) {
      return src.replace(/([^:]\/)\/+/g, "$1");
    }

    // 둘 다 없으면 국가 캐릭터
    return fallbackCharacter;
  }

  // 🔹 다른 사람이 쓴 댓글 (기본모드 플래그 신경 안 씀)
  const profileUrl = normalizeProfileUrl(comment.author?.profileImageUrl);
  if (profileUrl && profileUrl.trim() !== "") {
    return profileUrl.replace(/([^:]\/)\/+/g, "$1");
  }

  return fallbackCharacter;
};

const CommentContainer = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CommentIcon = styled.img`
  width: 2rem;
  height: 2rem;
  object-fit: contain;
`;

const CommentTitle = styled.h3`
  margin: 0;
  color: var(--black);
`;

const CommentInputSection = styled.div`
  margin-bottom: 2rem;
`;

const CommentDescription = styled.p`
  color: var(--gray-700);
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--gray);
  box-sizing: border-box;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-family: 'Escoredream', sans-serif;
  font-weight: 300;
  min-height: 6rem;
  resize: vertical;
  margin-bottom: 1rem;
  background-color: var(--gray-text-filled);
  color: #121212;
  caret-color: #121212;
  
  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const CommentButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: var(--skyblue);
  }

  &:disabled {
    background-color: var(--gray);
    cursor: not-allowed;
  }
`;

const CommentsListTitle = styled.h4`
  margin: 0 0 1.5rem 0;
  color: var(--black);
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const CommentAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  color: var(--black);
  margin-bottom: 0rem;
`;

const CommentText = styled.p`
  color: var(--gray-700);
  margin: 0 0 0.5rem 0;
  line-height: 1.5;

`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $variant?: 'delete' | 'edit' }>`
  padding: 0.25rem 0.75rem;
  border: 1px solid ${props => props.$variant === 'delete' ? 'var(--gray-400)' : 'var(--primary)'};
  border-radius: 0.5rem;
  background-color: ${props => props.$variant === 'delete' ? 'var(--white)' : 'var(--primary)'};
  color: ${props => props.$variant === 'delete' ? 'var(--gray-700)' : 'var(--white)'};
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$variant === 'delete' ? 'var(--gray)' : 'var(--skyblue)'};
  }
`;

const NameLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  margin-bottom: 0.5rem;
`;

const AuthorText = styled.span`
  color: #2F96B4;
  flex-shrink: 0;
  font-size: 11px;
`;


const CommentSection = ({ 
  studyId, 
  comments, 
  currentUserId, 
  authorId,
  onAddComment, 
  onEditComment, 
  onDeleteComment,
  isCommentsLoading,
  currentUserProfileImageUrl, //함수 파라미터에 넣기
}: CommentSectionProps) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
        const success = await onAddComment(newComment.trim()); 
        if (success) { 
            setNewComment("");
        }
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm(t("study.detail.comments.deleteConfirm"))) {
      onDeleteComment(commentId);
    }
  };

  const handleEditComment = async (commentId: number) => { // async 추가
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const newContent = prompt(t("study.detail.comments.editPrompt"), comment.content);
      if (newContent && newContent.trim() !== comment.content) {
        await onEditComment(commentId, newContent.trim()); // await 추가
      }
    }
  };

useEffect(() => {
  console.log("현재 로그인한 유저 ID:", currentUserId);
  console.log("댓글 리스트:", comments.map(c => ({
    commentId: c.id,
    authorId: c.author.id,
    authorNickname: c.author.nickname,
    authorProfileImageUrl: c.author.profileImageUrl,
    authorCountry: c.author.country,
    fullAuthor: c.author
  })));
}, [comments, currentUserId]);

  return (
    <CommentContainer>
      <CommentHeader>
        <CommentIcon src={MiniBooImg} alt={t("study.detail.comments.iconAlt")} />
        <CommentTitle className="H4">
          {t("study.detail.comments.title")}
        </CommentTitle>
      </CommentHeader>
      
      <CommentInputSection>
        <CommentDescription className="Body1">
          {t("study.detail.comments.description")}
        </CommentDescription>
        
        <CommentTextarea
          className="Body1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t("study.detail.comments.placeholder")}
        />
        
        <CommentButton 
          className="Button1"
          onClick={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          {t("study.detail.comments.submit")}
        </CommentButton>
      </CommentInputSection>

      {comments.length > 0 && (
        <>
          <CommentsListTitle className="H4">
            {t("study.detail.comments.listTitle")}
          </CommentsListTitle>
          {isCommentsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--skyblue)' }}>
              {t("study.detail.comments.loading")}
            </div>
          ) : (
            <CommentsList>
              {comments.map((comment) => {
                  const commentAuthorId = Number((comment.author as any).userId ?? comment.author.id);
                 const isAuthorComment = commentAuthorId === Number(authorId);


                return(
                  <CommentItem key={comment.id}>
                  <CommentAvatar
                    src={getCommentProfileImage(comment, currentUserId, currentUserProfileImageUrl)}
                    alt={comment.author.nickname}
                  />
                  
                  <CommentContent>
                      <NameLine>
                        <CommentAuthor className="H5">{comment.author.nickname}</CommentAuthor>
                        {isAuthorComment && (
                          <AuthorText className="Button1">· {t("study.detail.author")}</AuthorText>
                        )}
                      </NameLine>
                    
                    <CommentText className="Body2">{comment.content}</CommentText>
                    
                    {/* 본인이 작성한 댓글만 수정/삭제 버튼 표시 */}
                    {comment.author.id === currentUserId && (
                      <CommentActions>
                        <ActionButton 
                          $variant="delete" 
                          className="Button2"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          {t("common.delete")}
                        </ActionButton>
                        <ActionButton 
                          $variant="edit" 
                          className="Button2"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          {t("common.edit")}
                        </ActionButton>
                      </CommentActions>
                    )}
                  </CommentContent>
                </CommentItem>
                );
              })}
            </CommentsList>
          )}
        </>
      )}
    </CommentContainer>
  );
};

export default CommentSection;