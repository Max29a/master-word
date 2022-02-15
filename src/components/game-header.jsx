import styled from 'styled-components'
import React from 'react';

const GameHeader = () => {
  return (
    <>
      <HeaderDiv>Master Word</HeaderDiv>
      <InstructionsDiv>
        Instructions: type your letters, press enter to guess.
        First number is correct letters in the correct place, second number is correct letters but wrong place.
        You can use the alphabet to keep track of letters you think are in/out by clicking them.
      </InstructionsDiv>
    </>
  );
}

const HeaderDiv = styled.div`
  font-weight: 700;
  font-size: 36px;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  text-align: center;
  pointer-events: none;
`;

const InstructionsDiv = styled.p`
  width: 75%;
`;

export default GameHeader;
