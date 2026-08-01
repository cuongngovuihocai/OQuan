import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const HandSlamOverlay: React.FC<{ isQuan?: boolean }> = ({ isQuan }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none overflow-visible"
    >
      {/* Shockwave expanding ring */}
      <motion.div
        initial={{ scale: 0.2, opacity: 1 }}
        animate={{ scale: isQuan ? 2.8 : 2.2, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="absolute w-20 h-20 rounded-full border-4 border-[#d35400] bg-[#f39c12]/40"
      />

      {/* Hand slamming down */}
      <motion.div
        initial={{ y: -70, scale: 2.2, rotate: -25 }}
        animate={{ y: 0, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 700, damping: 18 }}
        className="filter drop-shadow-2xl z-10"
      >
        <span className="text-5xl sm:text-6xl select-none">🖐️</span>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export const QuanPalacePit: React.FC<{
  title: string;
  sideName: string;
  count: number;
  isSelected?: boolean;
  isTargeted?: boolean;
  isHandSlamming?: boolean;
  children: React.ReactNode;
}> = ({ title, sideName, count, isSelected = false, isTargeted = false, isHandSlamming = false, children }) => {
  // Dynamic layout calculation for Palace Pit ("đất chật người đông")
  const getPalaceDynamicLayout = (num: number) => {
    if (num <= 6) {
      return {
        palaceContainerClass: 'flex-wrap justify-center items-center gap-0.5 sm:gap-1',
        palaceScaleClass: 'scale-90 sm:scale-100',
      };
    }
    if (num <= 12) {
      return {
        palaceContainerClass: 'flex-wrap justify-center items-center -space-x-1.5 -space-y-1.5',
        palaceScaleClass: 'scale-80 sm:scale-90',
      };
    }
    if (num <= 20) {
      return {
        palaceContainerClass: 'flex-wrap justify-center items-center -space-x-2.5 -space-y-2.5',
        palaceScaleClass: 'scale-65 sm:scale-80',
      };
    }
    if (num <= 35) {
      return {
        palaceContainerClass: 'flex-wrap justify-center items-center -space-x-3.5 -space-y-3.5',
        palaceScaleClass: 'scale-50 sm:scale-65',
      };
    }
    return {
      palaceContainerClass: 'flex-wrap justify-center items-center -space-x-4 -space-y-4',
      palaceScaleClass: 'scale-40 sm:scale-55',
    };
  };

  const { palaceContainerClass, palaceScaleClass } = getPalaceDynamicLayout(count);

  return (
    <div
      className={`relative flex flex-col items-center justify-between p-1 sm:p-2 rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-colors duration-300 h-full min-h-[280px] xs:min-h-[330px] sm:min-h-[390px] w-full bg-gradient-to-b from-[#fdf5e6] to-[#f3e5ca] shadow-lg short-landscape-quan-pit ${
        isSelected
          ? 'border-[#e67e22] ring-2 sm:ring-4 ring-[#f39c12]/40 z-10'
          : isTargeted
          ? 'border-[#27ae60] bg-[#e8f8f5] z-10'
          : 'border-[#8d5b32] hover:border-[#b87333]'
      }`}
    >
      {/* Quan Pit Header Badge & House Icon */}
      <div className="w-full flex flex-col items-center mt-0.5 sm:mt-1 flex-shrink-0 z-10 gap-0.5">
        <span className="text-[9px] xs:text-xs sm:text-sm font-serif font-bold text-[#fbeee0] bg-[#8e2a2a] px-1.5 sm:px-3 py-0.5 rounded-full border border-[#f39c12] shadow whitespace-nowrap">
          {sideName}
        </span>
        <img
          src="https://lh3.googleusercontent.com/d/1iSA6sePG6oRwAboo2R_oc6ne3bISGFO1"
          alt="Nhà gỗ"
          referrerPolicy="no-referrer"
          className="w-[40px] h-[32px] xs:w-[60px] xs:h-[50px] sm:w-[90px] sm:h-[76px] object-contain filter drop-shadow-sm short-landscape-quan-house"
        />
      </div>

      {/* Piece Container inside Castle Courtyard (Fixed Height, Overflow Hidden, No Scrollbars) */}
      <div className="flex-1 w-full flex items-center justify-center p-0.5 sm:p-2 my-1 relative overflow-hidden">
        {count === 0 ? (
          <span className="text-[8px] xs:text-[10px] sm:text-xs font-semibold text-[#a07e56] italic z-10">Cung Trống</span>
        ) : (
          <div className={`w-full flex ${palaceContainerClass} ${palaceScaleClass} transition-all duration-300 origin-center z-10`}>
            {children}
          </div>
        )}
      </div>

      {/* Counter Badge */}
      <div className="flex items-center justify-center min-w-[28px] sm:min-w-[36px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#4a2e1b] text-[#fef9e7] text-xs sm:text-sm font-bold border border-[#f1c40f] flex-shrink-0">
        <span className="hidden lg:inline text-[#e6ce9e] font-medium text-xs mr-1">Tổng:</span>
        <span className="text-[#f1c40f] text-xs sm:text-sm font-extrabold">{count}</span>
      </div>

      {/* Hand slam effect overlay when hitting empty pit */}
      {isHandSlamming && <HandSlamOverlay isQuan />}
    </div>
  );
};

export const DanCottagePit: React.FC<{
  pitIndex: number;
  pitLabel: string;
  count: number;
  isCurrentPlayerSide: boolean;
  canSelect: boolean;
  isSelected: boolean;
  isTargeted: boolean;
  isHandSlamming?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  team?: 'red' | 'blue';
}> = ({
  pitIndex,
  pitLabel,
  count,
  isCurrentPlayerSide,
  canSelect,
  isSelected,
  isTargeted,
  isHandSlamming = false,
  onClick,
  children,
  team = 'red',
}) => {
  // Dynamic layout calculation based on piece count for "đất chật người đông"
  const getDynamicLayout = (num: number) => {
    if (num <= 5) {
      return {
        containerClass: 'flex-wrap justify-center items-center gap-0.5 sm:gap-1',
        scaleClass: 'scale-95 sm:scale-100',
      };
    }
    if (num <= 10) {
      return {
        containerClass: 'flex-wrap justify-center items-center -space-x-1 -space-y-1 sm:-space-x-1 sm:-space-y-1',
        scaleClass: 'scale-90 sm:scale-95',
      };
    }
    if (num <= 18) {
      return {
        containerClass: 'flex-wrap justify-center items-center -space-x-2 -space-y-2 sm:-space-x-2 sm:-space-y-2',
        scaleClass: 'scale-80 sm:scale-85',
      };
    }
    if (num <= 30) {
      return {
        containerClass: 'flex-wrap justify-center items-center -space-x-2.5 -space-y-2.5 sm:-space-x-3 sm:-space-y-3',
        scaleClass: 'scale-70 sm:scale-75',
      };
    }
    return {
      containerClass: 'flex-wrap justify-center items-center -space-x-3 -space-y-3 sm:-space-x-3.5 sm:-space-y-3.5',
      scaleClass: 'scale-60 sm:scale-65',
    };
  };

  const { containerClass, scaleClass } = getDynamicLayout(count);

  const getBackgroundStyle = () => {
    if (isSelected) {
      return team === 'blue'
        ? 'border-[#2980b9] bg-flow-blue-active ring-2 sm:ring-4 ring-[#3498db]/60 z-10'
        : 'border-[#d35400] bg-flow-red-active ring-2 sm:ring-4 ring-[#e67e22]/60 z-10';
    }
    if (isTargeted) {
      return 'border-[#27ae60] bg-[#e8f8f5] shadow-md z-10';
    }
    if (team === 'blue') {
      return isCurrentPlayerSide && count > 0
        ? 'border-[#2980b9] bg-flow-blue-active hover:brightness-105 hover:border-[#1f618d] shadow-md'
        : 'border-[#a9cce3] bg-flow-blue opacity-95';
    }
    return isCurrentPlayerSide && count > 0
      ? 'border-[#e74c3c]/70 bg-flow-red-active opacity-90 hover:brightness-105 hover:border-[#c0392b] shadow-md'
      : 'border-[#fca5a5]/60 bg-flow-red opacity-80';
  };

  return (
    <div
      role="button"
      tabIndex={canSelect ? 0 : -1}
      aria-disabled={!canSelect}
      onClick={(e) => {
        (e.currentTarget as HTMLElement).blur();
        if (canSelect) onClick();
      }}
      className={`group relative flex flex-col items-center justify-between p-1 sm:p-2 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-300 h-[135px] xs:h-[160px] sm:h-[190px] md:h-[222px] w-full text-left outline-none short-landscape-dan-pit ${
        canSelect ? 'cursor-pointer' : 'cursor-default'
      } ${getBackgroundStyle()}`}
    >
      {/* Cottage Roof Accent */}
      <div className="w-full flex items-center justify-center gap-0.5 mt-0.5 lg:-mt-2 flex-shrink-0 short-landscape-cottage-roof">
        <img
          src="https://lh3.googleusercontent.com/d/1lsRlehnKa_o6LwlMebFs6YdZcTJpj0Fa"
          alt="Nhà tranh"
          referrerPolicy="no-referrer"
          className="hidden lg:block w-[28px] h-[28px] xs:w-[35px] xs:h-[35px] sm:w-[45px] sm:h-[45px] object-contain filter drop-shadow-sm flex-shrink-0"
        />

        <span className="text-[8px] xs:text-[10px] sm:text-[11px] font-serif font-bold text-[#5c3a21] bg-[#e6ce9e] px-1 sm:px-2 py-0.5 rounded-full border border-[#bfa254] shadow-xs whitespace-nowrap">
          Ô {pitIndex + 1}
        </span>
      </div>

      {/* Inside Cottage Yard (Fixed Height, Overflow Hidden, No Scrollbars) */}
      <div className="flex-1 w-full flex items-center justify-center p-0.5 my-0.5 relative overflow-hidden">
        {count === 0 ? (
          <span className="text-[8px] xs:text-[10px] sm:text-xs font-semibold text-[#a07e56] italic">Trống</span>
        ) : (
          <div className={`w-full flex ${containerClass} ${scaleClass} transition-all duration-300 origin-center`}>
            {children}
          </div>
        )}
      </div>

      {/* Piece Counter */}
      <div className="flex items-center justify-center min-w-[28px] sm:min-w-[36px] px-2 sm:px-3 py-0.5 rounded-full bg-[#5c3a21] text-[#fef9e7] text-xs sm:text-sm font-extrabold border border-[#a07e56] shadow-xs flex-shrink-0">
        <span className="hidden lg:inline text-[#e6ce9e] font-medium text-xs mr-1">Dân:</span>
        <span className={count > 0 ? 'text-[#f1c40f]' : 'text-gray-300'}>{count}</span>
      </div>

      {/* Select Hint Pulse Overlay */}
      {canSelect && !isSelected && (
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-[#e67e22] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}

      {/* Hand slam effect overlay when hitting empty pit */}
      {isHandSlamming && <HandSlamOverlay />}
    </div>
  );
};

