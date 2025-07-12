import React from 'react';
import { Player } from '../types/game';
import { Button } from './ui/button';

interface GameBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  onResetGame: () => void;
  sidePanel?: React.ReactNode;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayerIndex, onResetGame, sidePanel }) => {
  // Create 2x14 grid layout as specified: 
  // Row 1: 1-2-3-4  20-19-18-17 9-10-11-12 (+ 2 empty spaces)
  // Row 2: 24-23-22-21 5-6-7-8  16-15-14-13 (+ 2 empty spaces)
  const createBoard = () => {
    const topRow = [
      1, 2, 3, 4,           // Segment 1
      20, 19, 18, 17,       // Segment 5 (reversed)
      9, 10, 11, 12,        // Segment 3
      null, null            // Empty spaces
    ];
    
    const bottomRow = [
      24, 23, 22, 21,       // Segment 7 (reversed)
      5, 6, 7, 8,           // Segment 2
      16, 15, 14, 13,       // Segment 4 (reversed)
      null, null            // Empty spaces
    ];
    
    return [topRow, bottomRow];
  };

  const grid = createBoard();

  const getPlayersAtPosition = (position: number) => {
    return players.filter(player => player.position === position && player.isActive);
  };

  const renderSquare = (position: number | null, rowIndex: number, colIndex: number) => {
    if (position === null) {
      return <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />;
    }

    // Endpoint positions are battle zones
    const segmentEndpoints = [4, 8, 12, 16, 20, 24, 28];
    const isEndpoint = segmentEndpoints.includes(position);
    
    const playersHere = getPlayersAtPosition(position);
    const hasBattlePotential = playersHere.length > 1 && isEndpoint;
    
    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`
          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 rounded-lg flex items-center justify-center text-xs sm:text-sm md:text-base font-bold
          transition-all duration-200 hover:scale-105 cursor-pointer relative
          ${isEndpoint 
            ? hasBattlePotential
              ? 'bg-red-600 border-red-700 text-white shadow-2xl animate-pulse ring-4 ring-red-300' 
              : 'bg-red-500 border-red-600 text-white shadow-lg' 
            : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
          }
          ${hasBattlePotential ? 'transform scale-110' : ''}
        `}
      >
        {/* Position Number */}
        <span className={`${playersHere.length > 0 ? 'text-xs opacity-75' : ''}`}>
          {position}
        </span>
        
        {/* Battle Zone Indicator */}
        {isEndpoint && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            ⚔️
          </div>
        )}
        
        {/* Battle Alert */}
        {hasBattlePotential && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
            BATTLE!
          </div>
        )}
        
        {/* Player Pieces */}
        {playersHere.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {playersHere.length === 1 ? (
              // Single player - show as large circle
              <div className={`
                w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full ${playersHere[0].color}
                border-2 border-white shadow-lg flex items-center justify-center
                text-white text-xs sm:text-sm font-bold animate-pulse
              `}>
                {playersHere[0].name[0]}
              </div>
            ) : (
              // Multiple players - show as smaller stacked circles
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                {playersHere.slice(0, 4).map((player, index) => (
                  <div
                    key={player.id}
                    className={`
                      absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full ${player.color}
                      border border-white shadow-md flex items-center justify-center
                      text-white text-xs font-bold animate-pulse
                    `}
                    style={{
                      top: index < 2 ? '0px' : '50%',
                      left: index % 2 === 0 ? '0px' : '50%',
                      zIndex: 10 + index,
                    }}
                  >
                    {player.name[0]}
                  </div>
                ))}
                {playersHere.length > 4 && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-600 rounded-full text-white text-xs flex items-center justify-center">
                    +{playersHere.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Battle Board</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">Strategic Dice Game</p>
        </div>

        {/* Main Game Area with Side Panel */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Game Board */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border-2 border-gray-200">
              {/* Board with Controls Layout */}
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Game Grid and Movement Flow */}
                <div className="flex-1">
                  {/* Board Grid - 2x14 Layout */}
                  <div className="flex flex-col items-center gap-1 sm:gap-2 mb-4 sm:mb-6">
                    {grid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1 sm:gap-2">
                        {row.map((position, colIndex) => renderSquare(position, rowIndex, colIndex))}
                      </div>
                    ))}
                  </div>
                  
                  {/* Movement Flow Legend */}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">⚔️ Battle Zone Flow</h3>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div>1-2-3-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">4⚔️</span> → <span className="font-bold text-blue-600">DOWN</span> → 5-6-7-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">8⚔️</span></div>
                      <div>5-6-7-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">8⚔️</span> → <span className="font-bold text-green-600">UP</span> → 9-10-11-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">12⚔️</span></div>
                      <div>9-10-11-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">12⚔️</span> → <span className="font-bold text-blue-600">DOWN</span> → 13-14-15-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">16⚔️</span></div>
                      <div>13-14-15-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">16⚔️</span> → <span className="font-bold text-green-600">UP</span> → 17-18-19-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">20⚔️</span></div>
                      <div>17-18-19-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">20⚔️</span> → <span className="font-bold text-purple-600">DIAGONAL DOWN-LEFT</span> → 21-22-23-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">24⚔️</span></div>
                      <div>21-22-23-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">24⚔️</span> → <span className="font-bold text-orange-600">DIAGONAL UP-LEFT</span> → 25-26-27-<span className="font-bold text-red-600 bg-red-100 px-1 rounded">28🏆</span></div>
                    </div>
                    <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 font-semibold">⚔️ = BATTLE ZONE! Players must battle to leave these endpoints!</p>
                    </div>
                  </div>
                </div>

                {/* Game Controls Bar - Right Side */}
                <div className="flex flex-col justify-center lg:w-64">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-6 text-center">🎮 Game Controls</h4>
                    
                    {/* Current Player Turn Section */}
                    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Current Turn</div>
                        <div className="flex items-center justify-center space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full ${currentPlayer?.color}
                            flex items-center justify-center text-white text-sm font-bold
                            shadow-lg animate-pulse
                          `}>
                            {currentPlayer?.name?.[0]}
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {currentPlayer?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Reset Game Button */}
                    <Button 
                      onClick={onResetGame} 
                      variant="outline" 
                      className="w-full h-12 text-base font-semibold rounded-xl border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    >
                      🔄 Reset Game
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          {sidePanel && (
            <div className="w-full lg:w-80 xl:w-96">
              {sidePanel}
            </div>
          )}
        </div>

        {/* Game Instructions - Full Width Below */}
        <div className="mt-6 lg:mt-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Game Rules</h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Movement</h3>
              <ul className="space-y-1">
                <li>• Roll 1 die to move forward</li>
                <li>• Follow directional flow between segments</li>
                <li>• Must land exactly on segment endpoints</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Battle System</h3>
              <ul className="space-y-1">
                <li>• Battle when players meet at endpoints</li>
                <li>• Roll doubles to attack (1 damage)</li>
                <li>• 3 hit points each, last standing wins</li>
              </ul>
            </div>
          </div>
          
          {/* Player Legend */}
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">👥 Players on Board</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {players.filter(p => p.isActive).map((player) => (
                <div key={player.id} className="flex items-center space-x-2">
                  <div className={`
                    w-6 h-6 rounded-full ${player.color} border-2 border-white shadow-lg
                    flex items-center justify-center text-white text-xs font-bold
                  `}>
                    {player.name[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {player.name} (Pos: {player.position})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;