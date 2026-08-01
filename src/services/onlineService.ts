import { ref, get, set, update, onValue, off, onDisconnect, remove } from 'firebase/database';
import { rtdb } from '../firebase';
import { PitState, PlayerId, Piece } from '../types';

export interface OnlineRoomData {
  roomId: string;
  p1ClientId?: string;
  p2ClientId?: string;
  p1Joined: boolean;
  p2Joined: boolean;
  board: PitState[];
  currentPlayer: PlayerId;
  p1Captured: Piece[];
  p2Captured: Piece[];
  p1Debt: number;
  p2Debt: number;
  isGameStarted: boolean;
  resetId?: string;
  lastMove?: {
    startPit: number;
    direction: 'clockwise' | 'counterclockwise';
    playerId: PlayerId;
    moveId: string;
    timestamp: number;
  } | null;
  updatedAt: number;
}

// Normalize board structure received from Firebase (handles empty arrays stripped by Firebase)
export function normalizeBoard(rawBoard: any): PitState[] {
  const result: PitState[] = [];
  for (let i = 0; i < 12; i++) {
    const rawPit = Array.isArray(rawBoard) ? rawBoard[i] : (rawBoard && typeof rawBoard === 'object' ? (rawBoard[i] || rawBoard[`${i}`]) : null);
    if (rawPit && typeof rawPit === 'object') {
      let piecesList: Piece[] = [];
      if (Array.isArray(rawPit.pieces)) {
        piecesList = rawPit.pieces.filter(Boolean);
      } else if (rawPit.pieces && typeof rawPit.pieces === 'object') {
        piecesList = Object.values(rawPit.pieces).filter(Boolean) as Piece[];
      }
      result.push({
        id: typeof rawPit.id === 'number' ? rawPit.id : i,
        isQuanPit: typeof rawPit.isQuanPit === 'boolean' ? rawPit.isQuanPit : (i === 5 || i === 11),
        owner: rawPit.owner !== undefined ? rawPit.owner : (i >= 0 && i <= 4 ? 'p1' : i >= 6 && i <= 10 ? 'p2' : null),
        pieces: piecesList,
      });
    } else {
      result.push({
        id: i,
        isQuanPit: i === 5 || i === 11,
        owner: i >= 0 && i <= 4 ? 'p1' : i >= 6 && i <= 10 ? 'p2' : null,
        pieces: [],
      });
    }
  }
  return result;
}

// Normalize pieces array received from Firebase
export function normalizePieces(rawPieces: any): Piece[] {
  if (!rawPieces) return [];
  if (Array.isArray(rawPieces)) return rawPieces.filter(Boolean);
  if (typeof rawPieces === 'object') return (Object.values(rawPieces).filter(Boolean) as Piece[]);
  return [];
}

// Normalize full room data object
export function normalizeRoomData(data: any): OnlineRoomData | null {
  if (!data) return null;
  return {
    ...data,
    board: normalizeBoard(data.board),
    p1Captured: normalizePieces(data.p1Captured),
    p2Captured: normalizePieces(data.p2Captured),
    p1Debt: typeof data.p1Debt === 'number' ? data.p1Debt : 0,
    p2Debt: typeof data.p2Debt === 'number' ? data.p2Debt : 0,
    p1Joined: Boolean(data.p1Joined),
    p2Joined: Boolean(data.p2Joined),
    isGameStarted: Boolean(data.isGameStarted),
  };
}

// Get or generate a persistent unique Client ID for this browser tab/session
export function getClientId(): string {
  let clientId = sessionStorage.getItem('oquan_client_id');
  if (!clientId) {
    clientId = 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    sessionStorage.setItem('oquan_client_id', clientId);
  }
  return clientId;
}

// Generate random 6-character uppercase Room Code
export function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create or join room on Firebase
export async function joinOrCreateRoom(
  roomId: string,
  initialBoard: PitState[]
): Promise<{ playerRole: PlayerId; roomData: OnlineRoomData }> {
  const clientId = getClientId();
  const roomRef = ref(rtdb, `oquan_rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    // Create new room as Player 1
    const newRoom: OnlineRoomData = {
      roomId,
      p1ClientId: clientId,
      p2ClientId: '',
      p1Joined: true,
      p2Joined: false,
      board: initialBoard,
      currentPlayer: 'p1',
      p1Captured: [],
      p2Captured: [],
      p1Debt: 0,
      p2Debt: 0,
      isGameStarted: false,
      lastMove: null,
      updatedAt: Date.now(),
    };
    await set(roomRef, newRoom);
    return { playerRole: 'p1', roomData: newRoom };
  } else {
    // Join existing room
    const roomData = normalizeRoomData(snapshot.val())!;
    let playerRole: PlayerId = 'p2';
    const updates: Partial<OnlineRoomData> = {};

    if (roomData.p1ClientId === clientId) {
      playerRole = 'p1';
      updates.p1Joined = true;
    } else if (roomData.p2ClientId === clientId) {
      playerRole = 'p2';
      updates.p2Joined = true;
    } else if (!roomData.p1ClientId || !roomData.p1Joined) {
      playerRole = 'p1';
      updates.p1ClientId = clientId;
      updates.p1Joined = true;
    } else if (!roomData.p2ClientId || !roomData.p2Joined) {
      playerRole = 'p2';
      updates.p2ClientId = clientId;
      updates.p2Joined = true;
    } else {
      // Room already has two active players - join as Spectator
      playerRole = 'spectator';
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = Date.now();
      await update(roomRef, updates);
    }

    return {
      playerRole,
      roomData: { ...roomData, ...updates },
    };
  }
}

// Subscribe to real-time room updates
export function subscribeToRoom(
  roomId: string,
  onUpdate: (data: OnlineRoomData | null) => void
): () => void {
  const roomRef = ref(rtdb, `oquan_rooms/${roomId}`);
  const listener = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(normalizeRoomData(snapshot.val()));
    } else {
      onUpdate(null);
    }
  });

  return () => {
    off(roomRef, 'value', listener);
  };
}

// Dispatch a move online
export async function sendOnlineMove(
  roomId: string,
  startPit: number,
  direction: 'clockwise' | 'counterclockwise',
  playerId: PlayerId
): Promise<void> {
  const roomRef = ref(rtdb, `oquan_rooms/${roomId}`);
  const moveId = `move_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  await update(roomRef, {
    lastMove: {
      startPit,
      direction,
      playerId,
      moveId,
      timestamp: Date.now(),
    },
    updatedAt: Date.now(),
  });
}

// Update game state after turn or sync
export async function updateOnlineGameState(
  roomId: string,
  partialData: Partial<OnlineRoomData>
): Promise<void> {
  const roomRef = ref(rtdb, `oquan_rooms/${roomId}`);
  await update(roomRef, {
    ...partialData,
    updatedAt: Date.now(),
  });
}

// Reset online game room
export async function resetOnlineGame(
  roomId: string,
  initialBoard: PitState[]
): Promise<void> {
  const roomRef = ref(rtdb, `oquan_rooms/${roomId}`);
  const resetId = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  await update(roomRef, {
    board: initialBoard,
    currentPlayer: 'p1',
    p1Captured: [],
    p2Captured: [],
    p1Debt: 0,
    p2Debt: 0,
    isGameStarted: false,
    resetId,
    lastMove: null,
    updatedAt: Date.now(),
  });
}

// Manage Firebase onDisconnect for automatic room cleanup
export function handleRoomDisconnect(
  roomId: string,
  playerRole: PlayerId,
  roomData: OnlineRoomData | null
) {
  if (!roomId || !roomData || playerRole === 'spectator') return;

  const roomRef = ref(rtdb, `oquan_rooms/${roomId}`);
  const hasTwoPlayers = Boolean(
    (roomData.p1ClientId && roomData.p2ClientId) || (roomData.p1Joined && roomData.p2Joined)
  );

  if (!hasTwoPlayers) {
    // Single player in room: delete entire room on disconnect to prevent stale database trash
    onDisconnect(roomRef).remove();
  } else {
    // Two players in room: DO NOT delete the room when one disconnects
    onDisconnect(roomRef).cancel();
    const joinedRef = ref(
      rtdb,
      `oquan_rooms/${roomId}/${playerRole === 'p1' ? 'p1Joined' : 'p2Joined'}`
    );
    onDisconnect(joinedRef).set(false);
  }
}
