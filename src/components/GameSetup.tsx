import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Player, PLAYER_COLORS } from '../types/game';

interface GameSetupProps {
  onStartGame: (players: Player[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);

  const updatePlayerCount = (count: number) => {
    setPlayerCount(count);
    const newNames = Array.from({ length: count }, (_, i) => 
      playerNames[i] || `Player ${i + 1}`
    );
    setPlayerNames(newNames);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name: name.trim() || `Player ${index + 1}`,
      color: PLAYER_COLORS[index].color,
      position: 1,
      hitPoints: 3,
      isActive: true,
    }));

    onStartGame(players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full border border-gray-200">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            ⚔️ Battle Board
          </h1>
          <p className="text-xl text-gray-600">Strategic dice game for 2-4 players</p>
        </div>
        
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              👥 Number of Players
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[2, 3, 4].map((count) => (
                <Button
                  key={count}
                  variant={playerCount === count ? "default" : "outline"}
                  onClick={() => updatePlayerCount(count)}
                  className={`
                    h-16 text-2xl font-bold rounded-2xl transition-all duration-300
                    ${playerCount === count 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105' 
                      : 'border-2 border-gray-300 hover:border-blue-400 hover:shadow-lg'
                    }
                  `}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ✏️ Player Names
            </h2>
            <div className="space-y-4">
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className={`
                    w-12 h-12 rounded-full ${PLAYER_COLORS[index].color} 
                    flex items-center justify-center text-white font-bold text-xl
                    shadow-lg border-3 border-white
                  `}>
                    {index + 1}
                  </div>
                  <Input
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1 h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            className="w-full h-16 text-2xl font-bold rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            🚀 Start Game
          </Button>
        </div>
        
        {/* Game Rules Preview */}
        <div className="mt-10 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <h3 className="font-bold text-gray-800 text-lg mb-3 text-center">🎯 Quick Rules</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Roll single die to move through segments</li>
            <li>• Battle with double dice when players meet at endpoints</li>
            <li>• Win battles to progress to the next segment</li>
            <li>• First to reach position 28 wins!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;