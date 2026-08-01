import React from 'react';
import { GameMode, PlayerId, TeamColor } from '../types';
import { QuanCharacter } from './CuteCharacters';
import { Settings, Play, Pause, BookOpen, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { TEAM_THEMES } from '../utils/teamColors';

interface GameHeaderPanelProps {
  // Game Mode & Actions
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  onStartOnlineGame: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onNewGame: () => void;
  isAnimating: boolean;

  // Game Start & Timer State
  isGameStarted: boolean;
  onToggleStartGame: () => void;
  p1TimeRemaining: number; // in seconds
  p2TimeRemaining: number; // in seconds
  timerDuration: number;   // max time in seconds

  // Scoreboard Stats
  p1Score: number;
  p2Score: number;
  p1CapturedDan: number;
  p1CapturedQuan: number;
  p2CapturedDan: number;
  p2CapturedQuan: number;
  p1Debt: number;
  p2Debt: number;
  currentPlayer: PlayerId;

  // Team Colors
  p1Color: TeamColor;
  p2Color: TeamColor;
  onToggleTeamChoice: () => void;
  onlinePlayerRole?: PlayerId;
}

export const GameHeaderPanel: React.FC<GameHeaderPanelProps> = ({
  gameMode,
  onSelectGameMode,
  onStartOnlineGame,
  onOpenSettings,
  onOpenTutorial,
  onNewGame,
  isAnimating,
  isGameStarted,
  onToggleStartGame,
  p1TimeRemaining,
  p2TimeRemaining,
  timerDuration,
  p1Score,
  p2Score,
  p1CapturedDan,
  p1CapturedQuan,
  p2CapturedDan,
  p2CapturedQuan,
  p1Debt,
  p2Debt,
  currentPlayer,
  p1Color,
  p2Color,
  onToggleTeamChoice,
  onlinePlayerRole,
}) => {
  const [isTwoPlayerMenuOpen, setIsTwoPlayerMenuOpen] = React.useState(false);
  const isSpectator = gameMode === 'online' && onlinePlayerRole === 'spectator';
  const canToggleTeam = gameMode !== 'online';
  const theme1 = TEAM_THEMES[p1Color] || TEAM_THEMES.red;
  const theme2 = TEAM_THEMES[p2Color] || TEAM_THEMES.blue;

  // Calculate percentage remaining for time progress bars
  const p1TimePct = Math.min(100, Math.max(0, (p1TimeRemaining / (timerDuration || 60)) * 100));
  const p2TimePct = Math.min(100, Math.max(0, (p2TimeRemaining / (timerDuration || 60)) * 100));

  // Format seconds as '60s', '30s', etc.
  const formatTime = (secs: number) => {
    return `${secs}s`;
  };

  return (
    <div className="w-full bg-[#fbeee0] p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-[#cdb499] shadow-md mb-2.5 sm:mb-3 text-xs sm:text-sm h-auto min-h-[90px] sm:min-h-[110px] relative short-landscape-panel">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 sm:gap-3 w-full">
        {/* Left Column: Arranged into 2 rows with grid layout to guarantee flexible responsiveness */}
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full lg:w-[48%] xl:w-[46%] xl:max-w-[460px] flex-none">
          {/* HÀNG TRÊN: Nút chọn chế độ chơi + Nút Hướng dẫn */}
          <div className="grid grid-cols-3 gap-1 xs:gap-1.5 sm:gap-2 w-full">
            {/* Game Mode Selector (Chiếm 2 cột) */}
            <div className="col-span-2 relative flex items-center justify-between gap-0.5 sm:gap-1 bg-[#f3e5ca] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-[#d3be9c] min-w-0">
              <button
                type="button"
                onClick={() => {
                  onSelectGameMode('ai');
                  setIsTwoPlayerMenuOpen(false);
                }}
                disabled={isAnimating}
                className={`flex-1 min-w-0 py-1 sm:py-1.5 px-0.5 xs:px-1 sm:px-2 rounded-md sm:rounded-lg font-bold transition-all cursor-pointer text-[9px] xs:text-[10px] sm:text-xs text-center truncate ${
                  gameMode === 'ai'
                    ? 'bg-[#c0392b] text-white shadow-xs'
                    : 'text-[#5c3a21] hover:bg-[#e8d5b5]'
                }`}
              >
                <span className="hidden sm:inline">🤖 Đấu với Máy</span>
                <span className="sm:hidden">🤖 Đấu Máy</span>
              </button>

              {/* Nút 2 Người Chơi -> mở tuỳ chọn Chơi Online & Chơi Offline */}
              <button
                type="button"
                onClick={() => setIsTwoPlayerMenuOpen(prev => !prev)}
                disabled={isAnimating || isSpectator}
                className={`flex-1 min-w-0 py-1 sm:py-1.5 px-0.5 xs:px-1 sm:px-2 rounded-md sm:rounded-lg font-bold transition-all text-[9px] xs:text-[10px] sm:text-xs text-center flex items-center justify-center gap-0.5 ${
                  isSpectator
                    ? 'opacity-50 cursor-not-allowed text-[#5c3a21]'
                    : gameMode === 'local2p' || gameMode === 'online'
                    ? 'bg-[#27ae60] text-white shadow-xs cursor-pointer'
                    : 'text-[#5c3a21] hover:bg-[#e8d5b5] cursor-pointer'
                }`}
                title={isSpectator ? 'Khán giả chỉ có thể theo dõi' : undefined}
              >
                <span className="truncate">
                  {gameMode === 'online'
                    ? isSpectator
                      ? '👁️ Khán giả'
                      : '🌐 Online'
                    : '👥 2 Người'}
                </span>
                <span className="text-[8px] xs:text-[9px] opacity-80 flex-shrink-0">▼</span>
              </button>

              {/* Popover Menu 2 Tuỳ Chọn: Chơi Online & Chơi Offline */}
              {isTwoPlayerMenuOpen && !isSpectator && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-[#fdfaf5] border-2 border-[#bfa254] rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 text-left min-w-[200px] w-max max-w-[280px] animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      onStartOnlineGame();
                      setIsTwoPlayerMenuOpen(false);
                    }}
                    className="w-full p-2 rounded-lg hover:bg-[#eef8f2] text-[#1e8449] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-transparent hover:border-[#27ae60]"
                  >
                    <span className="text-base flex-shrink-0">🌐</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-xs truncate">Chơi Online</span>
                      <span className="text-[10px] text-gray-600 font-normal truncate">Tạo phòng & gửi link</span>
                    </div>
                  </button>

                  <div className="h-px bg-gray-200 my-0.5" />

                  <button
                    type="button"
                    onClick={() => {
                      onSelectGameMode('local2p');
                      setIsTwoPlayerMenuOpen(false);
                    }}
                    className="w-full p-2 rounded-lg hover:bg-[#f2e6d5] text-[#5c3a21] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-transparent hover:border-[#cdb499]"
                  >
                    <span className="text-base flex-shrink-0">💻</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-xs truncate">Chơi Offline</span>
                      <span className="text-[10px] text-gray-600 font-normal truncate">2 người chung 1 máy</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Nút Hướng Dẫn (Chiếm 1 cột) */}
            <button
              type="button"
              onClick={onOpenTutorial}
              className="col-span-1 min-w-0 py-1 sm:py-1.5 px-0.5 xs:px-1 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#2980b9] hover:bg-[#2471a3] text-white font-bold shadow-xs cursor-pointer text-[9px] xs:text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 transition-all active:scale-95"
            >
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate">Hướng Dẫn</span>
            </button>
          </div>

          {/* HÀNG DƯỚI: 3 nút chia đều 3 cột -> 1. Tuỳ chỉnh, 2. Ván mới, 3. Bắt đầu/Tạm dừng */}
          <div className="grid grid-cols-3 gap-1 xs:gap-1.5 sm:gap-2 w-full">
            {/* 1. Nút Tuỳ chỉnh */}
            <button
              type="button"
              onClick={onOpenSettings}
              disabled={isSpectator}
              className={`py-1 sm:py-1.5 px-0.5 xs:px-1 sm:px-2 rounded-lg sm:rounded-xl font-serif font-bold shadow-xs text-[9px] xs:text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 transition-all min-w-0 ${
                isSpectator
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-[#8e2a2a] hover:bg-[#722121] text-white cursor-pointer active:scale-95'
              }`}
              title={isSpectator ? 'Khán giả không thể mở Tuỳ chỉnh' : 'Mở menu Tuỳ chỉnh'}
            >
              <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate">Tuỳ chỉnh</span>
            </button>

            {/* 2. Nút Ván Mới */}
            <button
              type="button"
              onClick={onNewGame}
              disabled={isAnimating || isSpectator}
              className={`py-1 sm:py-1.5 px-0.5 xs:px-1 sm:px-2 rounded-lg sm:rounded-xl font-bold shadow-xs text-[9px] xs:text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 transition-all min-w-0 ${
                isSpectator || isAnimating
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-[#7f8c8d] hover:bg-[#6c7a7d] text-white cursor-pointer active:scale-95'
              }`}
              title={isSpectator ? 'Khán giả không thể bắt đầu ván mới' : undefined}
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate">Ván Mới</span>
            </button>

            {/* 3. Nút Bắt đầu chơi / Tạm dừng */}
            <button
              type="button"
              onClick={onToggleStartGame}
              disabled={isSpectator}
              className={`py-1 sm:py-1.5 px-0.5 xs:px-1 sm:px-2 rounded-lg sm:rounded-xl font-serif font-extrabold text-[9px] xs:text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 shadow-md min-w-0 transition-all ${
                isSpectator
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                  : isGameStarted
                  ? 'bg-[#d35400] hover:bg-[#b04500] text-white active:scale-95 cursor-pointer ring-1 ring-[#e67e22]/40'
                  : 'bg-[#27ae60] hover:bg-[#1e8449] text-white animate-pulse active:scale-95 cursor-pointer ring-1 ring-[#2ecc71]/40'
              }`}
              title={isSpectator ? 'Khán giả không thể tạm dừng ván đấu' : undefined}
            >
              {isGameStarted ? (
                <>
                  <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span className="truncate">Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current flex-shrink-0" />
                  <span className="truncate">Bắt đầu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Scoreboard Cards for Team 1 & Team 2 + Time Indicator Bars */}
        <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3 w-full lg:w-auto lg:flex lg:items-center lg:justify-end border-t lg:border-t-0 pt-1.5 sm:pt-2 lg:pt-0 border-[#cdb499]/60">
          {/* Player 1 Card + Time Bar */}
          <div className="flex flex-col w-full lg:w-[220px] xl:w-[240px] gap-1 relative min-w-0">
            <div
              onClick={canToggleTeam ? onToggleTeamChoice : undefined}
              className={`score-card relative px-1.5 xs:px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border sm:border-2 transition-all duration-300 flex items-center justify-between gap-1 sm:gap-1.5 min-w-0 ${
                canToggleTeam ? 'cursor-pointer hover:shadow-md' : ''
              } ${currentPlayer === 'p1' ? theme1.activeCardBg : theme1.inactiveCardBg}`}
              title={canToggleTeam ? 'Bấm vào đây để đổi chọn Đội Đỏ hoặc Đội Xanh' : undefined}
            >
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
                <div className="relative flex-shrink-0 scale-90 xs:scale-95 sm:scale-100 origin-left">
                  <QuanCharacter colorScheme={p1Color} gender="female" size="sm" showBadge={false} />
                  {currentPlayer === 'p1' && (
                    <span
                      className={`absolute -top-2 -right-1 text-white text-[7px] xs:text-[8px] font-bold px-1 py-0.2 rounded-full animate-bounce shadow-xs whitespace-nowrap ${theme1.badgeBg}`}
                    >
                      Đến lượt!
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className={`font-serif font-extrabold text-[9px] xs:text-[10px] sm:text-xs md:text-sm leading-tight truncate ${theme1.textColor}`}>
                      {gameMode === 'ai' ? `Bạn: Đội ${theme1.name}` : `Đội ${theme1.name}`}
                    </h3>
                  </div>
                  <p className={`text-[8px] xs:text-[9px] sm:text-xs font-medium leading-tight mt-0.5 truncate ${theme1.subtextColor}`}>
                    {p1CapturedQuan} Quan, {p1CapturedDan} Dân
                  </p>
                  {p1Debt > 0 && (
                    <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[#c0392b] font-bold bg-[#fadbd8] px-1 rounded border border-[#e74c3c] mt-0.5 inline-block truncate">
                      Nợ: -{p1Debt}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end flex-shrink-0 ml-0.5">
                <span className={`text-[7px] xs:text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider ${theme1.textColor}`}>ĐIỂM</span>
                <div className={`text-[11px] xs:text-xs sm:text-sm md:text-base font-extrabold ${theme1.textColor} ${theme1.scoreBoxBg} px-1 xs:px-1.5 sm:px-2 py-0.2 rounded-md sm:rounded-lg border shadow-inner min-w-[20px] xs:min-w-[24px] sm:min-w-[28px] text-center`}>
                  {p1Score}
                </div>
              </div>
            </div>

            {/* Thanh minh hoạ thời gian cho Đội 1 */}
            <div className="time-bar w-full bg-[#e0d2c3] h-2.5 sm:h-3.5 rounded-full p-0.5 border border-[#cdb499] relative overflow-hidden flex items-center shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-300 ${theme1.timeBarGradient} ${
                  p1TimeRemaining <= 10 && currentPlayer === 'p1' ? 'animate-pulse' : ''
                }`}
                style={{ width: `${p1TimePct}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] xs:text-[8px] sm:text-[9px] font-extrabold text-[#3a2510] drop-shadow-xs">
                {formatTime(p1TimeRemaining)}
              </span>
            </div>
          </div>

          {/* Player 2 Card + Time Bar */}
          <div className="flex flex-col w-full lg:w-[220px] xl:w-[240px] gap-1 relative min-w-0">
            <div
              onClick={canToggleTeam ? onToggleTeamChoice : undefined}
              className={`score-card relative px-1.5 xs:px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border sm:border-2 transition-all duration-300 flex items-center justify-between gap-1 sm:gap-1.5 min-w-0 ${
                canToggleTeam ? 'cursor-pointer hover:shadow-md' : ''
              } ${currentPlayer === 'p2' ? theme2.activeCardBg : theme2.inactiveCardBg}`}
              title={canToggleTeam ? 'Bấm vào đây để đổi chọn Đội Đỏ hoặc Đội Xanh' : undefined}
            >
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
                <div className="relative flex-shrink-0 scale-90 xs:scale-95 sm:scale-100 origin-left">
                  <QuanCharacter colorScheme={p2Color} gender="male" size="sm" showBadge={false} />
                  {currentPlayer === 'p2' && (
                    <span
                      className={`absolute -top-2 -right-1 text-white text-[7px] xs:text-[8px] font-bold px-1 py-0.2 rounded-full animate-bounce shadow-xs whitespace-nowrap ${theme2.badgeBg}`}
                    >
                      Đến lượt!
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className={`font-serif font-extrabold text-[9px] xs:text-[10px] sm:text-xs md:text-sm leading-tight truncate ${theme2.textColor}`}>
                      {gameMode === 'ai' ? `Máy: Đội ${theme2.name}` : `Đội ${theme2.name}`}
                    </h3>
                  </div>
                  <p className={`text-[8px] xs:text-[9px] sm:text-xs font-medium leading-tight mt-0.5 truncate ${theme2.subtextColor}`}>
                    {p2CapturedQuan} Quan, {p2CapturedDan} Dân
                  </p>
                  {p2Debt > 0 && (
                    <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[#2980b9] font-bold bg-[#d6eaf8] px-1 rounded border border-[#3498db] mt-0.5 inline-block truncate">
                      Nợ: -{p2Debt}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end flex-shrink-0 ml-0.5">
                <span className={`text-[7px] xs:text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider ${theme2.textColor}`}>ĐIỂM</span>
                <div className={`text-[11px] xs:text-xs sm:text-sm md:text-base font-extrabold ${theme2.textColor} ${theme2.scoreBoxBg} px-1 xs:px-1.5 sm:px-2 py-0.2 rounded-md sm:rounded-lg border shadow-inner min-w-[20px] xs:min-w-[24px] sm:min-w-[28px] text-center`}>
                  {p2Score}
                </div>
              </div>
            </div>

            {/* Thanh minh hoạ thời gian cho Đội 2 */}
            <div className="time-bar w-full bg-[#e0d2c3] h-2.5 sm:h-3.5 rounded-full p-0.5 border border-[#cdb499] relative overflow-hidden flex items-center shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-300 ${theme2.timeBarGradient} ${
                  p2TimeRemaining <= 10 && currentPlayer === 'p2' ? 'animate-pulse' : ''
                }`}
                style={{ width: `${p2TimePct}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] xs:text-[8px] sm:text-[9px] font-extrabold text-[#3a2510] drop-shadow-xs">
                {formatTime(p2TimeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

