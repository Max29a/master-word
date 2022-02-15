import styled from 'styled-components'
import GameHeader from './components/game-header';
import GameBody from './components/game-body';

function App() {
  return (
    <GameWrapper>
      <GameHeader />
      <GameBody />
    </GameWrapper>
  );
}

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default App;
