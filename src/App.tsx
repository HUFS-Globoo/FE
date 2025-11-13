import { Routes, Route, useLocation } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";

// 페이지 import
import Main from "./pages/Main";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Message from "./pages/Message";
import RandomMatch from "./pages/RandomMatch";

// 회원가입 단계
import SignUp1 from "./pages/signup/SignUp1";
import SignUp3 from "./pages/signup/SignUp3";
import SignUp4 from "./pages/signup/SignUp4";

// 스터디 관련
import StudyList from "./pages/study/StudyList";
import StudyDetail from "./pages/study/StudyDetail";
import StudyPost from "./pages/study/StudyPost";

// 프로필 관련
import ProfileList from "./pages/profile/ProfileList";
import ProfileDetail from "./pages/profile/ProfileDetail";
import ProfileLanding from "./pages/profile/ProfileLanding";

// 컴포넌트
import Header from "./components/Header";

// Context
import { SignupProvider } from "./contexts/SignupContext";

function App() {
  const location = useLocation();

  return (
    <>
      <GlobalStyle />

      <SignupProvider> 
        {location.pathname !== "/login" && location.pathname !== "/" && <Header />}

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/message" element={<Message />} />
          <Route path="/random-match" element={<RandomMatch />} />

          <Route path="/signup/step1" element={<SignUp1 />} />
          <Route path="/signup/step3" element={<SignUp3 />} />
          <Route path="/signup/step4" element={<SignUp4 />} />

          <Route path="/study" element={<StudyList />} />
          <Route path="/study/:id" element={<StudyDetail />} />
          <Route path="/study/post" element={<StudyPost />} />
          <Route path="/study/post/:id" element={<StudyPost />} />

          <Route path="/profile/landing" element={<ProfileLanding />} />
          <Route path="/profile" element={<ProfileList />} />
          <Route path="/profile/:userId" element={<ProfileDetail />} />
        </Routes>
      </SignupProvider>
    </>
  );
}

export default App;
