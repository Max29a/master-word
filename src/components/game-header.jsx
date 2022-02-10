import styled from 'styled-components'
import React from 'react';

const GameHeader = () => {
  return (
    <HeaderDiv>Master Word</HeaderDiv>
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

export default GameHeader;
