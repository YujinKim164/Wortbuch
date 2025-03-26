import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { FaStar, FaRegStar, FaVolumeUp } from "react-icons/fa";

const SearchInput = styled.input`
  padding: 10px;
  margin: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 80%;
  box-sizing: border-box;
`;

const WordListContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 5px;
  background-color: #4689e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1758b4;
  }
`;

const WordItem = styled.li`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f1f1f1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
`;

const WordDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
`;

const Word = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Meaning = styled.span`
  font-size: 1rem;
  color: #666;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const IconButton = styled.button`
  padding: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

function WordList() {
  const [words, setWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      const q = searchQuery
        ? query(
            collection(db, "words"),
            where("word", ">=", searchQuery),
            where("word", "<=", searchQuery + "\uf8ff")
          )
        : collection(db, "words");

      const querySnapshot = await getDocs(q);
      const wordsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWords(wordsArray);
    };

    fetchWords();
  }, [searchQuery]);

  const addWord = async () => {
    if (!newWord || !newMeaning) return;
  
    // Firestore에 단어 추가
    const docRef = await addDoc(collection(db, "words"), {
      word: newWord,
      meaning: newMeaning,
      isFavorite: false,
    });
  
    // 추가된 단어를 로컬 상태에 즉시 반영 (docRef.id를 사용하여 id 추가)
    setWords((prevWords) => [
      ...prevWords,
      { id: docRef.id, word: newWord, meaning: newMeaning, isFavorite: false },
    ]);
  
    setNewWord("");
    setNewMeaning("");
  };
  

  const updateWord = async (id, newMeaning) => {
    if (!newMeaning) return;
  
    const wordRef = doc(db, "words", id);
    await updateDoc(wordRef, { meaning: newMeaning });
  
    setWords((prevWords) =>
      prevWords.map((word) =>
        word.id === id ? { ...word, meaning: newMeaning } : word
      )
    );
  };

  const deleteWord = async (id) => {
    const wordRef = doc(db, "words", id);
    await deleteDoc(wordRef);
  
    setWords((prevWords) => prevWords.filter((word) => word.id !== id));
  };

  const toggleFavorite = async (id, isFavorite) => {
    const wordRef = doc(db, "words", id);
    await updateDoc(wordRef, { isFavorite: !isFavorite });

    const updatedWords = words.map((word) =>
      word.id === id ? { ...word, isFavorite: !isFavorite } : word
    );
    setWords(updatedWords);
  };

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "de-DE"; 
    speechSynthesis.speak(utterance);
  };

  return (
    <WordListContainer>
      <SearchInput
        type="text"
        placeholder="단어 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div>
        <input
          type="text"
          placeholder="단어를 입력하세요"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
        <input
          type="text"
          placeholder="의미를 입력하세요"
          value={newMeaning}
          onChange={(e) => setNewMeaning(e.target.value)}
        />
        <Button onClick={addWord}>단어 추가</Button>
      </div>

      {words.map((word) => (
        <WordItem key={word.id}>
        <WordDetails>
            <Word>{word.word}</Word>
            <Meaning>{word.meaning}</Meaning>
          </WordDetails>   
          <Actions>
            <Button onClick={() => updateWord(word.id, prompt("새 의미를 입력하세요", word.meaning))}>
              수정
            </Button>
            <Button onClick={() => deleteWord(word.id)}>삭제</Button>
            <IconButton onClick={() => toggleFavorite(word.id, word.isFavorite)}>
              {word.isFavorite ? <FaStar size={24} color="yellow" /> : <FaRegStar size={24} color="yellow" />}
            </IconButton>
            <IconButton onClick={() => speakWord(word.word)}>
              <FaVolumeUp size={24} color="black" />
            </IconButton>
          </Actions>
        </WordItem>
      ))}
    </WordListContainer>
  );
}

export default WordList;