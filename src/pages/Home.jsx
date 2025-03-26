import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import FlashCard from "../components/FlashCard";
import { db } from "../firebase"; // Firebase 연결
import { collection, getDocs } from "firebase/firestore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: flex-start; /* 상단 정렬 */
  width: 100%; /* 화면 너비 100% */
  height: 100vh;
  padding: 0 20px; /* 좌우 여백 추가 */
  box-sizing: border-box; /* padding이 width에 영향을 미치지 않게 함 */
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
`;

const Home = () => {
  const [studyMode, setStudyMode] = useState(false); // 학습 모드 상태
  const [words, setWords] = useState([]); // 단어 리스트 상태

  // Firebase에서 단어 목록 가져오기
  useEffect(() => {
    const fetchWords = async () => {
      const querySnapshot = await getDocs(collection(db, "words"));
      const wordsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWords(wordsArray);
    };

    fetchWords();
  }, []);

  const toggleStudyMode = () => {
    setStudyMode(!studyMode);
  };

  return (
    <Container>
      <Title>🇩🇪 Wortbuch</Title>
      <Link to="/word-list">
        <Button>단어 목록</Button>
      </Link>
      <Link to="/word-quiz">
        <Button>단어 퀴즈</Button>
      </Link>

      {/* 플래시카드 학습 모드 버튼 */}
      <Button onClick={toggleStudyMode}>
        {studyMode ? "단어 목록으로 돌아가기" : "단어 학습"}
      </Button>

      {/* 플래시카드 모드 활성화 시 카드 렌더링 */}
      {studyMode && (
        <div>
          {words.map((word) => (
            <FlashCard key={word.id} word={word.word} meaning={word.meaning} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default Home;
