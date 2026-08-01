import React from 'react';
import { PlayerId, GameMode } from '../types';
import { QuanCharacter, DanCharacter } from './CuteCharacters';

interface ScoreBoardProps {
  p1Score: number;
  p2Score: number;
  p1CapturedDan: number;
  p1CapturedQuan: number;
  p2CapturedDan: number;
  p2CapturedQuan: number;
  p1Debt: number;
  p2Debt: number;
  currentPlayer: PlayerId;
  gameMode: GameMode;
  isAnimating: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  p1Score,
  p2Score,
  p1CapturedDan,
  p1CapturedQuan,
  p2CapturedDan,
  p2CapturedQuan,
  p1Debt,
  p2Debt,
  currentPlayer,
  gameMode,
  isAnimating,
}) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {/* Player 1 (Bottom / Đội Đỏ - Người Chơi) */}
      <div
        className={`relative p-3 sm:p-4 rounded-2xl border-3 transition-all duration-300 shadow-md flex items-center justify-between ${
          currentPlayer === 'p1'
            ? 'bg-gradient-to-r from-[#fadbd8] to-[#f5b7b1] border-[#c0392b] ring-4 ring-[#e74c3c]/30'
            : 'bg-[#fdf2e9] border-[#f5b7b1] opacity-85'
        }`}
      >
        {/* Left Side: Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <QuanCharacter colorScheme="red" size="sm" />
            {currentPlayer === 'p1' && (
              <span className="absolute -top-2 -right-1 bg-[#c0392b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                Đến lượt!
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-extrabold text-base text-[#78281f]">
                Đội Đỏ (Bạn)
              </h3>
            </div>
            <p className="text-[13px] text-[#922b21] font-medium">
              {p1CapturedQuan} Quan, {p1CapturedDan} Dân
            </p>
            {p1Debt > 0 && (
              <p className="text-[10px] text-[#c0392b] font-bold bg-[#fadbd8] px-1.5 py-0.2 rounded border border-[#e74c3c] mt-0.5 inline-block">
                ⚠️ Đang nợ: -{p1Debt} điểm
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Score Box */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#78281f] font-semibold uppercase tracking-wider">Điểm số</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#922b21] bg-[#f9ebea] px-3 py-1 rounded-xl border-2 border-[#e74c3c] shadow-inner">
            {p1Score}
          </div>
        </div>
      </div>

      {/* Player 2 (Top / Đội Xanh - Máy / Bạn Bè) */}
      <div
        className={`relative p-3 sm:p-4 rounded-2xl border-3 transition-all duration-300 shadow-md flex items-center justify-between ${
          currentPlayer === 'p2'
            ? 'bg-gradient-to-r from-[#d6eaf8] to-[#aed6f1] border-[#2980b9] ring-4 ring-[#3498db]/30'
            : 'bg-[#ebf5fb] border-[#aed6f1] opacity-85'
        }`}
      >
        {/* Left Side: Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <QuanCharacter colorScheme="blue" size="sm" />
            {currentPlayer === 'p2' && (
              <span className="absolute -top-2 -right-1 bg-[#2980b9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                Đến lượt!
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-extrabold text-base text-[#1b4f72]">
                {gameMode === 'ai' ? 'Đội Xanh (Máy AI)' : 'Đội Xanh (Bạn 2)'}
              </h3>
            </div>
            <p className="text-[13px] text-[#21618c] font-medium">
              {p2CapturedQuan} Quan, {p2CapturedDan} Dân
            </p>
            {p2Debt > 0 && (
              <p className="text-[10px] text-[#2980b9] font-bold bg-[#d6eaf8] px-1.5 py-0.2 rounded border border-[#3498db] mt-0.5 inline-block">
                ⚠️ Đang nợ: -{p2Debt} điểm
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Score Box */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#1b4f72] font-semibold uppercase tracking-wider">Điểm số</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1b4f72] bg-[#ebf5fb] px-3 py-1 rounded-xl border-2 border-[#3498db] shadow-inner">
            {p2Score}
          </div>
        </div>
      </div>
    </div>
  );
};
