export interface Player {
  id: string;
  name: string;
  color: string;
  position: number;
  hitPoints: number;
  isActive: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gamePhase: 'setup' | 'playing' | 'battle' | 'finished';
  battleParticipants: Player[];
  movementDie: number;
  lastRoll: number;
  winner: Player | null;
}

export interface BoardSegment {
  numbers: number[];
  direction: 'down' | 'up' | 'diagonal-down-left' | 'diagonal-up-left';
  endPosition: number;
}

// Updated segments for horizontal board layout
export const BOARD_SEGMENTS: BoardSegment[] = [
  { numbers: [1, 2, 3, 4], direction: 'down', endPosition: 4 },
  { numbers: [5, 6, 7, 8], direction: 'up', endPosition: 8 },
  { numbers: [9, 10, 11, 12], direction: 'down', endPosition: 12 },
  { numbers: [13, 14, 15, 16], direction: 'up', endPosition: 16 },
  { numbers: [17, 18, 19, 20], direction: 'diagonal-down-left', endPosition: 20 },
  { numbers: [21, 22, 23, 24], direction: 'diagonal-up-left', endPosition: 24 },
  { numbers: [25, 26, 27, 28], direction: 'down', endPosition: 28 },
];

export const PLAYER_COLORS = [
  { name: 'Red', color: 'bg-red-500', border: 'border-red-600' },
  { name: 'Blue', color: 'bg-blue-500', border: 'border-blue-600' },
  { name: 'Green', color: 'bg-green-500', border: 'border-green-600' },
  { name: 'Yellow', color: 'bg-yellow-500', border: 'border-yellow-600' },
];