import React from 'react';
import { Button } from './ui/button';

interface DiceRollerProps {
  movementDie: number;
  onRoll: () => void;
  disabled: boolean;
  lastRoll: number;
  gamePhase: 'setup' | 'playing' | 'battle' | 'finished';
  battleDice: number[];
}

const DiceRoller: React.FC<DiceRollerProps> = ({ 
  movementDie, 
  onRoll, 
  disabled, 
  lastRoll, 
  gamePhase, 
  battleDice 
}) => {
  const isBattleMode = gamePhase === 'battle';
  const isDoubles = battleDice[0] === battleDice[1];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
      <div className="text-center mb-8">
        <h3 className={`text-3xl font-bold mb-3 ${isBattleMode ? 'text-red-700' : 'text-gray-900'}`}>
          {isBattleMode ? '⚔️ Battle Dice' : '🎲 Movement Die'}
        </h3>
        <p className={`text-lg ${isBattleMode ? 'text-red-600' : 'text-gray-600'}`}>
          {isBattleMode ? 'Roll TWO dice - get doubles to attack!' : 'Roll ONE die to move forward'}
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-8">
        {/* Dice Display */}
        {isBattleMode ? (
          /* Battle Mode - Two Dice */
          <div className="flex space-x-6">
            {battleDice.map((die, index) => (
              <div key={index} className="relative">
                <div className={`
                  w-32 h-32 bg-white border-4 border-red-800 rounded-3xl 
                  flex items-center justify-center text-6xl font-black shadow-2xl
                  transition-all duration-500 hover:shadow-3xl transform hover:scale-105
                  ${lastRoll > 0 ? 'animate-bounce bg-gradient-to-br from-red-50 to-orange-50' : ''}
                `}>
                  {die}
                </div>
                
                {/* Decorative dots around battle dice */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-orange-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
            ))}
          </div>
        ) : (
          /* Movement Mode - Single Die */
          <div className="relative">
            <div className={`
              w-32 h-32 bg-white border-4 border-gray-800 rounded-3xl 
              flex items-center justify-center text-6xl font-black shadow-2xl
              transition-all duration-500 hover:shadow-3xl transform hover:scale-105
              ${lastRoll > 0 ? 'animate-bounce bg-gradient-to-br from-blue-50 to-purple-50 border-blue-500' : ''}
            `}>
              {movementDie}
            </div>
            
            {/* Decorative dots around movement die */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-green-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        )}
        
        {/* Battle Doubles Indicator */}
        {isBattleMode && lastRoll > 0 && (
          <div className={`
            p-6 rounded-2xl w-full text-center border-2 shadow-lg
            ${isDoubles 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
            }
          `}>
            <p className={`text-2xl font-bold mb-2 ${isDoubles ? 'text-green-700' : 'text-red-700'}`}>
              {isDoubles ? '🎯 ATTACK HITS!' : '💨 ATTACK MISSES!'}
            </p>
            <p className={`text-lg ${isDoubles ? 'text-green-600' : 'text-red-600'}`}>
              {isDoubles 
                ? `Doubles rolled! Enemy loses 1 hit point!` 
                : `No doubles. No damage dealt.`
              }
            </p>
          </div>
        )}
        
        {/* Roll Button */}
        <Button
          onClick={onRoll}
          disabled={disabled}
          className={`
            w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300
            ${disabled 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : isBattleMode
                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transform hover:scale-105 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 text-white'
            }
          `}
        >
          {disabled 
            ? '⏳ Processing...' 
            : isBattleMode 
              ? '⚔️ Roll Battle Dice' 
              : '🎲 Roll Movement Die'
          }
        </Button>
        
        {/* Movement Roll Display */}
        {!isBattleMode && lastRoll > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 w-full text-center border-2 border-blue-200 shadow-lg">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              You rolled: <span className="text-4xl font-black text-blue-600">{lastRoll}</span>
            </p>
            <p className="text-lg text-gray-600">Moving {lastRoll} space{lastRoll !== 1 ? 's' : ''} forward...</p>
          </div>
        )}
      </div>
      
      {/* Info Box */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{isBattleMode ? '⚔️' : 'ℹ️'}</span>
          <h4 className="font-bold text-gray-800 text-xl">
            {isBattleMode ? 'Battle Rules' : 'Movement Rules'}
          </h4>
        </div>
        <ul className="text-base text-gray-700 space-y-2">
          {isBattleMode ? (
            <>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Roll TWO dice each turn</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Get doubles (same numbers) to deal damage</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Each player has 3 hit points</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                <span>Last player standing wins the battle!</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Roll 1-6 to move forward</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Trapped in segments until reaching endpoints</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Battles at endpoints use TWO dice each</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Only doubles (same numbers) deal damage</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DiceRoller;