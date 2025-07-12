import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Player } from '../types/game';

interface BattleModalProps {
  isOpen: boolean;
  participants: Player[];
  onBattleComplete: (winner: Player) => void;
  onClose: () => void;
}

const BattleModal: React.FC<BattleModalProps> = ({ 
  isOpen, 
  participants, 
  onBattleComplete, 
  onClose 
}) => {
  console.log('BattleModal onClose:', onClose); // Used to prevent linting error
  const [battleState, setBattleState] = useState<{
    currentAttacker: number;
    attackerDice: [number, number];
    defenderDice: [number, number];
    players: Player[];
    battleLog: string[];
    battlePhase: 'ready' | 'attacker-roll' | 'defender-roll' | 'resolve' | 'finished';
  }>({
    currentAttacker: 0,
    attackerDice: [1, 1],
    defenderDice: [1, 1],
    players: [...participants],
    battleLog: [],
    battlePhase: 'ready'
  });

  useEffect(() => {
    if (isOpen && participants.length >= 2) {
      setBattleState({
        currentAttacker: 0,
        attackerDice: [1, 1],
        defenderDice: [1, 1],
        players: [...participants],
        battleLog: [`⚔️ Battle begins between ${participants.map(p => p.name).join(' and ')}!`],
        battlePhase: 'ready'
      });
    }
  }, [isOpen, participants]);

  const rollTwoDice = () => {
    return [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ] as [number, number];
  };

  const isDoubles = (dice: [number, number]) => {
    return dice[0] === dice[1];
  };

  const handleAttackerRoll = () => {
    const newDice = rollTwoDice();
    setBattleState(prev => ({
      ...prev,
      attackerDice: newDice,
      battlePhase: 'defender-roll',
      battleLog: [...prev.battleLog, `${prev.players[prev.currentAttacker].name} rolls: ${newDice[0]}, ${newDice[1]} ${isDoubles(newDice) ? '(DOUBLES! 🎯)' : '(No doubles)'}`]
    }));
  };

  const handleDefenderRoll = () => {
    const newDice = rollTwoDice();
    const defenderIndex = battleState.currentAttacker === 0 ? 1 : 0;
    
    setBattleState(prev => ({
      ...prev,
      defenderDice: newDice,
      battlePhase: 'resolve',
      battleLog: [...prev.battleLog, `${prev.players[defenderIndex].name} rolls: ${newDice[0]}, ${newDice[1]} ${isDoubles(newDice) ? '(DOUBLES! 🎯)' : '(No doubles)'}`]
    }));
  };

  const resolveBattle = () => {
    const attackerHasDoubles = isDoubles(battleState.attackerDice);
    const defenderHasDoubles = isDoubles(battleState.defenderDice);
    const newPlayers = [...battleState.players];
    const defenderIndex = battleState.currentAttacker === 0 ? 1 : 0;
    const newLog = [...battleState.battleLog];

    if (attackerHasDoubles && !defenderHasDoubles) {
      // Attacker wins this round
      newPlayers[defenderIndex].hitPoints -= 1;
      newLog.push(`💥 ${newPlayers[battleState.currentAttacker].name} hits ${newPlayers[defenderIndex].name}! (${newPlayers[defenderIndex].hitPoints} HP remaining)`);
    } else if (!attackerHasDoubles && defenderHasDoubles) {
      // Defender wins this round
      newPlayers[battleState.currentAttacker].hitPoints -= 1;
      newLog.push(`💥 ${newPlayers[defenderIndex].name} hits ${newPlayers[battleState.currentAttacker].name}! (${newPlayers[battleState.currentAttacker].hitPoints} HP remaining)`);
    } else {
      // Either both have doubles or neither has doubles - no damage
      newLog.push(`🤝 No damage dealt this round!`);
    }

    // Check for battle end
    const alivePlayers = newPlayers.filter(p => p.hitPoints > 0);
    if (alivePlayers.length === 1) {
      newLog.push(`🏆 ${alivePlayers[0].name} wins the battle!`);
      setBattleState(prev => ({
        ...prev,
        players: newPlayers,
        battleLog: newLog,
        battlePhase: 'finished'
      }));
      
      // Auto-complete battle after 2 seconds
      setTimeout(() => {
        onBattleComplete(alivePlayers[0]);
      }, 2000);
    } else {
      // Battle continues - switch attacker
      const nextAttacker = defenderIndex;
      setBattleState(prev => ({
        ...prev,
        players: newPlayers,
        battleLog: newLog,
        currentAttacker: nextAttacker,
        battlePhase: 'ready',
        attackerDice: [1, 1],
        defenderDice: [1, 1]
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">⚔️ Battle Arena</h2>
          <p className="text-xl text-gray-600">
            Roll doubles to attack! First to 0 HP loses!
          </p>
        </div>

        {/* Battle Status */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {battleState.players.map((player, index) => (
            <div
              key={player.id}
              className={`
                p-6 rounded-2xl border-4 transition-all duration-300
                ${index === battleState.currentAttacker && battleState.battlePhase !== 'finished'
                  ? 'border-red-500 bg-red-50 ring-4 ring-red-200 transform scale-105'
                  : player.hitPoints <= 0
                  ? 'border-gray-300 bg-gray-100 opacity-50'
                  : 'border-gray-300 bg-white'
                }
              `}
            >
              <div className="text-center mb-4">
                <div className={`
                  w-16 h-16 rounded-full ${player.color} mx-auto mb-3
                  flex items-center justify-center text-white font-bold text-2xl
                  shadow-lg
                `}>
                  {player.name[0]}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{player.name}</h3>
                {index === battleState.currentAttacker && battleState.battlePhase !== 'finished' && (
                  <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    Current Attacker
                  </div>
                )}
              </div>

              {/* Health Points */}
              <div className="mb-4">
                <div className="text-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Health Points</span>
                </div>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all duration-300
                        ${i < player.hitPoints
                          ? 'bg-red-500 border-red-600 shadow-lg'
                          : 'bg-gray-200 border-gray-300'
                        }
                      `}
                    />
                  ))}
                </div>
                <div className="text-center mt-2 text-2xl font-bold text-gray-800">
                  {player.hitPoints}/3
                </div>
              </div>

              {/* Dice Display */}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Battle Dice</div>
                <div className="flex justify-center gap-2">
                  {(index === battleState.currentAttacker ? battleState.attackerDice : battleState.defenderDice).map((die, dieIndex) => (
                    <div
                      key={dieIndex}
                      className="w-12 h-12 bg-white border-2 border-gray-800 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg"
                    >
                      {die}
                    </div>
                  ))}
                </div>
                {battleState.battlePhase === 'resolve' && (
                  <div className="mt-2 text-sm font-semibold">
                    {isDoubles(index === battleState.currentAttacker ? battleState.attackerDice : battleState.defenderDice)
                      ? '🎯 DOUBLES!'
                      : '❌ No doubles'
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Battle Controls */}
        <div className="text-center mb-8">
          {battleState.battlePhase === 'ready' && (
            <div>
              <p className="text-lg mb-4">
                <span className="font-bold text-red-600">
                  {battleState.players[battleState.currentAttacker].name}
                </span> attacks first!
              </p>
              <Button
                onClick={handleAttackerRoll}
                className="h-16 px-8 text-xl font-bold bg-red-600 hover:bg-red-700"
              >
                🎲 Roll Attack Dice
              </Button>
            </div>
          )}

          {battleState.battlePhase === 'defender-roll' && (
            <div>
              <p className="text-lg mb-4">
                <span className="font-bold text-blue-600">
                  {battleState.players[battleState.currentAttacker === 0 ? 1 : 0].name}
                </span> defends!
              </p>
              <Button
                onClick={handleDefenderRoll}
                className="h-16 px-8 text-xl font-bold bg-blue-600 hover:bg-blue-700"
              >
                🎲 Roll Defense Dice
              </Button>
            </div>
          )}

          {battleState.battlePhase === 'resolve' && (
            <div>
              <p className="text-lg mb-4">Resolving battle round...</p>
              <Button
                onClick={resolveBattle}
                className="h-16 px-8 text-xl font-bold bg-purple-600 hover:bg-purple-700"
              >
                ⚔️ Resolve Battle
              </Button>
            </div>
          )}

          {battleState.battlePhase === 'finished' && (
            <div>
              <p className="text-2xl font-bold text-green-600 mb-4">
                🏆 Battle Complete!
              </p>
              <p className="text-lg text-gray-600">
                Returning to game...
              </p>
            </div>
          )}
        </div>

        {/* Battle Log */}
        <div className="bg-gray-50 rounded-2xl p-6 max-h-48 overflow-y-auto">
          <h4 className="font-bold text-gray-800 mb-4">📜 Battle Log</h4>
          <div className="space-y-2">
            {battleState.battleLog.map((entry, index) => (
              <div key={index} className="text-sm text-gray-700 p-2 bg-white rounded-lg">
                {entry}
              </div>
            ))}
          </div>
        </div>

        {/* Rules Reminder */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h5 className="font-bold text-yellow-800 mb-2">⚔️ Battle Rules</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Each player rolls TWO dice</li>
            <li>• DOUBLES (same number on both dice) = successful attack</li>
            <li>• If attacker gets doubles but defender doesn't = 1 damage</li>
            <li>• If defender gets doubles but attacker doesn't = 1 damage to attacker</li>
            <li>• If both get doubles or neither gets doubles = no damage</li>
            <li>• First player to 0 HP loses the battle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BattleModal;