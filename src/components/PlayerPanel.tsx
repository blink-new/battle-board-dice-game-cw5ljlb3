import React from 'react';
import { Player } from '../types/game';

interface PlayerPanelProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ players, currentPlayerIndex }) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
      <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">👥 Players</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`
              p-6 rounded-2xl border-3 transition-all duration-300 shadow-lg hover:shadow-xl
              ${index === currentPlayerIndex 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 ring-4 ring-blue-200 ring-opacity-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`
                w-12 h-12 rounded-full ${player.color} 
                flex items-center justify-center text-white font-bold text-xl
                shadow-lg border-3 border-white
                ${index === currentPlayerIndex ? 'animate-pulse' : ''}
              `}>
                {player.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-xl">{player.name}</p>
                <p className="text-gray-600 text-lg">Position: <span className="font-semibold text-blue-600">{player.position}</span></p>
              </div>
              {index === currentPlayerIndex && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Current Turn
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-gray-700">❤️ Health:</span>
                <div className="flex space-x-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className={`
                        w-6 h-6 rounded-full border-2 transition-all duration-300
                        ${i < player.hitPoints 
                          ? 'bg-red-500 border-red-600 shadow-lg' 
                          : 'bg-gray-200 border-gray-300'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">HP</div>
                <div className="text-2xl font-bold text-gray-800">{player.hitPoints}/3</div>
              </div>
            </div>
            
            {!player.isActive && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-center">
                <span className="text-red-700 font-semibold">💀 Eliminated</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerPanel;