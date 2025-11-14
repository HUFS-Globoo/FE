import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 
import ProfileCard from "../components/ProfileCard";
import ActivityTabs from "../components/ActivityTabs";
import axiosInstance from "../../axiosInstance";
import type { Post, Comment } from "../types/mypage&profile.types";
import { updateComment, deleteComment } from "../api/commentAPI";

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
`;

const PageTitle = styled.h1`
  margin-bottom: 2.5rem;
`;

const Mypage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [languages, setLanguages] = useState<{ nativeCodes: string[]; learnCodes: string[] }>({
    nativeCodes: [],
    learnCodes: [],
  });
  const [keywords, setKeywords] = useState<{ personality: string[]; hobby: string[]; topic: string[] }>({
    personality: [],
    hobby: [],
    topic: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Comment[]>([]);

  const LANGUAGE_MAP: Record<string, string> = {
    ko: "한국어",
    en: "영어",
    es: "스페인어",
    fr: "프랑스어",
    ja: "일본어",
    zh: "중국어",
    de: "독일어",
    it: "이탈리아어",
  };

  const LANGUAGE_REVERSE_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_MAP).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me");
        const user = res.data;

        setUserData(user);

        setLanguages({
          nativeCodes: user.nativeLanguages || [],
          learnCodes: user.learnLanguages || [],
        });
        setKeywords({
          personality: user.personalityKeywords || [],
          hobby: user.hobbyKeywords || [],
          topic: user.topicKeywords || [],
        });

        console.log("내 정보:", user);
      } catch (error) {
        console.error("마이페이지 데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMyPosts = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me/study-posts");
        const data = res.data as any[];

        const mapped: Post[] = data.map((post) => ({
          id: post.id,
          status: post.status as "모집중" | "마감",
          currentParticipants: post.currentParticipants,
          maxParticipants: post.capacity,
          title: post.title,
          tags: [
            ...(post.campuses || []),
            ...(post.languages || []),
          ],
          createdAt: post.createdAt,
        }));

        setMyPosts(mapped);
      } catch (error) {
        console.error("내가 작성한 스터디 글 조회 실패:", error);
      }
    };

    const fetchMyComments = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me/comments");
        const data = res.data as any[];

        const mapped: Comment[] = await Promise.all(
          data.map(async (comment) => {
            try {
              const postRes = await axiosInstance.get(
                `/api/studies/${comment.postId}`
              );
              const post = postRes.data.data;

              const tags = [
                ...(post.campuses || []),
                ...(post.languages || []),
              ];

              return {
                id: comment.id,
                postId: comment.postId,
                postTitle: post.title,
                content: comment.content,
                status: post.status as "모집중" | "마감",
                currentParticipants: post.currentParticipants,
                maxParticipants: post.capacity,
                tags,
              } as Comment;
            } catch (e) {
              console.error(
                `댓글 ${comment.id}의 게시글 정보 조회 실패:`,
                e
              );

              return {
                id: comment.id,
                postId: comment.postId,
                postTitle: "(게시글 정보를 가져오지 못했습니다)",
                content: comment.content,
              } as Comment;
            }
          })
        );

        setMyComments(mapped);
      } catch (error) {
        console.error("내가 작성한 댓글 조회 실패:", error);
      }
    };

    fetchUserData();
    fetchMyPosts();
    fetchMyComments();
  }, []);

  const handleProfileSave = async (updatedData: any) => {
    try {
      const profilePatchData = {
        name: userData.name,
        nickname: updatedData.nickname || userData.nickname,
        mbti: updatedData.mbti || userData.mbti,
        profileImageUrl: updatedData.profileImageUrl || userData.profileImageUrl,
        infoTitle: updatedData.infoTitle || userData.infoTitle,
        infoContent: updatedData.infoContent || userData.infoContent,
        campus: updatedData.campus || userData.campus,
        country: updatedData.country || userData.country,
        email: userData.email,
        personalityKeywords: updatedData.personalityKeywords || keywords.personality,
        hobbyKeywords: updatedData.hobbyKeywords || keywords.hobby,
        topicKeywords: updatedData.topicKeywords || keywords.topic,
      };
  
  
      console.log(profilePatchData);
  
      await axiosInstance.patch("/api/users/me", profilePatchData);
  
      const finalNative = (updatedData.nativeLanguages ?? languages.nativeCodes)
        .map((lang: string) => LANGUAGE_REVERSE_MAP[lang] || lang);
  
      const finalLearn = (updatedData.learnLanguages ?? languages.learnCodes)
        .map((lang: string) => LANGUAGE_REVERSE_MAP[lang] || lang);
  
      const languagePutData = {
        nativeCodes: finalNative,
        learnCodes: finalLearn,
      };
  
      console.log(languagePutData);
  
      await axiosInstance.put("/api/users/me/languages", languagePutData);
  
      alert("프로필이 성공적으로 수정되었습니다!");
  

      const refreshed = await axiosInstance.get("/api/users/me");
      const refreshedUser = refreshed.data;
  
      setUserData(refreshedUser);
      setLanguages({
        nativeCodes: refreshedUser.nativeLanguages || [],
        learnCodes: refreshedUser.learnLanguages || [],
      });
      setKeywords({
        personality: refreshedUser.personalityKeywords || [],
        hobby: refreshedUser.hobbyKeywords || [],
        topic: refreshedUser.topicKeywords || [],
      });
  
      setIsEditMode(false);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };
  
  

  // 프로필 이미지 업로드
  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      await axiosInstance.post("/api/users/me/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const refreshed = await axiosInstance.get("/api/users/me");
      const refreshedUser = refreshed.data;
  
      if (refreshedUser.profileImageUrl) {
        refreshedUser.profileImageUrl =
          refreshedUser.profileImageUrl.replace(/([^:]\/)\/+/g, "$1") +
          `?t=${Date.now()}`;
      }
  
      setUserData({
        ...refreshedUser,
        _updateKey: Date.now(),
      });
  
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };
  

  const handlePostClick = (postId: number) => {
    navigate(`/study/${postId}`);
  };

  const handleCommentEdit = async (
    commentId: number,
    postId: number,
    content: string
  ) => {
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await updateComment(postId, commentId, { content });
      // 상태도 같이 업데이트 (리렌더용)
      setMyComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content } : c
        )
      );
      alert("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCommentDelete = async (commentId: number, postId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(postId, commentId);
      setMyComments((prev) => prev.filter((c) => c.id !== commentId));
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <PageTitle className="H1">My Page</PageTitle>

        {!isLoading && userData && (
        (() => {
          const cleanedProfileUrl = userData.profileImageUrl
            ? userData.profileImageUrl.replace(/([^:]\/)\/+/g, "$1")
            : null;
        
          return (
            <ProfileCard
              key={`${cleanedProfileUrl}-${userData._updateKey || ""}`}
              userId={userData.id}
              username={userData.username}
              nickname={userData.nickname}
              mbti={userData.mbti}
              country={userData.country}
              profileImage={cleanedProfileUrl}
              infoTitle={userData.infoTitle}
              infoContent={userData.infoContent}
              keywords={{
                personalityKeywords: keywords.personality,
                hobbyKeywords: keywords.hobby,
                topicKeywords: keywords.topic,
              }}
              campus={userData.campus}
              nativeLanguages={languages.nativeCodes.map(
                (code) => LANGUAGE_MAP[code] || code
              )}
              learnLanguages={languages.learnCodes.map(
                (code) => LANGUAGE_MAP[code] || code
              )}
              email={userData.email}
              isOwner={true}
              isEditMode={isEditMode}
              onEdit={() => setIsEditMode(true)}
              onSave={handleProfileSave}
              onCancel={() => setIsEditMode(false)}
              onImageUpload={handleProfileImageUpload}
            />
          );
        })()
      )}


        <ActivityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          posts={myPosts}
          comments={myComments}
          onPostClick={handlePostClick}             
          onCommentEdit={handleCommentEdit}          
          onCommentDelete={handleCommentDelete}
        />
      </ContentWrapper>
    </Container>
  );
};

export default Mypage;
