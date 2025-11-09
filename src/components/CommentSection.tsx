import { useState } from "react";
import styled from "styled-components";
import type { StudyComment, CommentRequest } from "../types/study.types";
import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";

interface CommentSectionProps {
  studyId: number;
  comments: StudyComment[];
  onAddComment: (content: string) => void;
  onEditComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

// 국가별 캐릭터 이미지 매핑 (추후 실제 프로필 이미지로 교체)
const countryCharacterImages: { [key: string]: string } = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  EG: EgyptProfileImg,
  CN: ChinaProfileImg,
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
  margin-bottom: 1.5rem;
`;

const CommentIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: var(--skyblue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1rem;
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
  border-radius: 0.75rem;
  font-size: 1rem;
  font-family: 'Escoredream', sans-serif;
  font-weight: 300;
  min-height: 6rem;
  resize: vertical;
  margin-bottom: 1rem;
  
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
  margin-bottom: 0.5rem;
`;

const CommentText = styled.p`
  color: var(--gray-700);
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
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

const CommentSection = ({ 
  studyId, 
  comments, 
  onAddComment, 
  onEditComment, 
  onDeleteComment 
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      onDeleteComment(commentId);
    }
  };

  const handleEditComment = (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const newContent = prompt("댓글을 수정하세요:", comment.content);
      if (newContent && newContent.trim() !== comment.content) {
        onEditComment(commentId, newContent.trim());
      }
    }
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <CommentIcon>💬</CommentIcon>
        <CommentTitle className="H4">댓글을 작성해주세요!</CommentTitle>
      </CommentHeader>
      
      <CommentInputSection>
        <CommentDescription className="Body1">
          해당 스터디에 대한 궁금한 점이나 상담을 자유롭게 작성해주세요.
        </CommentDescription>
        
        <CommentTextarea
          className="Body1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        
        <CommentButton 
          className="Button1"
          onClick={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          댓글 작성하기
        </CommentButton>
      </CommentInputSection>

      {comments.length > 0 && (
        <>
          <CommentsListTitle className="H4">댓글</CommentsListTitle>
          <CommentsList>
            {comments.map((comment) => (
              <CommentItem key={comment.id}>
                <CommentAvatar 
                  src={comment.author.profileImageUrl || KoreaProfileImg} 
                  alt={comment.author.nickname}
                />
                
                <CommentContent>
                  <CommentAuthor className="H5">{comment.author.nickname}</CommentAuthor>
                  <CommentText className="Body2">{comment.content}</CommentText>
                  
                  <CommentActions>
                    <ActionButton 
                      $variant="delete" 
                      className="Button2"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      삭제하기
                    </ActionButton>
                    <ActionButton 
                      $variant="edit" 
                      className="Button2"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      수정하기
                    </ActionButton>
                  </CommentActions>
                </CommentContent>
              </CommentItem>
            ))}
          </CommentsList>
        </>
      )}
    </CommentContainer>
  );
};

export default CommentSection;