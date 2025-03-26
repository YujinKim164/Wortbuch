import React, { useState } from "react";
import { motion } from "framer-motion"; // 애니메이션을 위한 framer-motion 임포트
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Card = styled(motion.div)`
  width: 300px;
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transform-style: preserve-3d; /* 3D 효과를 유지 */
`;

const Front = styled.div`
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #333;
  z-index: 2; /* Front는 앞에 오도록 설정 */
`;

const Back = styled.div`
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
  transform: rotateY(180deg); /* Back만 180도 회전 */
`;

const FlashCard = ({ word, meaning }) => {
  const [flipped, setFlipped] = useState(false); // 카드가 뒤집혔는지 상태 관리

  const handleCardClick = () => {
    setFlipped(!flipped); // 카드 클릭 시 상태 변경
  };

  return (
    <CardContainer>
      <Card
        onClick={handleCardClick}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Front>{word}</Front> {/* Front는 회전하지 않음 */}
        <Back>{meaning}</Back> {/* Back은 회전하여 보여짐 */}
      </Card>
    </CardContainer>
  );
};

export default FlashCard;
