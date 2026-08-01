import { TeamColor } from '../types';

export interface TeamTheme {
  id: TeamColor;
  name: string;
  hex: string;
  activeCardBg: string;
  inactiveCardBg: string;
  textColor: string;
  subtextColor: string;
  scoreBoxBg: string;
  timeBarGradient: string;
  timeBarBg: string;
  badgeBg: string;
}

export const TEAM_THEMES: Record<TeamColor, TeamTheme> = {
  red: {
    id: 'red',
    name: 'Đỏ',
    hex: '#c0392b',
    activeCardBg: 'bg-gradient-to-r from-[#fadbd8] to-[#f5b7b1] border-[#c0392b] ring-2 ring-[#e74c3c]/40 shadow-sm',
    inactiveCardBg: 'bg-[#fdf2e9] border-[#f5b7b1] opacity-90',
    textColor: 'text-[#78281f]',
    subtextColor: 'text-[#922b21]',
    scoreBoxBg: 'bg-[#f9ebea] border-[#e74c3c]',
    timeBarGradient: 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b]',
    timeBarBg: 'bg-[#f5b7b1]/50',
    badgeBg: 'bg-[#c0392b]',
  },
  blue: {
    id: 'blue',
    name: 'Xanh',
    hex: '#2980b9',
    activeCardBg: 'bg-gradient-to-r from-[#d6eaf8] to-[#aed6f1] border-[#2980b9] ring-2 ring-[#3498db]/40 shadow-sm',
    inactiveCardBg: 'bg-[#ebf5fb] border-[#aed6f1] opacity-90',
    textColor: 'text-[#1b4f72]',
    subtextColor: 'text-[#21618c]',
    scoreBoxBg: 'bg-[#ebf5fb] border-[#3498db]',
    timeBarGradient: 'bg-gradient-to-r from-[#3498db] to-[#2980b9]',
    timeBarBg: 'bg-[#aed6f1]/50',
    badgeBg: 'bg-[#2980b9]',
  },
  green: {
    id: 'green',
    name: 'Xanh Lá',
    hex: '#27ae60',
    activeCardBg: 'bg-gradient-to-r from-[#d5f5e3] to-[#abebc6] border-[#27ae60] ring-2 ring-[#2ecc71]/40 shadow-sm',
    inactiveCardBg: 'bg-[#eafaf1] border-[#abebc6] opacity-90',
    textColor: 'text-[#145a32]',
    subtextColor: 'text-[#1e8449]',
    scoreBoxBg: 'bg-[#eafaf1] border-[#2ecc71]',
    timeBarGradient: 'bg-gradient-to-r from-[#2ecc71] to-[#27ae60]',
    timeBarBg: 'bg-[#abebc6]/50',
    badgeBg: 'bg-[#27ae60]',
  },
  purple: {
    id: 'purple',
    name: 'Tím',
    hex: '#8e44ad',
    activeCardBg: 'bg-gradient-to-r from-[#f3e5f5] to-[#e1bee7] border-[#8e44ad] ring-2 ring-[#9b59b6]/40 shadow-sm',
    inactiveCardBg: 'bg-[#f8f0fb] border-[#e1bee7] opacity-90',
    textColor: 'text-[#4a148c]',
    subtextColor: 'text-[#6c3483]',
    scoreBoxBg: 'bg-[#f8f0fb] border-[#9b59b6]',
    timeBarGradient: 'bg-gradient-to-r from-[#9b59b6] to-[#8e44ad]',
    timeBarBg: 'bg-[#e1bee7]/50',
    badgeBg: 'bg-[#8e44ad]',
  },
  amber: {
    id: 'amber',
    name: 'Cam',
    hex: '#d35400',
    activeCardBg: 'bg-gradient-to-r from-[#fdebd0] to-[#f9e79f] border-[#d35400] ring-2 ring-[#f39c12]/40 shadow-sm',
    inactiveCardBg: 'bg-[#fef9e7] border-[#f9e79f] opacity-90',
    textColor: 'text-[#6e2c00]',
    subtextColor: 'text-[#b9770e]',
    scoreBoxBg: 'bg-[#fef9e7] border-[#f39c12]',
    timeBarGradient: 'bg-gradient-to-r from-[#f39c12] to-[#d35400]',
    timeBarBg: 'bg-[#f9e79f]/50',
    badgeBg: 'bg-[#d35400]',
  },
  pink: {
    id: 'pink',
    name: 'Hồng',
    hex: '#e84393',
    activeCardBg: 'bg-gradient-to-r from-[#fce4ec] to-[#f8bbd0] border-[#e84393] ring-2 ring-[#fd79a8]/40 shadow-sm',
    inactiveCardBg: 'bg-[#fdf2f7] border-[#f8bbd0] opacity-90',
    textColor: 'text-[#880e4f]',
    subtextColor: 'text-[#ad1457]',
    scoreBoxBg: 'bg-[#fdf2f7] border-[#fd79a8]',
    timeBarGradient: 'bg-gradient-to-r from-[#fd79a8] to-[#e84393]',
    timeBarBg: 'bg-[#f8bbd0]/50',
    badgeBg: 'bg-[#e84393]',
  },
};

export const COLOR_LIST: TeamColor[] = ['red', 'blue', 'green', 'purple', 'amber', 'pink'];
