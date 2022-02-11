import styled from 'styled-components';
import React from 'react';
import { useState } from 'react';
import { solutions, validGuesses } from '../solutions';
import useKeypress from 'react-use-keypress';

const GameBody = () => {
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [solution, setSolution] = useState(solutions[0]);
  const [previousRows, setPreviousRows] = useState([]);
  const [previousRowResults, setPreviousRowResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [win, setWin] = useState(false);
  const [status, setStatus] = useState('Playing game #1');
  const [hasError, setHasError] = useState(false);

  const handleKey = (event) => {
    if (event.key === "Enter") {
      if (currentGuess.length === 5) {
        const curGuess = currentGuess.join('');
        if (!solutions.includes(curGuess) && !validGuesses.includes(curGuess)) {
          setStatus('Not a valid word to guess');
          setHasError(true);
          return;
        }

        if (curGuess === solution) {
          setPreviousRowResults([...previousRowResults, [5,0]]);
          setStatus(`You won game ${currentSolutionIndex+1}`);
          setWin(true);
        } else {
          let countRightLetter = 0;
          let countRightPosition = 0;
          let correctLetters = {};
          let guessCopy = [...currentGuess];
          for (let i = 0; i < solution.length; i++) {
            const letter = solution.charAt(i);           
            if (correctLetters.hasOwnProperty(letter)) {
              correctLetters[letter] = correctLetters[letter] + 1;
            } else {
              correctLetters[letter] = 1;
            }
          }
          for (let i = currentGuess.length-1; i >= 0; i--) {
            const solutionLetter = solution.charAt(i);
            const curLetter = currentGuess[i];
            if (solutionLetter === curLetter) {
              countRightPosition++;
              guessCopy.splice(i, 1);
              if (correctLetters.hasOwnProperty(curLetter)) {
                correctLetters[curLetter] = correctLetters[curLetter] - 1;
                if (correctLetters[curLetter] == 0) {
                  delete correctLetters[curLetter];
                }
              }
            }
          }
          for (let i = 0; i < guessCopy.length; i++) {
            const curLetter = guessCopy[i];
            if (correctLetters.hasOwnProperty(curLetter)) {
              countRightLetter++;
              correctLetters[curLetter] = correctLetters[curLetter] - 1;
              if (correctLetters[curLetter] == 0) {
                delete correctLetters[curLetter];
              }
            }
          }
          
          setPreviousRowResults([...previousRowResults, [countRightPosition, countRightLetter]]);
        }
        setPreviousRows([...previousRows, currentGuess]);
        setCurrentGuess([]);
      }
    } else if (event.key === "Backspace") {
      if (currentGuess.length > 0) {
        setHasError(false);
        setStatus('');
        const newCur = currentGuess.slice(0,-1);
        setCurrentGuess(newCur);
      }
    } else {
      if (currentGuess.length < 5) {
        setCurrentGuess([...currentGuess, event.key]);
      }
    }
  };

  useKeypress(
    ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','Enter', 'Backspace'],
    handleKey
  );

  const goNext = () => {
    const newIndex = currentSolutionIndex + 1;
    setCurrentSolutionIndex(newIndex);
    setSolution(solutions[newIndex]);
    setPreviousRows([]);
    setPreviousRowResults([]);
    setCurrentGuess([]);
    setStatus(`Playing game #${newIndex+1}`);
    setWin(false);
  }

  const goBack = () => {
    const newIndex = currentSolutionIndex - 1;
    setCurrentSolutionIndex(newIndex);
    setSolution(solutions[newIndex]);
    setPreviousRows([]);
    setPreviousRowResults([]);
    setCurrentGuess([]);
    setStatus(`Playing game #${newIndex+1}`);
    setWin(false);
  }

  const getPointer = () => {
    if (hasError) {
      return <RedArrow>{'->'}</RedArrow>
    } else {
      return '->';
    }
  }

  return (
    <Board>
      <p>Instructions: type your letters, press enter to guess. First number is correct letters in place, second number is correct letters wrong place.</p>
      <StatusRow>Status: <textarea className='content' rows={1} value={status} disabled={true}></textarea></StatusRow>
      <div><button onClick={goBack} disabled={currentSolutionIndex < 1}>{'<-'} back</button> Game# {currentSolutionIndex+1} <button onClick={goNext} disabled={currentSolutionIndex === solutions.length-1}>next {'->'}</button></div>
      {previousRows.map((row, index) => {
        return (
          <Row key={index}>{index+1}:{'   '}
            {row.map((char, index2) => {
              return <span key={index2} className="guess-letter">{char}</span>
            })}
            <span>
              {'    '}{previousRowResults[index][0]}{' '}{previousRowResults[index][1]}
            </span>
          </Row>
        )
      })}
      {!win && (
        <Row>
          {getPointer()} {currentGuess.map((guess, index) => {
            return <span key={index} className="guess-letter">{guess}</span>
          })}
        </Row>
      )}
      {win && (
        <div>
          <Win>You Win!!!</Win>
          <button onClick={goNext}>Next Game</button>
        </div>
      )}
    </Board>
  );
};

const Board = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
  height: 100vh;
`;

const Row = styled.div`
  .guess-letter {
    font-size: 28px;
    text-transform: uppercase;
    box-sizing: border-box;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    margin: 5px;
  }
`;

const RedArrow = styled.span`
  color: red;
`;

const Win = styled.div`
  color: green;
  font-weight: 700;
  font-size: 36px;
  letter-spacing: 0.2rem;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width:75%;
  .content {
    width: 75%;
  }
`;

export default GameBody;