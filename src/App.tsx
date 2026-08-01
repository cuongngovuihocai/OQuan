import React, { useState, useEffect, useRef } from 'react';
import {
  PitState,
  PlayerId,
  GameMode,
  AIDifficulty,
  AnimationSpeed,
  MoveStep,
  Piece,
  GameStats,
  TeamColor,
} from './types';
import {
  createInitialBoard,
  simulateMove,
  getValidStartPits,
  isSideEmpty,
  isGameOver,
  getAIMove,
  calculatePiecesScore,
} from './utils/gameRules';
import { FolkPaperBackground } from './components/FolkPaperBackground';
import { GameHeaderPanel } from './components/GameHeaderPanel';
import { Board } from './components/Board';
import { OnlineRoomBanner } from './components/OnlineRoomBanner';
import { TutorialModal } from './components/TutorialModal';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';
import { RotateDevicePrompt } from './components/RotateDevicePrompt';
import { soundEngine } from './utils/audio';
import {
  OnlineRoomData,
  generateRoomId,
  joinOrCreateRoom,
  subscribeToRoom,
  sendOnlineMove,
  updateOnlineGameState,
  resetOnlineGame,
  handleRoomDisconnect,
} from './services/onlineService';

export default function App() {
  // Game Setup State (Defaults per user prompt)
  const [board, setBoard] = useState<PitState[]>(() => createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>('p1');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('easy'); // Mặc định Dễ
  const [speed, setSpeed] = useState<AnimationSpeed>('slow'); // Mặc định Chậm
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true); // Mặc định Mở

  // Online Multiplayer State
  const [onlineRoomId, setOnlineRoomId] = useState<string | null>(null);
  const [onlinePlayerRole, setOnlinePlayerRole] = useState<PlayerId>('p1');
  const [onlineRoomData, setOnlineRoomData] = useState<OnlineRoomData | null>(null);
  const lastProcessedMoveIdRef = useRef<string | null>(null);
  const lastProcessedResetIdRef = useRef<string | null>(null);

  // Team Colors (Đội Đỏ vs Đội Xanh)
  const [p1Color, setP1Color] = useState<TeamColor>('red');
  const [p2Color, setP2Color] = useState<TeamColor>('blue');

  const handleToggleTeamChoice = () => {
    if (gameMode === 'online') return;
    if (p1Color === 'red') {
      setP1Color('blue');
      setP2Color('red');
    } else {
      setP1Color('red');
      setP2Color('blue');
    }
  };

  // Game Timer State (Mặc định 1 phút = 60s)
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [p1TimeRemaining, setP1TimeRemaining] = useState<number>(60);
  const [p2TimeRemaining, setP2TimeRemaining] = useState<number>(60);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // Score & Captured Pieces Stash
  const [p1Captured, setP1Captured] = useState<Piece[]>([]);
  const [p2Captured, setP2Captured] = useState<Piece[]>([]);
  const [p1Debt, setP1Debt] = useState<number>(0);
  const [p2Debt, setP2Debt] = useState<number>(0);

  // Interaction & Animation State
  const [selectedPit, setSelectedPit] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentAnimStep, setCurrentAnimStep] = useState<MoveStep | null>(null);

  // Refs for state persistence to prevent stale closure race conditions
  const boardRef = useRef<PitState[]>(board);
  const isAnimatingRef = useRef<boolean>(isAnimating);
  const p1CapturedRef = useRef<Piece[]>(p1Captured);
  const p2CapturedRef = useRef<Piece[]>(p2Captured);
  const p1DebtRef = useRef<number>(p1Debt);
  const p2DebtRef = useRef<number>(p2Debt);
  const currentPlayerRef = useRef<PlayerId>(currentPlayer);
  const gameModeRef = useRef<GameMode>(gameMode);
  const onlineRoomIdRef = useRef<string | null>(onlineRoomId);
  const onlinePlayerRoleRef = useRef<PlayerId>(onlinePlayerRole);
  const timerDurationRef = useRef<number>(timerDuration);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);
  useEffect(() => { p1CapturedRef.current = p1Captured; }, [p1Captured]);
  useEffect(() => { p2CapturedRef.current = p2Captured; }, [p2Captured]);
  useEffect(() => { p1DebtRef.current = p1Debt; }, [p1Debt]);
  useEffect(() => { p2DebtRef.current = p2Debt; }, [p2Debt]);
  useEffect(() => { currentPlayerRef.current = currentPlayer; }, [currentPlayer]);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);
  useEffect(() => { onlineRoomIdRef.current = onlineRoomId; }, [onlineRoomId]);
  useEffect(() => { onlinePlayerRoleRef.current = onlinePlayerRole; }, [onlinePlayerRole]);
  useEffect(() => { timerDurationRef.current = timerDuration; }, [timerDuration]);

  // Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 1. Listen for URL room parameter (?room=ID) on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');

    if (roomParam) {
      const cleanRoomId = roomParam.trim().toUpperCase();
      setGameMode('online');
      setOnlineRoomId(cleanRoomId);
    }
  }, []);

  // 2. Connect & Subscribe to Firebase Realtime Database for Online Room
  useEffect(() => {
    if (gameMode !== 'online' || !onlineRoomId) return;

    let unsubscribe: (() => void) | undefined;

    joinOrCreateRoom(onlineRoomId, createInitialBoard()).then(({ playerRole, roomData }) => {
      setOnlinePlayerRole(playerRole);
      onlinePlayerRoleRef.current = playerRole;
      setOnlineRoomData(roomData);

      // Handle onDisconnect cleanup rule
      handleRoomDisconnect(onlineRoomId, playerRole, roomData);

      if (roomData.resetId) {
        lastProcessedResetIdRef.current = roomData.resetId;
      }

      if (roomData.board && roomData.board.length === 12) {
        setBoard(roomData.board);
        boardRef.current = roomData.board;
      }

      unsubscribe = subscribeToRoom(onlineRoomId, (data) => {
        if (!data) return;
        setOnlineRoomData(data);

        // Update onDisconnect handler based on current room population
        handleRoomDisconnect(onlineRoomId, onlinePlayerRoleRef.current, data);

        // Check if game was reset from Firebase
        if (data.resetId && data.resetId !== lastProcessedResetIdRef.current) {
          lastProcessedResetIdRef.current = data.resetId;

          // Automatically close victory modal and reset local state
          setIsVictoryOpen(false);
          setIsAnimating(false);
          isAnimatingRef.current = false;
          setCurrentAnimStep(null);
          setSelectedPit(null);

          const newBoard = data.board && data.board.length === 12 ? data.board : createInitialBoard();
          setBoard(newBoard);
          boardRef.current = newBoard;
          setCurrentPlayer(data.currentPlayer || 'p1');
          currentPlayerRef.current = data.currentPlayer || 'p1';
          setP1Captured(data.p1Captured || []);
          p1CapturedRef.current = data.p1Captured || [];
          setP2Captured(data.p2Captured || []);
          p2CapturedRef.current = data.p2Captured || [];
          setP1Debt(data.p1Debt || 0);
          p1DebtRef.current = data.p1Debt || 0;
          setP2Debt(data.p2Debt || 0);
          p2DebtRef.current = data.p2Debt || 0;
          setIsGameStarted(data.isGameStarted || false);
          setP1TimeRemaining(timerDurationRef.current);
          setP2TimeRemaining(timerDurationRef.current);
        } else if (data.lastMove && data.lastMove.moveId !== lastProcessedMoveIdRef.current) {
          lastProcessedMoveIdRef.current = data.lastMove.moveId;

          // Always start move simulation using authoritative board from Firebase room data
          const moveStartBoard = data.board && data.board.length === 12 ? data.board : boardRef.current;
          executeMove(data.lastMove.startPit, data.lastMove.direction, data.lastMove.playerId, moveStartBoard);
        } else if (!isAnimatingRef.current) {
          // Sync board & state when NOT animating
          if (data.board && data.board.length === 12) {
            setBoard(data.board);
            boardRef.current = data.board;
          }
          if (data.currentPlayer) {
            setCurrentPlayer(data.currentPlayer);
            currentPlayerRef.current = data.currentPlayer;
          }
          if (Array.isArray(data.p1Captured)) {
            setP1Captured(data.p1Captured);
            p1CapturedRef.current = data.p1Captured;
          }
          if (Array.isArray(data.p2Captured)) {
            setP2Captured(data.p2Captured);
            p2CapturedRef.current = data.p2Captured;
          }
          if (typeof data.p1Debt === 'number') {
            setP1Debt(data.p1Debt);
            p1DebtRef.current = data.p1Debt;
          }
          if (typeof data.p2Debt === 'number') {
            setP2Debt(data.p2Debt);
            p2DebtRef.current = data.p2Debt;
          }
          if (typeof data.isGameStarted === 'boolean') {
            setIsGameStarted(data.isGameStarted);
          }
        }
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [gameMode, onlineRoomId]);

  // Handle switching game mode (AI vs Local 2P vs Online)
  const handleSelectGameMode = (mode: GameMode) => {
    if (mode !== 'online') {
      setOnlineRoomId(null);
      setOnlineRoomData(null);
      // Remove ?room param from URL
      window.history.pushState({}, '', window.location.pathname);
    }
    setGameMode(mode);
    handleNewGame();
  };

  // Start new online room with random Room Code
  const handleStartOnlineGame = () => {
    const newRoomId = generateRoomId();
    setGameMode('online');
    setOnlineRoomId(newRoomId);
    const newUrl = `${window.location.pathname}?room=${newRoomId}`;
    window.history.pushState({}, '', newUrl);
  };

  // Get valid pits for current player (empty if animating or online & not player's turn)
  const validPits =
    isAnimating || (gameMode === 'online' && onlinePlayerRole !== currentPlayer)
      ? []
      : getValidStartPits(board, currentPlayer);

  // Update time limits when user modifies timerDuration setting
  const handleChangeTimerDuration = (newSeconds: number) => {
    setTimerDuration(newSeconds);
    setP1TimeRemaining(newSeconds);
    setP2TimeRemaining(newSeconds);
  };

  // Handle New Game Reset
  const handleNewGame = () => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    boardRef.current = newBoard;
    setCurrentPlayer('p1');
    currentPlayerRef.current = 'p1';
    setP1Captured([]);
    p1CapturedRef.current = [];
    setP2Captured([]);
    p2CapturedRef.current = [];
    setP1Debt(0);
    p1DebtRef.current = 0;
    setP2Debt(0);
    p2DebtRef.current = 0;
    setSelectedPit(null);
    setIsAnimating(false);
    isAnimatingRef.current = false;
    setCurrentAnimStep(null);
    setIsVictoryOpen(false);
    setIsGameStarted(false);
    setP1TimeRemaining(timerDuration);
    setP2TimeRemaining(timerDuration);

    if (gameMode === 'online' && onlineRoomId) {
      resetOnlineGame(onlineRoomId, newBoard);
    }
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.soundEnabled = next;
  };

  // Toggle Start / Pause Game Clock
  const handleToggleStartGame = () => {
    setIsGameStarted(prev => !prev);
  };

  // Handle Pit selection
  const handleSelectPit = (pitIdx: number) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (isAnimatingRef.current) return;
    if (gameMode === 'online' && onlinePlayerRole !== currentPlayer) {
      return; // Not your turn
    }
    setSelectedPit(pitIdx === -1 ? null : pitIdx);
  };

  // Handle Direction choice
  const handleChooseDirection = (direction: 'clockwise' | 'counterclockwise') => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (selectedPit === null || isAnimatingRef.current) return;

    if (gameMode === 'online') {
      if (onlinePlayerRole !== currentPlayer) return;
      if (onlineRoomId) {
        const pitToMove = selectedPit;
        setSelectedPit(null);
        sendOnlineMove(onlineRoomId, pitToMove, direction, onlinePlayerRole);
      }
    } else {
      executeMove(selectedPit, direction, currentPlayer);
    }
  };

  // Process a move with step-by-step animation
  const executeMove = (
    startPit: number,
    direction: 'clockwise' | 'counterclockwise',
    moverPlayer: PlayerId = currentPlayerRef.current,
    startBoard?: PitState[]
  ) => {
    if (!isGameStarted) {
      setIsGameStarted(true);
    }

    setIsAnimating(true);
    isAnimatingRef.current = true;
    setSelectedPit(null);

    // Prefer explicit startBoard (e.g. authoritative Firebase board) if provided
    const baseBoard = startBoard && Array.isArray(startBoard) && startBoard.length === 12
      ? startBoard
      : boardRef.current;

    const cleanBoard: PitState[] = baseBoard.map((p, idx) => ({
      id: typeof p?.id === 'number' ? p.id : idx,
      isQuanPit: typeof p?.isQuanPit === 'boolean' ? p.isQuanPit : (idx === 5 || idx === 11),
      owner: p?.owner !== undefined ? p.owner : (idx >= 0 && idx <= 4 ? 'p1' : idx >= 6 && idx <= 10 ? 'p2' : null),
      pieces: Array.isArray(p?.pieces) ? [...p.pieces.filter(Boolean)] : [],
    }));

    const simulation = simulateMove(cleanBoard, moverPlayer, startPit, direction);
    const steps = simulation.steps;

    let stepIdx = 0;
    const intervalMs = speed === 'slow' ? 650 : speed === 'fast' ? 220 : 380;
    let tempBoard = cleanBoard.map(p => ({
      ...p,
      pieces: Array.isArray(p.pieces) ? [...p.pieces] : [],
    }));

    const timer = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearInterval(timer);
        setBoard(simulation.finalBoard);
        boardRef.current = simulation.finalBoard;

        let updatedP1Cap = p1CapturedRef.current;
        let updatedP2Cap = p2CapturedRef.current;

        if (moverPlayer === 'p1') {
          updatedP1Cap = [...updatedP1Cap, ...simulation.eatenByP1];
          setP1Captured(updatedP1Cap);
          p1CapturedRef.current = updatedP1Cap;
        } else {
          updatedP2Cap = [...updatedP2Cap, ...simulation.eatenByP2];
          setP2Captured(updatedP2Cap);
          p2CapturedRef.current = updatedP2Cap;
        }

        finishTurn(simulation.finalBoard, updatedP1Cap, updatedP2Cap, moverPlayer);
        return;
      }

      const step = steps[stepIdx];
      setCurrentAnimStep(step);

      // Mutate intermediate board state for animation preview
      if (step.action === 'pickup') {
        if (tempBoard[step.pitIndex]) tempBoard[step.pitIndex].pieces = [];
      } else if (step.action === 'drop' && step.pieceDropped) {
        if (tempBoard[step.pitIndex]) {
          if (!Array.isArray(tempBoard[step.pitIndex].pieces)) tempBoard[step.pitIndex].pieces = [];
          tempBoard[step.pitIndex].pieces.push(step.pieceDropped);
        }
      } else if (step.action === 'eat' && step.eatenPitIndex !== undefined) {
        if (tempBoard[step.eatenPitIndex]) tempBoard[step.eatenPitIndex].pieces = [];
      } else if (step.action === 'slam') {
        soundEngine.playHandSlam();
      }

      const nextStepBoard = tempBoard.map(p => ({
        ...p,
        pieces: Array.isArray(p.pieces) ? [...p.pieces] : [],
      }));
      setBoard(nextStepBoard);
      boardRef.current = nextStepBoard;
      stepIdx++;
    }, intervalMs);
  };

  // Complete turn, check game over, and handle side replenishing
  const finishTurn = (
    finalBoard: PitState[],
    currentP1Captured: Piece[],
    currentP2Captured: Piece[],
    moverPlayer: PlayerId = currentPlayerRef.current
  ) => {
    setIsAnimating(false);
    isAnimatingRef.current = false;
    setCurrentAnimStep(null);

    // Reset turn timers
    setP1TimeRemaining(timerDurationRef.current);
    setP2TimeRemaining(timerDurationRef.current);

    // Check if game is over (both Ô Quan empty)
    if (isGameOver(finalBoard)) {
      let extraP1: Piece[] = [];
      let extraP2: Piece[] = [];

      const endBoard = finalBoard.map(p => {
        if (p.id >= 0 && p.id <= 4) {
          extraP1.push(...(Array.isArray(p.pieces) ? p.pieces : []));
          return { ...p, pieces: [] };
        } else if (p.id >= 6 && p.id <= 10) {
          extraP2.push(...(Array.isArray(p.pieces) ? p.pieces : []));
          return { ...p, pieces: [] };
        }
        return p;
      });

      const finalP1Cap = [...currentP1Captured, ...extraP1];
      const finalP2Cap = [...currentP2Captured, ...extraP2];

      setBoard(endBoard);
      boardRef.current = endBoard;
      setP1Captured(finalP1Cap);
      p1CapturedRef.current = finalP1Cap;
      setP2Captured(finalP2Cap);
      p2CapturedRef.current = finalP2Cap;
      setIsVictoryOpen(true);
      setIsGameStarted(false);

      if (gameModeRef.current === 'online' && onlineRoomIdRef.current && moverPlayer === onlinePlayerRoleRef.current) {
        updateOnlineGameState(onlineRoomIdRef.current, {
          board: endBoard,
          p1Captured: finalP1Cap,
          p2Captured: finalP2Cap,
          isGameStarted: false,
        });
      }
      return;
    }

    // Switch turn
    const nextPlayer: PlayerId = moverPlayer === 'p1' ? 'p2' : 'p1';
    let currentBoardState = finalBoard;

    let updatedP1Debt = p1DebtRef.current;
    let updatedP2Debt = p2DebtRef.current;
    let updatedP1Captured = currentP1Captured;
    let updatedP2Captured = currentP2Captured;

    // Check if next player's side is empty -> Replenish 5 Dân
    if (isSideEmpty(currentBoardState, nextPlayer)) {
      soundEngine.playReplenish();

      const startIdx = nextPlayer === 'p1' ? 0 : 6;
      const updatedBoard = currentBoardState.map(p => {
        if (p.id >= startIdx && p.id <= startIdx + 4) {
          return {
            ...p,
            pieces: [
              {
                id: `replenish-${p.id}-${Date.now()}`,
                type: 'dan' as const,
                gender: p.id % 2 === 0 ? ('male' as const) : ('female' as const),
                variant: 1,
              },
            ],
          };
        }
        return p;
      });

      currentBoardState = updatedBoard;
      setBoard(updatedBoard);
      boardRef.current = updatedBoard;

      // Account for 5 Dân used from score stash or debt
      if (nextPlayer === 'p1') {
        if (updatedP1Captured.length >= 5) {
          updatedP1Captured = updatedP1Captured.slice(0, updatedP1Captured.length - 5);
        } else {
          const needed = 5 - updatedP1Captured.length;
          updatedP1Captured = [];
          updatedP1Debt += needed;
        }
        setP1Captured(updatedP1Captured);
        p1CapturedRef.current = updatedP1Captured;
        setP1Debt(updatedP1Debt);
        p1DebtRef.current = updatedP1Debt;
      } else {
        if (updatedP2Captured.length >= 5) {
          updatedP2Captured = updatedP2Captured.slice(0, updatedP2Captured.length - 5);
        } else {
          const needed = 5 - updatedP2Captured.length;
          updatedP2Captured = [];
          updatedP2Debt += needed;
        }
        setP2Captured(updatedP2Captured);
        p2CapturedRef.current = updatedP2Captured;
        setP2Debt(updatedP2Debt);
        p2DebtRef.current = updatedP2Debt;
      }
    }

    setCurrentPlayer(nextPlayer);
    currentPlayerRef.current = nextPlayer;

    // Sync state to Firebase if online and I am the mover
    if (gameModeRef.current === 'online' && onlineRoomIdRef.current && moverPlayer === onlinePlayerRoleRef.current) {
      updateOnlineGameState(onlineRoomIdRef.current, {
        board: currentBoardState,
        currentPlayer: nextPlayer,
        p1Captured: updatedP1Captured,
        p2Captured: updatedP2Captured,
        p1Debt: updatedP1Debt,
        p2Debt: updatedP2Debt,
        isGameStarted: true,
      });
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (!isGameStarted || isAnimating || isVictoryOpen) return;

    const timer = setInterval(() => {
      if (currentPlayer === 'p1') {
        setP1TimeRemaining(prev => {
          if (prev <= 1) {
            setSelectedPit(null);
            finishTurn(board, p1Captured, p2Captured, currentPlayer);
            return timerDuration;
          }
          return prev - 1;
        });
      } else {
        setP2TimeRemaining(prev => {
          if (prev <= 1) {
            setSelectedPit(null);
            finishTurn(board, p1Captured, p2Captured, currentPlayer);
            return timerDuration;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, isAnimating, isVictoryOpen, currentPlayer, board, timerDuration, p1Captured, p2Captured]);

  // AI Turn Execution
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'p2' && !isAnimating && !isVictoryOpen && isGameStarted) {
      const aiMove = getAIMove(board, aiDifficulty);

      if (aiMove) {
        const aiTimer = setTimeout(() => {
          executeMove(aiMove.pitIndex, aiMove.direction, 'p2');
        }, 600);

        return () => clearTimeout(aiTimer);
      }
    }
  }, [currentPlayer, gameMode, isAnimating, board, aiDifficulty, isVictoryOpen, isGameStarted]);

  // Calculate scores
  const p1ScoreStats = calculatePiecesScore(p1Captured);
  const p2ScoreStats = calculatePiecesScore(p2Captured);

  const gameStats: GameStats = {
    p1Score: Math.max(0, p1ScoreStats.total - p1Debt),
    p2Score: Math.max(0, p2ScoreStats.total - p2Debt),
    p1Debt,
    p2Debt,
    p1CapturedDan: p1ScoreStats.dan,
    p1CapturedQuan: p1ScoreStats.quan,
    p2CapturedDan: p2ScoreStats.dan,
    p2CapturedQuan: p2ScoreStats.quan,
  };

  return (
    <FolkPaperBackground>
      {/* Header Banner */}
      <header className="relative flex flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1 sm:pb-1.5 border-b-2 border-[#bfa254]/60 text-left pr-10 xs:pr-12 sm:pr-16 short-landscape-header">
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 text-left">
          <div className="text-base xs:text-xl sm:text-3xl md:text-4xl flex-shrink-0 leading-none transition-all duration-200 flag-icon select-none">🎏</div>
          <div className="min-w-0 text-left">
            <h1 className="font-serif font-extrabold text-sm xs:text-base sm:text-2xl text-[#8e2a2a] tracking-tight leading-tight mt-[5px]">
              Trò chơi Ô ĂN QUAN
            </h1>
            <p className="text-[9px] xs:text-xs sm:text-sm text-[#784d28] font-medium leading-tight">
              Giao diện hoạt hình dễ thương
            </p>
          </div>
        </div>

        {/* Top Right Header Logo */}
        <a
          href="https://www.facebook.com/people/Ham-Ch%C6%A1i-Education/100081637728642/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-7 xs:h-9 sm:h-12 w-auto flex items-center hover:opacity-90 transition-opacity"
          title="Ghé thăm Fanpage Ham Chơi Education"
        >
          <img
            src="https://lh3.googleusercontent.com/d/1yOLi510GeFZT7mihMrnhZRKXtel1C6-z"
            alt="Ham Chơi Education Logo"
            referrerPolicy="no-referrer"
            className="h-full w-auto object-contain filter drop-shadow-sm"
          />
        </a>
      </header>

      {/* Unified Game Control & Scoreboard Panel */}
      <GameHeaderPanel
        gameMode={gameMode}
        onSelectGameMode={handleSelectGameMode}
        onStartOnlineGame={handleStartOnlineGame}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onNewGame={handleNewGame}
        isAnimating={isAnimating}
        isGameStarted={isGameStarted}
        onToggleStartGame={handleToggleStartGame}
        p1TimeRemaining={p1TimeRemaining}
        p2TimeRemaining={p2TimeRemaining}
        timerDuration={timerDuration}
        p1Score={gameStats.p1Score}
        p2Score={gameStats.p2Score}
        p1CapturedDan={gameStats.p1CapturedDan}
        p1CapturedQuan={gameStats.p1CapturedQuan}
        p2CapturedDan={gameStats.p2CapturedDan}
        p2CapturedQuan={gameStats.p2CapturedQuan}
        p1Debt={p1Debt}
        p2Debt={p2Debt}
        currentPlayer={currentPlayer}
        p1Color={p1Color}
        p2Color={p2Color}
        onToggleTeamChoice={handleToggleTeamChoice}
        onlinePlayerRole={onlinePlayerRole}
      />

      {/* Online Room Banner if in Online Mode */}
      {gameMode === 'online' && onlineRoomId && (
        <OnlineRoomBanner
          roomId={onlineRoomId}
          playerRole={onlinePlayerRole}
          currentPlayer={currentPlayer}
          p2Joined={Boolean(onlineRoomData?.p2Joined)}
          p1Color={p1Color}
          p2Color={p2Color}
        />
      )}

      {/* Interactive Ô ăn quan Game Board */}
      <Board
        board={board}
        currentPlayer={currentPlayer}
        selectedPit={selectedPit}
        onSelectPit={handleSelectPit}
        onChooseDirection={handleChooseDirection}
        isAnimating={isAnimating}
        currentAnimStep={currentAnimStep}
        validPits={validPits}
        speed={speed}
        p1Color={p1Color}
        p2Color={p2Color}
      />

      {/* Modals & Overlays */}
      <RotateDevicePrompt />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        aiDifficulty={aiDifficulty}
        onChangeDifficulty={setAiDifficulty}
        speed={speed}
        onChangeSpeed={setSpeed}
        timerDuration={timerDuration}
        onChangeTimerDuration={handleChangeTimerDuration}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <VictoryModal
        isOpen={isVictoryOpen}
        stats={gameStats}
        gameMode={gameMode}
        onlinePlayerRole={onlinePlayerRole}
        onPlayAgain={handleNewGame}
      />
    </FolkPaperBackground>
  );
}
