import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅 추가
import { db } from "../firebase";  // Firebase 연결
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import styled from "styled-components";

// 스타일 설정
const QuizContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Question = styled.h2`
  margin-bottom: 20px;
`;

const AnswerInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px; 
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4689e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1758b4;
  }
`;

const Score = styled.h3`
  margin-top: 20px;
`;

const StatisticsContainer = styled.div`
  margin-top: 30px;
`;

function WordQuiz() {
  const navigate = useNavigate(); // 네비게이션 훅 사용
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [answeredWords, setAnsweredWords] = useState([]); // 이미 맞춘 단어 목록 추가
  const [wordStats, setWordStats] = useState({}); // 각 단어의 맞힌 횟수와 틀린 횟수를 저장

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

  // 단어 퀴즈 통계 업데이트
  const updateWordStats = async (wordId, isCorrect) => {
    const wordStat = wordStats[wordId] || { correct: 0, incorrect: 0 };

    if (isCorrect) {
      wordStat.correct += 1;
    } else {
      wordStat.incorrect += 1;
    }

    setWordStats({ ...wordStats, [wordId]: wordStat });

    const wordDoc = doc(db, "words", wordId);
    await updateDoc(wordDoc, {
      correct: wordStat.correct,
      incorrect: wordStat.incorrect,
    });
  };

  // 퀴즈 시작
  const startQuiz = () => {
    setScore(0);
    setAnsweredWords([]);
    setIncorrectWords([]);
    setWordStats({});
    setQuizStarted(true);
    nextQuestion();
  };

  // 랜덤 단어 선택
  const nextQuestion = () => {
    let availableWords = words.filter(
      (word) => !answeredWords.includes(word.id) && !incorrectWords.includes(word.id)
    );

    if (availableWords.length === 0) {
      if (incorrectWords.length > 0) {
        availableWords = words.filter((word) => incorrectWords.includes(word.id));
        setIncorrectWords([]);
      } else {
        alert("퀴즈가 종료되었습니다! 총 점수: " + score);
        setQuizStarted(false);
        return;
      }
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    setCurrentWord(availableWords[randomIndex]);
    setUserAnswer("");
  };

  // 사용자가 답을 제출한 경우
  const checkAnswer = () => {
    if (!currentWord) return;

    const isCorrect =
      userAnswer.trim().toLowerCase() === currentWord.meaning.trim().toLowerCase();

    updateWordStats(currentWord.id, isCorrect);

    if (isCorrect) {
      setScore(score + 1);
      alert("정답입니다!");
      setAnsweredWords([...answeredWords, currentWord.id]);
    } else {
      setIncorrectWords([...incorrectWords, currentWord.id]);
      alert(`틀렸습니다. 정답은: ${currentWord.meaning}`);
    }

    nextQuestion();
  };

  return (
    <QuizContainer>
      {!quizStarted ? (
        <ButtonContainer>
          <Button onClick={startQuiz}>퀴즈 시작하기</Button>
          <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button> {/* 홈으로 이동 버튼 */}
        </ButtonContainer>
      ) : (
        <div>
          {currentWord && (
            <>
              <Question>이 단어의 뜻은? "{currentWord.word}"</Question>
              <AnswerInput
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="뜻을 입력하세요"
              />
              <Button onClick={checkAnswer}>제출</Button>
              <Score>현재 점수: {score}</Score>
            </>
          )}
        </div>
      )}
    </QuizContainer>
  );
}

export default WordQuiz;