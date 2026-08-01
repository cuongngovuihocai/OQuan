import React from 'react';
import { GameMode, AIDifficulty, AnimationSpeed } from '../types';
import { soundEngine } from '../utils/audio';

interface GameControlsProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  aiDifficulty: AIDifficulty;
  onChangeDifficulty: (diff: AIDifficulty) => void;
  speed: AnimationSpeed;
  onChangeSpeed: (speed: AnimationSpeed) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNewGame: () => void;
  onOpenTutorial: () => void;
  isAnimating: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  onSelectGameMode,
  aiDifficulty,
  onChangeDifficulty,
  speed,
  onChangeSpeed,
  soundEnabled,
  onToggleSound,
  onNewGame,
  onOpenTutorial,
  isAnimating,
}) => {
  return (
    <div className="w-full bg-[#fbeee0] p-3 sm:p-4 rounded-2xl border-2 border-[#cdb499] shadow-md mb-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      {/* Game Mode Selector */}
      <div className="flex items-center gap-1.5 bg-[#f3e5ca] p-1 rounded-xl border border-[#d3be9c]">
        <button
          type="button"
          onClick={() => onSelectGameMode('ai')}
          disabled={isAnimating}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            gameMode === 'ai'
              ? 'bg-[#c0392b] text-white shadow-sm'
              : 'text-[#5c3a21] hover:bg-[#e8d5b5]'
          }`}
        >
          🤖 Đấu với Máy
        </button>
        <button
          type="button"
          onClick={() => onSelectGameMode('local2p')}
          disabled={isAnimating}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            gameMode === 'local2p'
              ? 'bg-[#27ae60] text-white shadow-sm'
              : 'text-[#5c3a21] hover:bg-[#e8d5b5]'
          }`}
        >
          👥 2 Người (Cùng thiết bị)
        </button>
      </div>

      {/* AI Difficulty Selector (Visible in AI mode) */}
      {gameMode === 'ai' && (
        <div className="flex items-center gap-1 bg-[#f3e5ca] px-2 py-1 rounded-xl border border-[#d3be9c]">
          <span className="text-[#5c3a21] font-semibold text-[11px] mr-1">Cấp độ:</span>
          {(['easy', 'medium', 'hard'] as AIDifficulty[]).map(d => (
            <button
              key={d}
              type="button"
              onClick={() => onChangeDifficulty(d)}
              disabled={isAnimating}
              className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer capitalize ${
                aiDifficulty === d
                  ? 'bg-[#d35400] text-white'
                  : 'text-[#784d28] hover:bg-[#e8d5b5]'
              }`}
            >
              {d === 'easy' ? 'Dễ' : d === 'medium' ? 'Vừa' : 'Khó'}
            </button>
          ))}
        </div>
      )}

      {/* Animation Speed Selector */}
      <div className="flex items-center gap-1 bg-[#f3e5ca] px-2 py-1 rounded-xl border border-[#d3be9c]">
        <span className="text-[#5c3a21] font-semibold text-[11px] mr-1">Tốc độ:</span>
        {(['slow', 'normal'] as AnimationSpeed[]).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeSpeed(s)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer capitalize ${
              speed === s
                ? 'bg-[#8e44ad] text-white'
                : 'text-[#784d28] hover:bg-[#e8d5b5]'
            }`}
          >
            {s === 'slow' ? 'Chậm' : 'Vừa'}
          </button>
        ))}
      </div>

      {/* Action Buttons: Sound, Help, Reset */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSound}
          className="w-8 h-8 rounded-xl bg-[#f3e5ca] hover:bg-[#e8d5b5] text-[#5c3a21] font-bold border border-[#d3be9c] cursor-pointer text-sm flex items-center justify-center"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        <button
          type="button"
          onClick={onOpenTutorial}
          className="px-3 py-1.5 rounded-xl bg-[#2980b9] hover:bg-[#2471a3] text-white font-bold shadow-sm cursor-pointer flex items-center gap-1"
        >
          <span>📖 Hướng Dẫn</span>
        </button>

        <button
          type="button"
          onClick={onNewGame}
          disabled={isAnimating}
          className="px-3 py-1.5 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white font-bold shadow-sm cursor-pointer flex items-center gap-1"
        >
          <span>🔄 Ván Mới</span>
        </button>
      </div>
    </div>
  );
};
