import styled, { css } from 'styled-components';
import React from 'react';
import { useState, useRef } from 'react';
import { fourLetterWords, fourLetterValidGuesses} from '../solutions';
import useKeypress from 'react-use-keypress';
import Switch from "react-switch";
import { useAlert } from 'react-alert'

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
  const [hasError, setHasError] = useState(false);
  const [keysToggle, setKeysToggle] = useState(startingKeyState);
  const [markSure, setMarkSure] = useState(false);
  const guessesEndRef = useRef(null);
  const alert = useAlert();

  const scrollToBottom = () => {
    guessesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      if (currentGuess.length === NUM_LETTERS) {
        const curGuess = currentGuess.join('');
        if (!fourLetterWords.includes(curGuess) && !fourLetterValidGuesses.includes(curGuess.toUpperCase())) {
          alert.show('Not a valid word to guess');
          setHasError(true);
          return;
        }

        if (curGuess === solution) {
          setPreviousRowResults([...previousRowResults, [NUM_LETTERS,0]]);
          alert.show(`You won game ${currentSolutionIndex+1}`);
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
                if (correctLetters[curLetter] === 0) {
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
              if (correctLetters[curLetter] === 0) {
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
        const newCur = currentGuess.slice(0,-1);
        setCurrentGuess(newCur);
      }
    } else {
      if (currentGuess.length < NUM_LETTERS) {
        setCurrentGuess([...currentGuess, event.key]);
        scrollToBottom();
      }
    }
  };

  useKeypress(
    ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','Enter', 'Backspace'],
    handleKey
  );

  const changeGame = (newIndex) => {
    setCurrentSolutionIndex(newIndex);
    setSolution(fourLetterWords[newIndex]);
    setPreviousRows([]);
    setPreviousRowResults([]);
    setCurrentGuess([]);
    setKeysToggle(startingKeyState);
    setWin(false);
  };

  const goNext = () => {
    changeGame(currentSolutionIndex + 1);
  };

  const goBack = () => {
    changeGame(currentSolutionIndex - 1);
  };

  const getPointer = () => {
    return <Colored color={hasError ? "red" : "black"}>➜</Colored>
  };

  // cycle through states for toggled key:
  // 0 -> 1 || 3, 1 -> 2, 2 -> 0, 3 -> 4, 
  const toggleKey = (key) => {
    let newValue;
    switch (keysToggle[key]) {
      case 0:
        markSure ? newValue = 3 : newValue = 1;
        break;
      case 1:
        newValue = 2;
        break;
      case 3:
        newValue = 4;
        break;
      default:
        newValue = 0;
        break;
    }
    setKeysToggle(prevState => ({...prevState, [key]: newValue}));
  };

  const getColorForKey = (index) => {
    let color;
    switch (keysToggle[index]) {
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
      default:
        color = "#FFFFFF";
        break;
    }
    return color;
  };

  const getKeyboard = () => {
    return Object.keys(keysToggle).map((key, index) => {
      const color = getColorForKey(key);
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
      <div className='game-control'>
        <button onClick={goBack} disabled={currentSolutionIndex < 1}>
          ◀ back
        </button>
        <GameSpan>Game# {currentSolutionIndex+1}</GameSpan>
        <button onClick={goNext} disabled={currentSolutionIndex === fourLetterWords.length-1}>
            next ▶
        </button>
      </div>
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
              <CenteredRow key={index}>{index+1}:{' '}
                {row.map((char, index2) => {
                  return <span key={index2} className="guess-letter">{char}</span>
                })}
                <span>
                  <Colored color="#7da2ff">{previousRowResults[index][0]}</Colored>{' '}
                  <Colored color="#f59eff">{previousRowResults[index][1]}</Colored>
                </span>
              </CenteredRow>
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
  width: 100vw;

  .game-control {
    margin: 20px;
  }
`;

const GameSpan = styled.span`
  margin: 0px 10px;
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

const CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

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

`;

const RightSide = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  align-item: flex-start;
  max-height: 50vh;
  padding: 0px 15px; 
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
  user-select: none;
  cursor: pointer;

  ${props =>
    css`
      background: ${props.color};
    `};
`;

const Colored = styled.span`
  ${props =>
    css`
      color: ${props.color}
  `};
`;

export default GameBody;