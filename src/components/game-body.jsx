import styled, { css } from 'styled-components';
import React from 'react';
import { useState, useRef } from 'react';
import { fourLetterWords, fourLetterValidGuesses} from '../solutions';
import useKeypress from 'react-use-keypress';
import Switch from "react-switch";

const NUM_LETTERS = 4;
const DEFINITELY_IN = "#22a318";
const DEFINITELY_OUT = "#e32b2b";
const GUESSING_IN = "#e0ffde";
const GUESSING_OUT = "#ffdede";

const GameBody = () => {
  const startingKeyState = {
    a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0,
    o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0
  };
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [solution, setSolution] = useState(fourLetterWords[0]);
  const [previousRows, setPreviousRows] = useState([]);
  const [previousRowResults, setPreviousRowResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [win, setWin] = useState(false);
  const [status, setStatus] = useState('Playing game #1');
  const [hasError, setHasError] = useState(false);
  const [keysToggle, setKeysToggle] = useState(startingKeyState);
  const [markSure, setMarkSure] = useState(false);
  const guessesEndRef = useRef(null);

  const scrollToBottom = () => {
    guessesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      if (currentGuess.length === NUM_LETTERS) {
        const curGuess = currentGuess.join('');
        if (!fourLetterWords.includes(curGuess) && !fourLetterValidGuesses.includes(curGuess.toUpperCase())) {
          setStatus('Not a valid word to guess');
          setHasError(true);
          return;
        }

        if (curGuess === solution) {
          setPreviousRowResults([...previousRowResults, [NUM_LETTERS,0]]);
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
      if (currentGuess.length < NUM_LETTERS) {
        setCurrentGuess([...currentGuess, event.key]);
      }
    }
    scrollToBottom();
  };

  useKeypress(
    ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','Enter', 'Backspace'],
    handleKey
  );

  const goNext = () => {
    const newIndex = currentSolutionIndex + 1;
    setCurrentSolutionIndex(newIndex);
    setSolution(fourLetterWords[newIndex]);
    setPreviousRows([]);
    setPreviousRowResults([]);
    setCurrentGuess([]);
    setStatus(`Playing game #${newIndex+1}`);
    setKeysToggle(startingKeyState);
    setWin(false);
  };

  const goBack = () => {
    const newIndex = currentSolutionIndex - 1;
    setCurrentSolutionIndex(newIndex);
    setSolution(fourLetterWords[newIndex]);
    setPreviousRows([]);
    setPreviousRowResults([]);
    setCurrentGuess([]);
    setStatus(`Playing game #${newIndex+1}`);
    setKeysToggle(startingKeyState);
    setWin(false);
  };

  const getPointer = () => {
    if (hasError) {
      return <Red>{'->'}</Red>
    } else {
      return '->';
    }
  };

  const getStatus = () => {
    if (hasError) {
      return <Red>{status}</Red>
    } else {
      return status;
    }
  };

  const toggleKey = (key) => {
    let newValue = 0;
    if (markSure) {
      switch (keysToggle[key]) {
        case 0:
          newValue = 3;
          break;
        case 3:
          newValue = 4;
          break;
        case 4:
          newValue = 0;
          break;
      }
    }
    else {
      switch (keysToggle[key]) {
        case 0:
          newValue = 1;
          break;
        case 1:
          newValue = 2;
          break;
        case 2:
          newValue = 0;
          break;
      }
    }
    setKeysToggle(prevState => ({...prevState, [key]: newValue}));
  };

  const getKeyboard = () => {
    return Object.keys(keysToggle).map((key, index) => {
      let color = "#ffffff";
      switch (keysToggle[key]) {
        case 1:
          color = GUESSING_OUT;
          break;
        case 2:
          color = GUESSING_IN;
          break;
        case 3:
          color = DEFINITELY_OUT;
          break;
        case 4:
          color = DEFINITELY_IN;
          break;
      }
      return (
        index === 5 || index === 11 || index === 17 || index === 23
          ? <span key={index}><KeyToggle key={index} color={color} onClick={() => toggleKey(key)}>{key}</KeyToggle><br /></span>
          : <KeyToggle key={index} color={color} onClick={() => toggleKey(key)}>{key}</KeyToggle>
      );
    });
  };

  const clearMarkedGuesses = () => {
    Object.keys(keysToggle).forEach(key => {
      if (keysToggle[key] === 1 || keysToggle[key] === 2) {
        keysToggle[key] = 0;
      }
    });
    setKeysToggle({...keysToggle});
  };

  return (
    <Board>
      <p>
        Instructions: type your letters, press enter to guess.
        First number is correct letters in the correct place, second number is correct letters but wrong place.
        You can use the alphabet to keep track of letters you think are in/out by clicking them.
      </p>
      <StatusRow>Status: <span className='content'>{getStatus()}</span></StatusRow>
      <div className='game-control'><button onClick={goBack} disabled={currentSolutionIndex < 1}>{'<-'} back</button> Game# {currentSolutionIndex+1} <button onClick={goNext} disabled={currentSolutionIndex === fourLetterWords.length-1}>next {'->'}</button></div>
      <BoardSplitter>
        <LeftSide>
          <Row>
            <CenteredRow>
              <div style={{marginRight: 6}}>Mark Guess</div>
              <Switch onChange={() => {setMarkSure(!markSure)}}
                checked={markSure}
                uncheckedIcon={false}
                checkedIcon={false}
                offColor="#7a7a7a"
                onColor="#7a7a7a"
                />
              <div style={{marginLeft: 6}}>Mark Sure</div>
            </CenteredRow>
            {getKeyboard()}
            <button onClick={clearMarkedGuesses}>Clear Marked Guesses</button>
          </Row>
        </LeftSide>

        <RightSide>
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
              <div ref={guessesEndRef} />
            </Row>
          )}
          {win && (
            <div>
              <Win>You Win!!!</Win>
              <button onClick={goNext}>Next Game</button>
            </div>
          )}
        </RightSide>
      </BoardSplitter>
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

  .game-control {
    margin: 10px;
  }
`;

const Row = styled.div`
  .guess-letter {
    display: inline-block;
    font-size: 28px;
    text-transform: uppercase;
    box-sizing: border-box;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    width: 22px;
    margin: 6px;
  }
  .checkbox {
    margin-bottom: 20px;
  }
`;

const BoardSplitter = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 50%;
`;

const LeftSide = styled.div`
  align-self: flex-start;
`;

const toggleStyle = css`
  margin: 0px 8px;
`;

const CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const RightSide = styled.div`
  overflow-y: scroll;
  height: 70vh;
  width: 40%;
`;

const KeyToggle = styled.span`
  display: inline-block;
  font-size: 20px;
  text-transform: uppercase;
  vertical-align: middle;
  justify-content: center;
  text-align: center;
  margin: 6px;
  width: 22px;
  border: 1px solid gray;
  cursor: pointer;

  ${props =>
    css`
      background: ${props.color};
    `};
`;

const Red = styled.span`
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
  width: 75%;
  .content {
    margin-left: 20px;
    width: 75%;
  }
`;

export default GameBody;