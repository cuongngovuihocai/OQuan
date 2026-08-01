import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PitState, PlayerId, Piece, MoveStep, AnimationSpeed, TeamColor } from '../types';
import { QuanPalacePit, DanCottagePit } from './PitBuilding';
import { RenderPieceItem } from './CuteCharacters';
import { soundEngine } from '../utils/audio';
import { createInitialBoard } from '../utils/gameRules';

interface BoardProps {
  board: PitState[];
  currentPlayer: PlayerId;
  selectedPit: number | null;
  onSelectPit: (pitIndex: number) => void;
  onChooseDirection: (direction: 'clockwise' | 'counterclockwise') => void;
  isAnimating: boolean;
  currentAnimStep: MoveStep | null;
  validPits: number[];
  speed: AnimationSpeed;
  p1Color: TeamColor;
  p2Color: TeamColor;
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  selectedPit,
  onSelectPit,
  onChooseDirection,
  isAnimating,
  currentAnimStep,
  validPits,
  speed,
  p1Color,
  p2Color,
}) => {
  // Normalize and guard board state against missing elements or undefined properties
  const safeBoard: PitState[] = useMemo(() => {
    if (!Array.isArray(board) || board.length !== 12) {
      return createInitialBoard();
    }
    return board.map((pit, idx) => ({
      id: typeof pit?.id === 'number' ? pit.id : idx,
      isQuanPit: typeof pit?.isQuanPit === 'boolean' ? pit.isQuanPit : (idx === 5 || idx === 11),
      owner: pit?.owner !== undefined ? pit.owner : (idx >= 0 && idx <= 4 ? 'p1' : idx >= 6 && idx <= 10 ? 'p2' : null),
      pieces: Array.isArray(pit?.pieces) ? pit.pieces.filter(Boolean) : [],
    }));
  }, [board]);

  const topRowIndices = [10, 9, 8, 7, 6];
  const bottomRowIndices = [0, 1, 2, 3, 4];

  // Helper to trigger audio on animation steps
  React.useEffect(() => {
    if (isAnimating && currentAnimStep) {
      if (currentAnimStep.action === 'drop') {
        if (currentAnimStep.activePieceType === 'quan') {
          soundEngine.playQuanWaddle();
        } else {
          soundEngine.playDanHop();
        }
      } else if (currentAnimStep.action === 'eat') {
        const hasQuan = currentAnimStep.piecesEaten?.some(p => p.type === 'quan');
        soundEngine.playEat(hasQuan);
      } else if (currentAnimStep.action === 'pickup') {
        soundEngine.playSelect();
      }
    }
  }, [currentAnimStep, isAnimating]);

  const p1TeamName = p1Color === 'red' ? 'ĐỎ' : 'XANH';
  const p2TeamName = p2Color === 'red' ? 'ĐỎ' : 'XANH';

  return (
    <div className="relative w-full my-0">
      {/* Commentary & Action Ticker Banner */}
      <div className="w-full mb-[16px] px-3 rounded-xl bg-[#4a2e1b] text-[#fef9e7] border-2 border-[#bfa254] shadow flex items-center justify-between gap-2 overflow-hidden h-11 sm:h-12 flex-shrink-0 short-landscape-ticker">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-base sm:text-lg flex-shrink-0">📜</span>
          <span className="text-xs sm:text-sm font-medium italic text-[#f3e5ca] truncate">
            {isAnimating && currentAnimStep
              ? currentAnimStep.description
              : selectedPit !== null
              ? 'Hãy chọn hướng rải quân (Sang Trái hay Sang Phải)'
              : currentPlayer === 'p1'
              ? `Lượt của Đội ${p1TeamName}: Hãy bấm chọn 1 nhà có Dân ở hàng dưới để đi.`
              : `Lượt của Đội ${p2TeamName}: Hãy chọn 1 nhà có Dân ở hàng trên.`}
          </span>
        </div>
        {isAnimating && (
          <span className="text-[10px] sm:text-xs font-bold text-[#f1c40f] bg-[#6d4120] px-2 py-0.5 rounded-full flex-shrink-0">
            ⚙️ Đang rải...
          </span>
        )}
      </div>

      {/* Main Game Board Layout */}
      <div className="relative p-2 sm:p-4 rounded-3xl border-4 border-[#784d28] shadow-2xl overflow-hidden bg-[#e5cfab] short-landscape-board">
        {/* Soft Background Image Layer with Reduced Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/d/1uXkbUjkCEqTqPl1Bga0R50NWoPu7-Y3y')`,
          }}
        />

        {/* Subtle Warm Overlay for contrast */}
        <div className="absolute inset-0 bg-[#f7ebd4]/10 pointer-events-none" />

        <div className="grid grid-cols-12 gap-1 sm:gap-2 md:gap-3 items-stretch relative z-10">
          {/* LEFT Ô QUAN (Pit 11 - Nam Tả: Quan Ông) -> Color Scheme matches P2 Team */}
          <div className="col-span-2">
            <QuanPalacePit
              title="QUAN ÔNG (TẢ)"
              sideName="Ô 12"
              count={(safeBoard[11]?.pieces || []).length}
              isTargeted={currentAnimStep?.pitIndex === 11}
              isHandSlamming={currentAnimStep?.pitIndex === 11 && currentAnimStep?.action === 'slam'}
            >
              {(safeBoard[11]?.pieces || []).map((p, idx) => (
                <RenderPieceItem
                  key={p.id || idx}
                  piece={p}
                  isMoving={currentAnimStep?.pitIndex === 11}
                  size="md"
                  colorScheme={p.type === 'quan' ? (p.variant === 1 ? p1Color : p2Color) : undefined}
                />
              ))}
            </QuanPalacePit>
          </div>

          {/* MIDDLE 10 Ô DÂN HOUSES */}
          <div className="col-span-8 flex flex-col justify-between gap-1.5 sm:gap-2 md:gap-3">
            {/* TOP ROW (Pits 10, 9, 8, 7, 6 - P2 Side) */}
            <div className={`grid grid-cols-5 gap-0.5 sm:gap-1.5 md:gap-2 p-1 sm:p-2 rounded-xl sm:rounded-2xl border-2 shadow-inner ${
              p2Color === 'blue'
                ? 'bg-gradient-to-r from-[#e0f2fe]/60 via-[#dbeafe]/80 to-[#e0f2fe]/60 border-[#93c5fd]/50'
                : 'bg-gradient-to-r from-[#ffe4e6]/50 via-[#fecdd3]/60 to-[#ffe4e6]/50 border-[#fca5a5]/50'
            }`}>
              {topRowIndices.map(pitIdx => {
                const isOwner = currentPlayer === 'p2';
                const canSelect = isOwner && validPits.includes(pitIdx) && !isAnimating;
                const isSelected = selectedPit === pitIdx;
                const isTargeted = currentAnimStep?.pitIndex === pitIdx;
                const isHandSlamming = currentAnimStep?.pitIndex === pitIdx && currentAnimStep?.action === 'slam';
                const pitPieces = safeBoard[pitIdx]?.pieces || [];

                return (
                  <DanCottagePit
                    key={pitIdx}
                    pitIndex={pitIdx}
                    pitLabel={`Ô ${pitIdx + 1}`}
                    count={pitPieces.length}
                    isCurrentPlayerSide={isOwner}
                    canSelect={canSelect}
                    isSelected={isSelected}
                    isTargeted={isTargeted}
                    isHandSlamming={isHandSlamming}
                    onClick={() => onSelectPit(pitIdx)}
                    team={p2Color}
                  >
                    {pitPieces.map((p, idx) => (
                      <RenderPieceItem
                        key={p.id || idx}
                        piece={p}
                        isMoving={isTargeted}
                        size="sm"
                        colorScheme={p.type === 'quan' ? (p.variant === 1 ? p1Color : p2Color) : undefined}
                      />
                    ))}
                  </DanCottagePit>
                );
              })}
            </div>

            {/* DIVIDER RIVER / ROAD WITH FOLK ACCENTS */}
            <div className="w-full py-0.5 sm:py-1 px-1.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#cbb087]/60 border-y sm:border-y-2 border-[#a88258] flex items-center justify-between text-[8px] xs:text-[10px] sm:text-xs font-serif font-bold text-[#5c3a21] short-landscape-river">
              <span className="truncate min-w-0">◄ HÀNG TRÊN (ĐỘI {p2TeamName})</span>
              {isAnimating && currentAnimStep && currentAnimStep.handCount !== undefined ? (
                <span className="bg-gradient-to-r from-[#c0392b] to-[#922b21] text-white px-2.5 sm:px-4 py-0.5 rounded-full font-black text-[9px] xs:text-xs sm:text-sm shadow-md border sm:border-2 border-[#f1c40f] flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 z-10 mx-1">
                  <span className="whitespace-nowrap">✊ Trên tay:</span>
                  <span className="bg-[#f1c40f] text-[#78281f] px-1.5 rounded font-extrabold text-xs sm:text-base leading-none py-0.5">
                    {currentAnimStep.handCount}
                  </span>
                </span>
              ) : (
                <span className="tracking-widest opacity-70 hidden xs:inline whitespace-nowrap flex-shrink-0 px-1">❖ DÒNG SÔNG QUAN HỌ ❖</span>
              )}
              <span className="truncate min-w-0 text-right">HÀNG DƯỚI (ĐỘI {p1TeamName}) ►</span>
            </div>

            {/* BOTTOM ROW (Pits 0, 1, 2, 3, 4 - P1 Side) */}
            <div className={`grid grid-cols-5 gap-0.5 sm:gap-1.5 md:gap-2 p-1 sm:p-2 rounded-xl sm:rounded-2xl border-2 shadow-inner ${
              p1Color === 'red'
                ? 'bg-gradient-to-r from-[#ffe4e6]/50 via-[#fecdd3]/60 to-[#ffe4e6]/50 border-[#fca5a5]/50'
                : 'bg-gradient-to-r from-[#e0f2fe]/60 via-[#dbeafe]/80 to-[#e0f2fe]/60 border-[#93c5fd]/50'
            }`}>
              {bottomRowIndices.map(pitIdx => {
                const isOwner = currentPlayer === 'p1';
                const canSelect = isOwner && validPits.includes(pitIdx) && !isAnimating;
                const isSelected = selectedPit === pitIdx;
                const isTargeted = currentAnimStep?.pitIndex === pitIdx;
                const isHandSlamming = currentAnimStep?.pitIndex === pitIdx && currentAnimStep?.action === 'slam';
                const pitPieces = safeBoard[pitIdx]?.pieces || [];

                return (
                  <DanCottagePit
                    key={pitIdx}
                    pitIndex={pitIdx}
                    pitLabel={`Ô ${pitIdx + 1}`}
                    count={pitPieces.length}
                    isCurrentPlayerSide={isOwner}
                    canSelect={canSelect}
                    isSelected={isSelected}
                    isTargeted={isTargeted}
                    isHandSlamming={isHandSlamming}
                    onClick={() => onSelectPit(pitIdx)}
                    team={p1Color}
                  >
                    {pitPieces.map((p, idx) => (
                      <RenderPieceItem
                        key={p.id || idx}
                        piece={p}
                        isMoving={isTargeted}
                        size="sm"
                        colorScheme={p.type === 'quan' ? (p.variant === 1 ? p1Color : p2Color) : undefined}
                      />
                    ))}
                  </DanCottagePit>
                );
              })}
            </div>
          </div>

          {/* RIGHT Ô QUAN (Pit 5 - Nữ Hữu: Quan Bà) -> Color Scheme matches P1 Team */}
          <div className="col-span-2">
            <QuanPalacePit
              title="QUAN BÀ (HỮU)"
              sideName="Ô 6"
              count={(safeBoard[5]?.pieces || []).length}
              isTargeted={currentAnimStep?.pitIndex === 5}
              isHandSlamming={currentAnimStep?.pitIndex === 5 && currentAnimStep?.action === 'slam'}
            >
              {(safeBoard[5]?.pieces || []).map((p, idx) => (
                <RenderPieceItem
                  key={p.id || idx}
                  piece={p}
                  isMoving={currentAnimStep?.pitIndex === 5}
                  size="md"
                  colorScheme={p.type === 'quan' ? (p.variant === 1 ? p1Color : p2Color) : undefined}
                />
              ))}
            </QuanPalacePit>
          </div>
        </div>

        {/* DIRECTION CHOICE DIALOG POPUP OVERLAY */}
        <AnimatePresence>
          {selectedPit !== null && !isAnimating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              onClick={() => onSelectPit(-1)}
              className="absolute inset-0 bg-[#3a2510]/60 backdrop-blur-xs z-30 flex items-center justify-center p-4 rounded-3xl cursor-pointer"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#fef9e7] p-5 rounded-2xl border-4 border-[#b87333] shadow-2xl max-w-sm w-full text-center cursor-default"
              >
                <h3 className="font-serif font-extrabold text-lg text-[#5c3a21] mb-1">
                  Chọn Hướng Rải Quân
                </h3>
                <p className="text-sm text-[#784d28] mb-4">
                  Bạn vừa chọn <span className="font-bold text-[#c0392b]">Ô số {selectedPit + 1}</span> (có {(safeBoard[selectedPit]?.pieces || []).length} quân). Vui lòng chọn hướng đi:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      (e.currentTarget as HTMLElement).blur();
                      const isTopRow = selectedPit !== null && selectedPit >= 6 && selectedPit <= 10;
                      onChooseDirection(isTopRow ? 'clockwise' : 'counterclockwise');
                    }}
                    className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#e67e22] to-[#d35400] text-white font-bold text-base hover:brightness-110 active:scale-95 shadow-md flex flex-col items-center justify-center gap-1.5 border border-[#b87333] cursor-pointer"
                  >
                    <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                    <span>Rải quân sang Trái</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      (e.currentTarget as HTMLElement).blur();
                      const isTopRow = selectedPit !== null && selectedPit >= 6 && selectedPit <= 10;
                      onChooseDirection(isTopRow ? 'counterclockwise' : 'clockwise');
                    }}
                    className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#27ae60] to-[#1e8449] text-white font-bold text-base hover:brightness-110 active:scale-95 shadow-md flex flex-col items-center justify-center gap-1.5 border border-[#1e8449] cursor-pointer"
                  >
                    <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                    <span>Rải quân sang Phải</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    (e.currentTarget as HTMLElement).blur();
                    onSelectPit(-1);
                  }}
                  className="mt-4 text-base font-semibold text-[#8e44ad] hover:underline cursor-pointer"
                >
                  ✖ Chọn ô khác
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
