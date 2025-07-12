import React from 'react';
import { Button } from './ui/button';

interface DiceRollerProps {
  movementDie: number;
  onRoll: () => void;
  disabled: boolean;
  lastRoll: number;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ movementDie, onRoll, disabled, lastRoll }) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-3">🎲 Movement Die</h3>
        <p className="text-gray-600 text-lg">Roll ONE die to move forward</p>
      </div>
      
      <div className="flex flex-col items-center space-y-8">
        {/* Single Die Display */}
        <div className="relative">
          <div className={`
            w-32 h-32 bg-white border-4 border-gray-800 rounded-3xl 
            flex items-center justify-center text-6xl font-black shadow-2xl
            transition-all duration-500 hover:shadow-3xl transform hover:scale-105
            ${lastRoll > 0 ? 'animate-bounce bg-gradient-to-br from-blue-50 to-purple-50 border-blue-500' : ''}
          `}>
            {movementDie}
          </div>
          
          {/* Decorative dots around the die */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-green-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Roll Button */}
        <Button
          onClick={onRoll}
          disabled={disabled}
          className={`
            w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300
            ${disabled 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 text-white'
            }
          `}
        >
          {disabled ? '⏳ Moving...' : '🎲 Roll Movement Die'}
        </Button>
        
        {/* Last Roll Display */}
        {lastRoll > 0 && (
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
          <span className="text-2xl">ℹ️</span>
          <h4 className="font-bold text-gray-800 text-xl">Movement Rules</h4>
        </div>
        <ul className="text-base text-gray-700 space-y-2">
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
        </ul>
      </div>
    </div>
  );
};

export default DiceRoller;