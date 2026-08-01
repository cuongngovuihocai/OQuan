import React, { useState } from 'react';
import { Copy, Check, Users, Wifi, Globe } from 'lucide-react';
import { PlayerId } from '../types';

interface OnlineRoomBannerProps {
  roomId: string;
  playerRole: PlayerId;
  currentPlayer: PlayerId;
  p2Joined: boolean;
  p1Color: string;
  p2Color: string;
}

export const OnlineRoomBanner: React.FC<OnlineRoomBannerProps> = ({
  roomId,
  playerRole,
  currentPlayer,
  p2Joined,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMyTurn = playerRole === currentPlayer;
  const roleName = playerRole === 'p1' ? 'Người chơi 1 (Đội Đỏ - Hàng Dưới)' : 'Người chơi 2 (Đội Xanh - Hàng Trên)';

  return (
    <div className="w-full bg-[#fcf8f2] border-2 border-[#bfa254] rounded-xl p-2.5 sm:p-3 mb-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
      {/* Room ID & Share Link */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
        <div className="flex items-center gap-1.5 bg-[#8e2a2a] text-white px-2.5 py-1 rounded-lg font-bold">
          <Globe className="w-3.5 h-3.5" />
          <span>Phòng: <strong className="font-mono tracking-wider text-amber-300">{roomId}</strong></span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 bg-[#27ae60] hover:bg-[#219653] text-white px-2.5 py-1 rounded-lg font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          title="Sao chép liên kết mời bạn bè"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-yellow-200" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép link!' : 'Sao chép link mời'}</span>
        </button>
      </div>

      {/* Connection & Turn Status */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
        {/* Opponent Connection Status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-xs ${
          p2Joined ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
        }`}>
          <Wifi className="w-3.5 h-3.5" />
          <span>{p2Joined ? 'Đối thủ đã kết nối' : 'Đang chờ đối thủ...'}</span>
        </div>

        {/* Player Role */}
        <div className="flex items-center gap-1.5 bg-[#f3e5ca] text-[#5c3a21] px-2.5 py-1 rounded-lg border border-[#d3be9c] font-semibold text-xs">
          <Users className="w-3.5 h-3.5" />
          <span>
            Bạn là:{' '}
            <strong className={playerRole === 'p1' ? 'text-red-700' : playerRole === 'p2' ? 'text-blue-700' : 'text-purple-700'}>
              {playerRole === 'p1' ? 'Player 1 (Đỏ)' : playerRole === 'p2' ? 'Player 2 (Xanh)' : 'Khán giả (Xem)'}
            </strong>
          </span>
        </div>

        {/* Turn Indicator */}
        {playerRole === 'spectator' ? (
          <div className="px-2.5 py-1 rounded-lg font-bold text-xs bg-purple-100 text-purple-800 border border-purple-300">
            👁️ Đang xem trận đấu
          </div>
        ) : (
          <div className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
            isMyTurn ? 'bg-red-600 text-white animate-bounce' : 'bg-gray-200 text-gray-700'
          }`}>
            {isMyTurn ? '🎯 Đến lượt bạn!' : '⏳ Đợi đối thủ...'}
          </div>
        )}
      </div>
    </div>
  );
};
