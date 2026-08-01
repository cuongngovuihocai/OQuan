export type PlayerId = 'p1' | 'p2' | 'spectator'; // p1: Bottom (Human/Red), p2: Top (AI/Blue or Friend), spectator: Viewer
export type GameMode = 'ai' | 'local2p' | 'online';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';
export type TeamColor = 'red' | 'blue' | 'green' | 'purple' | 'amber' | 'pink';

export interface Piece {
  id: string;
  type: 'quan' | 'dan';
  gender?: 'male' | 'female'; // For Dân diversity
  variant?: number; // Visual variation for cute expressions/hats
}

export interface PitState {
  id: number; // 0..11
  isQuanPit: boolean; // 5 and 11 are Quan pits
  owner: PlayerId | null; // 0..4 belong to p1, 6..10 belong to p2, 5 & 11 are neutral
  pieces: Piece[];
}

export interface MoveStep {
  pitIndex: number;
  action: 'pickup' | 'drop' | 'eat' | 'end' | 'replenish' | 'slam';
  pieceDropped?: Piece;
  piecesEaten?: Piece[];
  eatenPitIndex?: number;
  description: string;
  activePieceType?: 'quan' | 'dan';
  handCount?: number;
}

export interface MoveRecord {
  player: PlayerId;
  startPitIndex: number;
  direction: 'clockwise' | 'counterclockwise';
  scoreGainedP1: number;
  scoreGainedP2: number;
  steps: MoveStep[];
}

export interface GameStats {
  p1Score: number; // Captured pieces value (1 pt per Dân, 10 pts per Quan)
  p2Score: number;
  p1Debt: number;  // Borrowed points when side is empty
  p2Debt: number;
  p1CapturedDan: number;
  p1CapturedQuan: number;
  p2CapturedDan: number;
  p2CapturedQuan: number;
}

export interface MoveAnimationState {
  isAnimating: boolean;
  currentStepIndex: number;
  steps: MoveStep[];
  movingPiece?: Piece;
  fromPitIndex?: number;
  toPitIndex?: number;
}

export interface GameLog {
  id: string;
  text: string;
  type: 'move' | 'eat' | 'replenish' | 'end' | 'info';
  timestamp: string;
}
