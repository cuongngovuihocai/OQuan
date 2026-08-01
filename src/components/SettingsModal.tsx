import React, { useState } from 'react';
import { AIDifficulty, AnimationSpeed } from '../types';
import { Settings, X, Volume2, VolumeX, Zap, Shield, Timer, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Current values
  aiDifficulty: AIDifficulty;
  onChangeDifficulty: (diff: AIDifficulty) => void;
  speed: AnimationSpeed;
  onChangeSpeed: (speed: AnimationSpeed) => void;
  timerDuration: number; // in seconds
  onChangeTimerDuration: (seconds: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  aiDifficulty,
  onChangeDifficulty,
  speed,
  onChangeSpeed,
  timerDuration,
  onChangeTimerDuration,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  // Track timer preset choice: 30, 60, 90, 120, or 'custom'
  const isPreset = [30, 60, 90, 120].includes(timerDuration);
  const [selectedTimerPreset, setSelectedTimerPreset] = useState<number | 'custom'>(
    isPreset ? timerDuration : 'custom'
  );
  const [customInputSeconds, setCustomInputSeconds] = useState<string>(
    isPreset ? '60' : String(timerDuration)
  );

  const handleTimerPresetChange = (preset: number | 'custom') => {
    setSelectedTimerPreset(preset);
    if (typeof preset === 'number') {
      onChangeTimerDuration(preset);
    } else {
      const val = parseInt(customInputSeconds, 10);
      if (!isNaN(val) && val > 0) {
        onChangeTimerDuration(val);
      }
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomInputSeconds(valStr);
    const val = parseInt(valStr, 10);
    if (!isNaN(val) && val > 0) {
      onChangeTimerDuration(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#fdf8f2] rounded-2xl border-3 border-[#cdb499] shadow-2xl overflow-hidden text-[#5c3a21]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#f3e5ca] to-[#ead3ab] border-b-2 border-[#cdb499]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#8e2a2a] text-white rounded-xl shadow-xs">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <h2 className="font-serif font-extrabold text-lg text-[#8e2a2a]">
              Tuỳ chỉnh Trò chơi
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#d3be9c]/40 text-[#8e2a2a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 1. Cấp độ chơi */}
          <div className="bg-[#f3e5ca]/60 p-3.5 rounded-xl border border-[#d3be9c]/80 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#d35400]" />
              <label className="font-serif font-bold text-sm text-[#784d28]">
                Cấp độ chơi
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy', label: 'Dễ' },
                { id: 'medium', label: 'Trung bình' },
                { id: 'hard', label: 'Khó' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeDifficulty(item.id as AIDifficulty)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    aiDifficulty === item.id
                      ? 'bg-[#d35400] text-white border-[#b04500] shadow-sm scale-[1.02]'
                      : 'bg-[#fdf8f2] text-[#5c3a21] border-[#d3be9c] hover:bg-[#e8d5b5]'
                  }`}
                >
                  {aiDifficulty === item.id && <Check className="w-3.5 h-3.5" />}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Tốc độ rải quân */}
          <div className="bg-[#f3e5ca]/60 p-3.5 rounded-xl border border-[#d3be9c]/80 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8e44ad]" />
              <label className="font-serif font-bold text-sm text-[#784d28]">
                Tốc độ rải quân
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slow', label: 'Chậm' },
                { id: 'normal', label: 'Bình thường' },
                { id: 'fast', label: 'Nhanh' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeSpeed(item.id as AnimationSpeed)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    speed === item.id
                      ? 'bg-[#8e44ad] text-white border-[#71368a] shadow-sm scale-[1.02]'
                      : 'bg-[#fdf8f2] text-[#5c3a21] border-[#d3be9c] hover:bg-[#e8d5b5]'
                  }`}
                >
                  {speed === item.id && <Check className="w-3.5 h-3.5" />}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cài đặt thời gian */}
          <div className="bg-[#f3e5ca]/60 p-3.5 rounded-xl border border-[#d3be9c]/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#2980b9]" />
              <label className="font-serif font-bold text-sm text-[#784d28]">
                Cài đặt thời gian lượt chơi
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 30, label: '30s' },
                { val: 60, label: '60s' },
                { val: 90, label: '90s' },
                { val: 120, label: '120s' },
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleTimerPresetChange(item.val)}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    selectedTimerPreset === item.val
                      ? 'bg-[#2980b9] text-white border-[#1f6391] shadow-sm scale-[1.02]'
                      : 'bg-[#fdf8f2] text-[#5c3a21] border-[#d3be9c] hover:bg-[#e8d5b5]'
                  }`}
                >
                  {selectedTimerPreset === item.val && <Check className="w-3 h-3" />}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Ô Tự nhập thời gian */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleTimerPresetChange('custom')}
                className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-between border ${
                  selectedTimerPreset === 'custom'
                    ? 'bg-[#16a085] text-white border-[#117a65]'
                    : 'bg-[#fdf8f2] text-[#5c3a21] border-[#d3be9c] hover:bg-[#e8d5b5]'
                }`}
              >
                <span>⏱️ Tự nhập thời gian</span>
                {selectedTimerPreset === 'custom' && <Check className="w-4 h-4" />}
              </button>

              {selectedTimerPreset === 'custom' && (
                <div className="mt-2 flex items-center gap-2 bg-[#fdf8f2] p-2 rounded-xl border border-[#16a085]">
                  <span className="text-xs font-semibold text-[#5c3a21]">Số giây:</span>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={customInputSeconds}
                    onChange={handleCustomInputChange}
                    className="w-24 px-2 py-1 bg-white border border-[#cdb499] rounded-lg text-xs font-bold text-center text-[#8e2a2a] focus:outline-none focus:ring-2 focus:ring-[#16a085]"
                    placeholder="Giây"
                  />
                  <span className="text-xs text-[#784d28] font-medium">(từ 5s - 600s)</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Cài đặt âm thanh */}
          <div className="bg-[#f3e5ca]/60 p-3.5 rounded-xl border border-[#d3be9c]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#27ae60]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#c0392b]" />
              )}
              <label className="font-serif font-bold text-sm text-[#784d28]">
                Âm thanh trò chơi
              </label>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fdf8f2] p-1 rounded-xl border border-[#d3be9c]">
              <button
                type="button"
                onClick={() => {
                  if (!soundEnabled) onToggleSound();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  soundEnabled
                    ? 'bg-[#27ae60] text-white shadow-xs'
                    : 'text-[#5c3a21] hover:bg-[#e8d5b5]'
                }`}
              >
                Mở
              </button>
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) onToggleSound();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  !soundEnabled
                    ? 'bg-[#c0392b] text-white shadow-xs'
                    : 'text-[#5c3a21] hover:bg-[#e8d5b5]'
                }`}
              >
                Tắt
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f3e5ca] border-t border-[#cdb499] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#8e2a2a] hover:bg-[#722121] text-white font-serif font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            Đóng & Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
