import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import PlayerPanel from './components/PlayerPanel';
import DiceRoller from './components/DiceRoller';
import BattleModal from './components/BattleModal';
import { Button } from './components/ui/button';

function App() {
  const {
    gameState,
    startGame,
    rollDice,
    handleBattleComplete,
    closeBattle,
    resetGame,
  } = useGameLogic();

  if (gameState.gamePhase === 'setup') {
    return <GameSetup onStartGame={startGame} />;
  }

  if (gameState.gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border border-gray-200">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">🎉 Victory!</h1>
          <div className="mb-10">
            <div className={`
              w-24 h-24 rounded-full ${gameState.winner?.color} mx-auto mb-6 
              flex items-center justify-center text-white text-3xl font-bold
              shadow-2xl border-4 border-white animate-bounce
            `}>
              {gameState.winner?.name[0]}
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {gameState.winner?.name} Wins!
            </p>
            <p className="text-xl text-gray-600">
              Congratulations on conquering the Battle Board!
            </p>
          </div>
          <Button 
            onClick={resetGame} 
            className="w-full h-16 text-2xl font-bold rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            🚀 Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Game Board with Side Panel */}
      <GameBoard 
        players={gameState.players}
        currentPlayerIndex={gameState.currentPlayerIndex}
        onResetGame={resetGame}
        sidePanel={
          <div className="space-y-6">
            {/* Dice Roller */}
            <DiceRoller
              movementDie={gameState.movementDie}
              onRoll={rollDice}
              disabled={gameState.gamePhase !== 'playing' || gameState.lastRoll > 0}
              lastRoll={gameState.lastRoll}
              gamePhase={gameState.gamePhase}
              battleDice={gameState.battleDice}
            />
          </div>
        }
      />
      
      {/* Player Panel - Below Board */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <PlayerPanel 
          players={gameState.players} 
          currentPlayerIndex={gameState.currentPlayerIndex}
        />
      </div>
      
      <BattleModal
        isOpen={gameState.gamePhase === 'battle'}
        participants={gameState.battleParticipants}
        onBattleComplete={handleBattleComplete}
        onClose={closeBattle}
      />
    </div>
  );
}

export default App;