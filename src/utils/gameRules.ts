import { PitState, Piece, PlayerId, MoveStep, AIDifficulty } from '../types';

export const TOTAL_PITS = 12;
export const QUAN_PIT_1 = 5;  // Right Ô Quan
export const QUAN_PIT_2 = 11; // Left Ô Quan

// Create initial board state
export function createInitialBoard(): PitState[] {
  const pits: PitState[] = [];

  for (let i = 0; i < TOTAL_PITS; i++) {
    const isQuan = i === QUAN_PIT_1 || i === QUAN_PIT_2;
    let owner: PlayerId | null = null;
    if (i >= 0 && i <= 4) owner = 'p1';
    else if (i >= 6 && i <= 10) owner = 'p2';

    const pieces: Piece[] = [];

    if (isQuan) {
      // 1 Quan in each Ô Quan: Pit 11 = Left (Nam Tả - Male Quan Ông), Pit 5 = Right (Nữ Hữu - Female Quan Bà)
      const isRightQuan = i === QUAN_PIT_1;
      pieces.push({
        id: `quan-${i}`,
        type: 'quan',
        gender: isRightQuan ? 'female' : 'male',
        variant: isRightQuan ? 1 : 2,
      });
    } else {
      // 5 Dân in each Ô Dân with high color diversity (variants 1..5)
      for (let d = 0; d < 5; d++) {
        pieces.push({
          id: `dan-${i}-${d}`,
          type: 'dan',
          gender: (i + d) % 2 === 0 ? 'male' : 'female',
          variant: ((i * 5 + d) % 5) + 1,
        });
      }
    }

    pits.push({
      id: i,
      isQuanPit: isQuan,
      owner,
      pieces,
    });
  }

  return pits;
}

// Get adjacent pit index given direction
export function getNextPitIndex(current: number, direction: 'clockwise' | 'counterclockwise'): number {
  if (direction === 'clockwise') {
    return (current + 1) % TOTAL_PITS;
  } else {
    return (current - 1 + TOTAL_PITS) % TOTAL_PITS;
  }
}

// Helper to check if a player's side is completely empty
export function isSideEmpty(board: PitState[], player: PlayerId): boolean {
  if (!board || board.length < 12) return true;
  const start = player === 'p1' ? 0 : 6;
  const end = player === 'p1' ? 4 : 10;
  for (let i = start; i <= end; i++) {
    const pieces = board[i]?.pieces || [];
    if (pieces.length > 0) return false;
  }
  return true;
}

// Check if game is over (both Ô Quan are empty)
export function isGameOver(board: PitState[]): boolean {
  if (!board || board.length < 12) return false;
  const quan1Empty = (board[QUAN_PIT_1]?.pieces || []).length === 0;
  const quan2Empty = (board[QUAN_PIT_2]?.pieces || []).length === 0;
  return quan1Empty && quan2Empty;
}

export interface SimulationResult {
  finalBoard: PitState[];
  steps: MoveStep[];
  eatenByP1: Piece[];
  eatenByP2: Piece[];
}

// Simulate full move with turn continuation & eating logic
export function simulateMove(
  initialBoard: PitState[],
  player: PlayerId,
  startPitIndex: number,
  direction: 'clockwise' | 'counterclockwise'
): SimulationResult {
  // Deep clone board safely
  const board: PitState[] = initialBoard.map((p, idx) => ({
    id: p?.id ?? idx,
    isQuanPit: p?.isQuanPit ?? (idx === 5 || idx === 11),
    owner: p?.owner ?? (idx >= 0 && idx <= 4 ? 'p1' : idx >= 6 && idx <= 10 ? 'p2' : null),
    pieces: Array.isArray(p?.pieces) ? [...p.pieces] : [],
  }));

  const steps: MoveStep[] = [];
  const eatenByP1: Piece[] = [];
  const eatenByP2: Piece[] = [];

  let currentPit = startPitIndex;

  // Outer loop for turn continuation (picking up pieces from next pit if non-empty)
  while (true) {
    if (!board[currentPit] || (board[currentPit].pieces || []).length === 0) break;

    // Pick up pieces
    const hand: Piece[] = [...(board[currentPit].pieces || [])];
    board[currentPit].pieces = [];

    steps.push({
      pitIndex: currentPit,
      action: 'pickup',
      description: `Bốc ${hand.length} quân tại ô ${currentPit + 1} (Trong tay: ${hand.length} quân)`,
      activePieceType: hand.some(p => p.type === 'quan') ? 'quan' : 'dan',
      handCount: hand.length,
    });

    let handIndex = 0;
    let lastPit = currentPit;

    // Distribute hand 1 by 1
    while (handIndex < hand.length) {
      lastPit = getNextPitIndex(lastPit, direction);
      const pieceToDrop = hand[handIndex++];
      if (!board[lastPit].pieces) board[lastPit].pieces = [];
      board[lastPit].pieces.push(pieceToDrop);
      const remainingHand = hand.length - handIndex;

      steps.push({
        pitIndex: lastPit,
        action: 'drop',
        pieceDropped: pieceToDrop,
        description: `Rải 1 quân vào ô ${lastPit + 1} (Còn ${remainingHand} quân trên tay)`,
        activePieceType: pieceToDrop.type,
        handCount: remainingHand,
      });
    }

    // Now check where distribution ended (at `lastPit`)
    const nextPit = getNextPitIndex(lastPit, direction);
    const nextPitPieces = board[nextPit]?.pieces || [];

    // Rule: Cannot pick up from Ô Quan (pits 5 & 11)
    if (board[nextPit]?.isQuanPit) {
      // If next pit is Ô Quan with pieces, turn ends (cannot distribute Quan)
      // If next pit is empty Ô Quan, check if pit beyond has pieces to eat!
      if (nextPitPieces.length > 0) {
        steps.push({
          pitIndex: nextPit,
          action: 'end',
          description: `Gặp ô Quan (ô ${nextPit + 1}), dừng lượt đi.`,
          handCount: 0,
        });
        break;
      }
    }

    // Case 1: Next pit has pieces AND is NOT an Ô Quan -> Continue turn by picking up from nextPit!
    if (nextPitPieces.length > 0 && !board[nextPit]?.isQuanPit) {
      currentPit = nextPit;
      continue; // Continue outer while loop
    }

    // Case 2: Next pit is EMPTY (0 pieces)
    if (nextPitPieces.length === 0) {
      // Check pit beyond the empty pit
      let evalEmptyPit = nextPit;

      let isEatingPhase = true;
      let ateSomething = false;

      while (isEatingPhase) {
        // Record hand slam at the empty pit!
        steps.push({
          pitIndex: evalEmptyPit,
          action: 'slam',
          description: `Đập tay xuống ô trống ${evalEmptyPit + 1}! ✋💥`,
          handCount: 0,
        });

        const targetPit = getNextPitIndex(evalEmptyPit, direction);
        const targetPieces = board[targetPit]?.pieces || [];

        if (targetPieces.length > 0) {
          // EAT ALL PIECES IN TARGET PIT!
          const captured = [...targetPieces];
          board[targetPit].pieces = [];

          if (player === 'p1') eatenByP1.push(...captured);
          else eatenByP2.push(...captured);

          const quanCount = captured.filter(p => p?.type === 'quan').length;
          const danCount = captured.filter(p => p?.type === 'dan').length;

          steps.push({
            pitIndex: targetPit,
            action: 'eat',
            piecesEaten: captured,
            eatenPitIndex: targetPit,
            description: `Ăn quân tại ô ${targetPit + 1}! (${quanCount ? `${quanCount} Quan, ` : ''}${danCount} Dân)`,
            activePieceType: quanCount > 0 ? 'quan' : 'dan',
            handCount: 0,
          });

          ateSomething = true;

          // Check for "Ăn chập" (chain capture)
          const pitAfterEaten = getNextPitIndex(targetPit, direction);
          const pitAfterPieces = board[pitAfterEaten]?.pieces || [];
          if (pitAfterPieces.length === 0) {
            evalEmptyPit = pitAfterEaten; // Repeat eating check loop!
          } else {
            isEatingPhase = false;
          }
        } else {
          // Target pit is ALSO empty (2 consecutive empty pits) -> Mất lượt
          if (!ateSomething) {
            steps.push({
              pitIndex: evalEmptyPit,
              action: 'end',
              description: `Hai ô trống liên tiếp, dừng lượt đi.`,
              handCount: 0,
            });
          }
          isEatingPhase = false;
        }
      }

      break; // End outer loop
    }
  }

  return {
    finalBoard: board,
    steps,
    eatenByP1,
    eatenByP2,
  };
}

// Find all valid start pits for a player
export function getValidStartPits(board: PitState[], player: PlayerId): number[] {
  if (!board || board.length < 12) return [];
  const start = player === 'p1' ? 0 : 6;
  const end = player === 'p1' ? 4 : 10;
  const valid: number[] = [];

  for (let i = start; i <= end; i++) {
    const pieces = board[i]?.pieces || [];
    if (pieces.length > 0) {
      valid.push(i);
    }
  }

  return valid;
}

// Calculate score for captured pieces
export function calculatePiecesScore(pieces: Piece[]): { total: number; dan: number; quan: number } {
  let dan = 0;
  let quan = 0;
  for (const p of pieces) {
    if (p.type === 'quan') quan++;
    else dan++;
  }
  return {
    dan,
    quan,
    total: dan + quan * 10,
  };
}

// AI decision maker for Ô ăn quan
export function getAIMove(
  board: PitState[],
  difficulty: AIDifficulty
): { pitIndex: number; direction: 'clockwise' | 'counterclockwise' } | null {
  const validPits = getValidStartPits(board, 'p2');
  if (validPits.length === 0) return null;

  const directions: ('clockwise' | 'counterclockwise')[] = ['clockwise', 'counterclockwise'];
  const possibleMoves: { pitIndex: number; direction: 'clockwise' | 'counterclockwise'; scoreGain: number }[] = [];

  for (const pitIndex of validPits) {
    for (const direction of directions) {
      const sim = simulateMove(board, 'p2', pitIndex, direction);
      const scoreGain = calculatePiecesScore(sim.eatenByP2).total;
      possibleMoves.push({ pitIndex, direction, scoreGain });
    }
  }

  if (possibleMoves.length === 0) return null;

  // EASY DIFFICULTY: 70% random, 30% best immediate score
  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      const randIndex = Math.floor(Math.random() * possibleMoves.length);
      return possibleMoves[randIndex];
    }
  }

  // Sort by score gain descending
  possibleMoves.sort((a, b) => b.scoreGain - a.scoreGain);

  // MEDIUM DIFFICULTY: Pick the move with highest immediate score gain
  if (difficulty === 'medium') {
    return possibleMoves[0];
  }

  // HARD DIFFICULTY: Minimax lookahead 1 step further (prevent opponent high eats)
  let bestMove = possibleMoves[0];
  let bestNetScore = -999;

  for (const move of possibleMoves) {
    const sim = simulateMove(board, 'p2', move.pitIndex, move.direction);
    const p2Gain = calculatePiecesScore(sim.eatenByP2).total;

    // Check opponent (p1) best response
    const opponentPits = getValidStartPits(sim.finalBoard, 'p1');
    let maxP1Gain = 0;

    for (const opPit of opponentPits) {
      for (const opDir of directions) {
        const opSim = simulateMove(sim.finalBoard, 'p1', opPit, opDir);
        const p1Gain = calculatePiecesScore(opSim.eatenByP1).total;
        if (p1Gain > maxP1Gain) maxP1Gain = p1Gain;
      }
    }

    const netScore = p2Gain - maxP1Gain * 0.8; // Net evaluation
    if (netScore > bestNetScore) {
      bestNetScore = netScore;
      bestMove = move;
    }
  }

  return bestMove;
}
