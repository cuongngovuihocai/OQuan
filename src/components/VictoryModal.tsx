import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { GameStats, PlayerId, GameMode } from '../types';
import { QuanCharacter } from './CuteCharacters';
import { soundEngine } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  stats: GameStats;
  gameMode: GameMode;
  onlinePlayerRole?: PlayerId;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stats,
  gameMode,
  onlinePlayerRole,
  onPlayAgain,
}) => {
  const p1Final = stats.p1Score;
  const p2Final = stats.p2Score;
  const isSpectator = gameMode === 'online' && onlinePlayerRole === 'spectator';

  let winner: PlayerId | 'draw' = 'draw';
  if (p1Final > p2Final) winner = 'p1';
  else if (p2Final > p1Final) winner = 'p2';

  useEffect(() => {
    if (isOpen) {
      soundEngine.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#3a2510]/80 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 30 }}
          className="bg-[#fef9e7] border-4 border-[#b87333] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative text-[#4a2e1b]"
        >
          {/* Winner Header Graphic */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-20 h-20 mb-2">
              {winner === 'p1' ? (
                <QuanCharacter colorScheme="red" isMoving={true} size="lg" />
              ) : winner === 'p2' ? (
                <QuanCharacter colorScheme="blue" isMoving={true} size="lg" />
              ) : (
                <div className="text-5xl">🤝</div>
              )}
            </div>

            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#8e2a2a]">
              {winner === 'p1'
                ? '🎉 ĐỘI ĐỎ CHIẾN THẮNG!'
                : winner === 'p2'
                ? gameMode === 'ai'
                  ? '🤖 MÁY CHIẾN THẮNG!'
                  : '🎉 ĐỘI XANH CHIẾN THẮNG!'
                : '🤝 HÒA NHAU - BẤT PHÂN THẮNG BẠI!'}
            </h2>
            <p className="text-xs sm:text-sm text-[#784d28] font-medium mt-1">
              Hết quan! Toàn dân - Thu quân, kéo về!
            </p>
          </div>

          {/* Detailed Score Breakdown Card */}
          <div className="grid grid-cols-2 gap-3 my-5 p-4 rounded-2xl bg-[#f4e4c1]/70 border-2 border-[#d3be9c]">
            {/* P1 Stats */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-[#fadbd8]/80 border border-[#e74c3c]">
              <span className="font-serif font-bold text-xs text-[#78281f]">ĐỘI ĐỎ</span>
              <div className="text-3xl font-extrabold text-[#922b21] my-1">{p1Final} điểm</div>
              <div className="text-[11px] text-[#78281f] space-y-0.5">
                <p>Quan: {stats.p1CapturedQuan} ({stats.p1CapturedQuan * 10} điểm)</p>
                <p>Dân: {stats.p1CapturedDan} ({stats.p1CapturedDan} điểm)</p>
                {stats.p1Debt > 0 && <p className="text-[#c0392b] font-bold">Trừ nợ: -{stats.p1Debt} điểm</p>}
              </div>
            </div>

            {/* P2 Stats */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-[#d4efdf]/80 border border-[#27ae60]">
              <span className="font-serif font-bold text-xs text-[#145a32]">
                {gameMode === 'ai' ? 'ĐỘI XANH (MÁY)' : 'ĐỘI XANH'}
              </span>
              <div className="text-3xl font-extrabold text-[#196f3d] my-1">{p2Final} điểm</div>
              <div className="text-[11px] text-[#145a32] space-y-0.5">
                <p>Quan: {stats.p2CapturedQuan} ({stats.p2CapturedQuan * 10} điểm)</p>
                <p>Dân: {stats.p2CapturedDan} ({stats.p2CapturedDan} điểm)</p>
                {stats.p2Debt > 0 && <p className="text-[#27ae60] font-bold">Trừ nợ: -{stats.p2Debt} điểm</p>}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onPlayAgain}
            disabled={isSpectator}
            className={`w-full py-3 rounded-2xl font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
              isSpectator
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-[#c0392b] to-[#e67e22] text-white hover:brightness-110 active:scale-95 cursor-pointer'
            }`}
            title={isSpectator ? 'Khán giả chỉ có thể theo dõi' : undefined}
          >
            <span>🔄</span> {isSpectator ? 'ĐANG XEM TRẬN ĐẤU (KHÁN GIẢ)' : 'CHƠI VÁN MỚI'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
