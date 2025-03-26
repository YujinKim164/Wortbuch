import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import WordList from "./components/WordList";
import WordQuiz from "./components/WordQuiz";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`;

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/word-list" element={<WordList />} />
          <Route path="/word-quiz" element={<WordQuiz />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
