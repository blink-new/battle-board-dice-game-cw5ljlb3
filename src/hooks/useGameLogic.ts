import { useState, useCallback } from 'react';
import { Player, GameState, BOARD_SEGMENTS } from '../types/game';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    gamePhase: 'setup',
    battleParticipants: [],
    movementDie: 1,
    battleDice: [1, 1],
    lastRoll: 0,
    winner: null,
  });

  const startGame = useCallback((players: Player[]) => {
    setGameState(prev => ({
      ...prev,
      players,
      gamePhase: 'playing',
      currentPlayerIndex: 0,
    }));
  }, []);

  const getCurrentSegment = (position: number) => {
    return BOARD_SEGMENTS.find(segment => 
      segment.numbers.includes(position)
    );
  };

  const canLeaveSegment = (player: Player, steps: number) => {
    const currentSegment = getCurrentSegment(player.position);
    if (!currentSegment) return true;
    
    const newPosition = player.position + steps;
    
    // If new position would go beyond current segment's end
    if (newPosition > currentSegment.endPosition) {
      // Player can only leave if they land EXACTLY on the endpoint
      return false; // Cannot leave segment unless exact endpoint landing
    }
    
    return true; // Can move within segment or land exactly on endpoint
  };

  const rollDice = useCallback(() => {
    if (gameState.gamePhase === 'playing') {
      // Single die for movement (1-6)
      const singleDie = Math.floor(Math.random() * 6) + 1;
      
      setGameState(prev => ({
        ...prev,
        movementDie: singleDie,
        lastRoll: singleDie,
      }));
      
      // Move player after a short delay
      setTimeout(() => {
        movePlayer(singleDie);
      }, 1000);
    } else if (gameState.gamePhase === 'battle') {
      // Two dice for battle (1-6 each)
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      
      setGameState(prev => ({
        ...prev,
        battleDice: [dice1, dice2],
        lastRoll: dice1 + dice2,
      }));
      
      // Note: Battle outcome handled by BattleModal component
      console.log(`Battle dice rolled: ${dice1}, ${dice2} ${dice1 === dice2 ? '(DOUBLES!)' : '(No doubles)'}`);
    }
  }, [gameState.gamePhase]);

  const movePlayer = useCallback((steps: number) => {
    setGameState(prev => {
      const newPlayers = [...prev.players];
      const currentPlayer = newPlayers[prev.currentPlayerIndex];
      const currentSegment = getCurrentSegment(currentPlayer.position);
      
      // Check if player can make this move
      if (currentSegment && !canLeaveSegment(currentPlayer, steps)) {
        // Player is trapped - cannot move beyond segment without exact endpoint landing
        const newPosition = currentPlayer.position + steps;
        if (newPosition > currentSegment.endPosition) {
          // Cannot move - stay in place, turn ends
          console.log(`${currentPlayer.name} rolled ${steps} but cannot leave segment ${currentSegment.numbers} without exact endpoint landing!`);
          const nextPlayerIndex = (prev.currentPlayerIndex + 1) % newPlayers.filter(p => p.isActive).length;
          return {
            ...prev,
            players: newPlayers,
            currentPlayerIndex: nextPlayerIndex,
            lastRoll: 0,
          };
        }
      }
      
      // Calculate new position (can move within segment or hit endpoint exactly)
      const newPosition = Math.min(currentPlayer.position + steps, 28);
      currentPlayer.position = newPosition;
      
      // Check if player reached a segment endpoint (these are the battle positions!)
      const segmentEndpoints = [4, 8, 12, 16, 20, 24, 28];
      const isAtEndpoint = segmentEndpoints.includes(newPosition);
      
      if (isAtEndpoint) {
        console.log(`${currentPlayer.name} reached endpoint ${newPosition}!`);
        
        // Check if another player is ALREADY at this endpoint
        const otherPlayersAtEndpoint = newPlayers.filter(p => 
          p.id !== currentPlayer.id && 
          p.position === newPosition && 
          p.isActive
        );
        
        if (otherPlayersAtEndpoint.length > 0) {
          // BATTLE TIME! Players meet at endpoint
          console.log(`BATTLE! ${currentPlayer.name} meets ${otherPlayersAtEndpoint.map(p => p.name).join(', ')} at endpoint ${newPosition}!`);
          return {
            ...prev,
            players: newPlayers,
            gamePhase: 'battle',
            battleParticipants: [currentPlayer, ...otherPlayersAtEndpoint],
          };
        }
      }
      
      // Check for winner (reached position 28)
      if (newPosition === 28) {
        return {
          ...prev,
          players: newPlayers,
          gamePhase: 'finished',
          winner: currentPlayer,
        };
      }
      
      // Next player's turn
      const activePlayerCount = newPlayers.filter(p => p.isActive).length;
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % activePlayerCount;
      
      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        lastRoll: 0,
      };
    });
  }, []);

  const handleBattleComplete = useCallback((winner: Player) => {
    setGameState(prev => {
      const newPlayers = [...prev.players];
      
      // Update player data from battle results
      prev.battleParticipants.forEach(battlePlayer => {
        const playerIndex = newPlayers.findIndex(p => p.id === battlePlayer.id);
        if (playerIndex !== -1) {
          newPlayers[playerIndex] = { ...battlePlayer };
          if (battlePlayer.hitPoints <= 0) {
            newPlayers[playerIndex].isActive = false;
            console.log(`${battlePlayer.name} has been eliminated from the game!`);
          }
        }
      });
      
      // Check if only one player remains
      const activePlayers = newPlayers.filter(p => p.isActive);
      
      if (activePlayers.length === 1) {
        return {
          ...prev,
          players: newPlayers,
          gamePhase: 'finished',
          winner: activePlayers[0],
          battleParticipants: [],
        };
      }
      
      // Battle winner gets to continue their turn
      // Losers remain at the endpoint (cannot progress)
      const winnerIndex = newPlayers.findIndex(p => p.id === winner.id);
      console.log(`${winner.name} won the battle! They may now progress from the endpoint.`);
      
      return {
        ...prev,
        players: newPlayers,
        gamePhase: 'playing',
        battleParticipants: [],
        currentPlayerIndex: winnerIndex,
        lastRoll: 0,
      };
    });
  }, []);

  const closeBattle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      battleParticipants: [],
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      gamePhase: 'setup',
      battleParticipants: [],
      movementDie: 1,
      battleDice: [1, 1],
      lastRoll: 0,
      winner: null,
    });
  }, []);

  return {
    gameState,
    startGame,
    rollDice,
    handleBattleComplete,
    closeBattle,
    resetGame,
  };
};