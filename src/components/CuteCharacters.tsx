import React from 'react';
import { motion } from 'motion/react';
import { Piece, TeamColor } from '../types';

interface CharacterProps {
  piece: Piece;
  isMoving?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const QuanCharacter: React.FC<{
  colorScheme?: TeamColor;
  gender?: 'male' | 'female';
  isMoving?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}> = ({ colorScheme = 'red', gender, isMoving = false, size = 'md', showBadge = false }) => {
  const actualGender = gender ?? (colorScheme === 'red' ? 'female' : 'male');
  const dimensions = {
    sm: { width: 48, height: 56 },
    md: { width: 68, height: 80 },
    lg: { width: 92, height: 108 },
  }[size];

  const colorMap: Record<TeamColor, { main: string; belt: string; hat: string }> = {
    red: { main: '#c0392b', belt: '#f39c12', hat: '#8e44ad' },
    blue: { main: '#2980b9', belt: '#f1c40f', hat: '#16a085' },
    green: { main: '#27ae60', belt: '#f39c12', hat: '#16a085' },
    purple: { main: '#8e44ad', belt: '#f1c40f', hat: '#2980b9' },
    amber: { main: '#d35400', belt: '#f1c40f', hat: '#27ae60' },
    pink: { main: '#e84393', belt: '#f1c40f', hat: '#8e44ad' },
  };

  const currentTheme = colorMap[colorScheme] || colorMap.red;
  const mainColor = currentTheme.main;
  const beltColor = currentTheme.belt;
  const hatColor = currentTheme.hat;

  const isFemale = actualGender === 'female';

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      animate={
        isMoving
          ? {
              y: [0, -12, 0, -6, 0],
              rotate: [0, -8, 8, -4, 0],
              scale: [1, 1.08, 0.95, 1.04, 1],
            }
          : {
              y: [0, -2, 0],
              rotate: [0, -1, 1, 0],
            }
      }
      transition={{
        duration: isMoving ? 0.45 : 2.5,
        repeat: isMoving ? Infinity : Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        {/* Shadow under Quan */}
        <ellipse cx="50" cy="112" rx="36" ry="7" fill="#3a2510" opacity="0.25" />

        {isFemale ? (
          /* QUAN BÀ: TÓC ĐEN BÚI CAO, CÀI TRÂM VÀNG, MẶT TRÁI XOAN XINH ĐẸP */
          <g id="quan-ba-xinh-dep">
            {/* Elegant Royal Gown (Phượng Bào / Áo Nhật Bình) */}
            <path
              d="M22 105 C17 70, 22 52, 50 52 C78 52, 83 70, 78 105 Z"
              fill={mainColor}
              stroke="#3a2510"
              strokeWidth="3.5"
            />

            {/* Noble Collar Embroidery (Cổ Áo Nhật Bình Ngũ Thân) */}
            <path d="M38 52 L50 72 L62 52" stroke="#f1c40f" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
            <path d="M42 52 L50 65 L58 52" stroke="#e67e22" strokeWidth="1.8" fill="none" strokeLinejoin="round" />

            {/* Jade Pendant Necklace */}
            <circle cx="50" cy="74" r="4" fill="#2ecc71" stroke="#3a2510" strokeWidth="1.5" />

            {/* Gold Embroidered Silk Waist Belt & Hanging Sash */}
            <rect x="25" y="80" width="50" height="8" rx="2" fill="#f39c12" stroke="#3a2510" strokeWidth="2" />
            <path d="M52 88 Q56 98 54 108" stroke="#f1c40f" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M52 88 Q56 98 54 108" stroke="#3a2510" strokeWidth="1" strokeLinecap="round" fill="none" />

            {/* Elegant Little Arms */}
            <path d="M22 62 Q12 72 20 82" stroke="#3a2510" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M78 62 Q88 72 80 82" stroke="#3a2510" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M22 62 Q12 72 20 82" stroke={mainColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M78 62 Q88 72 80 82" stroke={mainColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* HIGH BLACK HAIR BUN (Tóc đen búi cao trên đỉnh đầu) */}
            <ellipse cx="50" cy="11" rx="14" ry="10" fill="#2c3e50" stroke="#3a2510" strokeWidth="2.5" />
            <circle cx="50" cy="7" r="5" fill="#1a252f" />

            {/* GOLD HAIRPIN (Cài Trâm Vàng) */}
            <line x1="24" y1="12" x2="76" y2="12" stroke="#f1c40f" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="24" y1="12" x2="76" y2="12" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            {/* Gold Pin Ornament Head & Pearl */}
            <circle cx="76" cy="12" r="4" fill="#e67e22" stroke="#3a2510" strokeWidth="1.5" />
            <circle cx="76" cy="12" r="1.8" fill="#ffffff" />
            <circle cx="24" cy="12" r="3" fill="#f39c12" stroke="#3a2510" strokeWidth="1.5" />
            {/* Dangling Tassel from Hairpin */}
            <path d="M76 12 Q79 18 77 25" stroke="#f1c40f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="77" cy="26" r="2" fill="#e74c3c" />

            {/* OVAL PRETTY FACE (Mặt Trái Xoan Xinh Đẹp) */}
            <ellipse cx="50" cy="38" rx="20" ry="24" fill="#ffe0bd" stroke="#3a2510" strokeWidth="3" />

            {/* Neat Black Hair Framing Forehead */}
            <path
              d="M30 28 Q50 16 70 28 C66 20, 34 20, 30 28 Z"
              fill="#2c3e50"
              stroke="#3a2510"
              strokeWidth="1.5"
            />

            {/* Rosy Cheeks */}
            <circle cx="35" cy="42" r="4.5" fill="#ff7979" opacity="0.65" />
            <circle cx="65" cy="42" r="4.5" fill="#ff7979" opacity="0.65" />

            {/* Pretty Eyes with Eyelashes & Highlights */}
            <path d="M35 30.5 Q40 28.5 45 30.5" stroke="#3a2510" strokeWidth="1.2" fill="none" />
            <path d="M55 30.5 Q60 28.5 65 30.5" stroke="#3a2510" strokeWidth="1.2" fill="none" />
            <circle cx="41" cy="34.5" r="3.2" fill="#2c3e50" />
            <circle cx="42" cy="33" r="1.2" fill="#ffffff" />
            <circle cx="59" cy="34.5" r="3.2" fill="#2c3e50" />
            <circle cx="60" cy="33" r="1.2" fill="#ffffff" />

            {/* Pretty Lipstick Smile */}
            <path d="M44 44 Q50 49 56 44" fill="#e74c3c" stroke="#3a2510" strokeWidth="1.8" />
          </g>
        ) : (
          /* QUAN ÔNG: BỤ BẪM, ĐỘI MŨ CÁNH CHUỒN, RÂU VỂNH CUTE */
          <g id="quan-ong-bo-truong">
            {/* Big Chubby Body (Áo Gấm) */}
            <path
              d="M20 105 C15 70, 20 50, 50 50 C80 50, 85 70, 80 105 C80 110, 20 110, 20 105 Z"
              fill={mainColor}
              stroke="#3a2510"
              strokeWidth="3.5"
            />

            {/* Big Chubby Belly Detail */}
            <ellipse cx="50" cy="85" rx="24" ry="20" fill="#fbeee0" opacity="0.3" />

            {/* Silk Belt & Gold Buckle */}
            <rect x="22" y="78" width="56" height="10" rx="3" fill={beltColor} stroke="#3a2510" strokeWidth="2" />
            <rect x="42" y="76" width="16" height="14" rx="2" fill="#f39c12" stroke="#3a2510" strokeWidth="2" />
            <circle cx="50" cy="83" r="3" fill="#e67e22" />

            {/* Chubby Head */}
            <circle cx="50" cy="38" r="23" fill="#ffe0bd" stroke="#3a2510" strokeWidth="3" />

            {/* Cute Rosy Cheeks */}
            <circle cx="36" cy="42" r="5" fill="#ff7979" opacity="0.6" />
            <circle cx="64" cy="42" r="5" fill="#ff7979" opacity="0.6" />

            {/* Adorable Sparkling Eyes */}
            <circle cx="41" cy="35" r="3.5" fill="#2c3e50" />
            <circle cx="42" cy="33.5" r="1.2" fill="#ffffff" />
            <circle cx="59" cy="35" r="3.5" fill="#2c3e50" />
            <circle cx="60" cy="33.5" r="1.2" fill="#ffffff" />

            {/* Cute Majestic Mustache & Smile */}
            <path d="M42 42 Q50 46 58 42" stroke="#3a2510" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M45 45 Q50 50 55 45" fill="#e74c3c" stroke="#3a2510" strokeWidth="1.5" />

            {/* Official's Wing Hat (Mũ Cánh Chuồn) */}
            <path d="M28 26 C28 12, 72 12, 72 26 Z" fill={hatColor} stroke="#3a2510" strokeWidth="3" />
            <rect x="25" y="24" width="50" height="7" rx="3" fill="#f1c40f" stroke="#3a2510" strokeWidth="2" />

            {/* Left Wing of Hat */}
            <ellipse cx="14" cy="24" rx="12" ry="4" fill={hatColor} stroke="#3a2510" strokeWidth="2" />
            {/* Right Wing of Hat */}
            <ellipse cx="86" cy="24" rx="12" ry="4" fill={hatColor} stroke="#3a2510" strokeWidth="2" />

            {/* Cute Little Arms */}
            <path d="M22 60 Q12 70 20 80" stroke="#3a2510" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M78 60 Q88 70 80 80" stroke="#3a2510" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
      {/* Title Label Badge */}
      {showBadge && (
        <span className="mt-0.5 text-[10px] sm:text-xs font-bold text-[#6d213c] bg-[#fcd5ce] px-2 py-0.5 rounded-full border border-[#b56576] shadow-sm tracking-wide">
          {isFemale ? 'QUAN BÀ 👑' : 'QUAN ÔNG 👑'}
        </span>
      )}
    </motion.div>
  );
};

export const DanCharacter: React.FC<{
  gender?: 'male' | 'female';
  isMoving?: boolean;
  size?: 'sm' | 'md';
  variant?: number;
}> = ({ gender = 'male', isMoving = false, size = 'md', variant = 1 }) => {
  // Mobile / Tablet head-only dimensions
  const compactDimensions = size === 'sm' ? { width: 26, height: 26 } : { width: 36, height: 36 };

  // Desktop full-body dimensions (scaled down to ~70% for dense crowding)
  const fullDimensions = size === 'sm' ? { width: 25, height: 32 } : { width: 32, height: 39 };

  const isMale = gender === 'male';

  const malePalette = {
    1: { loincloth: '#8C2F39', flap: '#a93226', ribbon: '#e74c3c' },
    2: { loincloth: '#16a085', flap: '#1abc9c', ribbon: '#f1c40f' },
    3: { loincloth: '#d35400', flap: '#e67e22', ribbon: '#2ecc71' },
    4: { loincloth: '#2980b9', flap: '#3498db', ribbon: '#e74c3c' },
    5: { loincloth: '#8e44ad', flap: '#9b59b6', ribbon: '#f1c40f' },
  }[((variant - 1) % 5) + 1] || { loincloth: '#8C2F39', flap: '#a93226', ribbon: '#e74c3c' };

  const femalePalette = {
    1: { yem: '#F27D26', skirt: '#1B263B', sash: '#f1c40f', bow: '#e74c3c' },
    2: { yem: '#e84393', skirt: '#0F4C3A', sash: '#00cec9', bow: '#f1c40f' },
    3: { yem: '#00b894', skirt: '#2c3e50', sash: '#fd79a8', bow: '#e74c3c' },
    4: { yem: '#d63031', skirt: '#1a252f', sash: '#e67e22', bow: '#2ecc71' },
    5: { yem: '#f1c40f', skirt: '#4a1525', sash: '#e84393', bow: '#2980b9' },
  }[((variant - 1) % 5) + 1] || { yem: '#F27D26', skirt: '#1B263B', sash: '#f1c40f', bow: '#e74c3c' };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      animate={
        isMoving
          ? {
              y: [0, -12, 0],
              scale: [1, 1.15, 0.9, 1],
              rotate: [0, -10, 10, 0],
            }
          : {
              y: [0, -2, 0],
            }
      }
      transition={{
        duration: isMoving ? 0.28 : 2 + Math.random(),
        repeat: isMoving ? Infinity : Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* 1. MOBILE & TABLET VERSION (Head only) */}
      <svg
        width={compactDimensions.width}
        height={compactDimensions.height}
        viewBox="0 0 52 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="lg:hidden filter drop-shadow-xs"
      >
        {/* Soft Shadow under head */}
        <ellipse cx="26" cy="45" rx="15" ry="3" fill="#3a2510" opacity="0.2" />

        {isMale ? (
          /* BÉ TRAI: ĐẦU BÉ TRAI CUTE VỚI TÓC 3 CHỎM */
          <g id="dau-be-trai-3-chom">
            <circle cx="26" cy="26" r="15" fill="#ffe0bd" stroke="#3a2510" strokeWidth="2.5" />
            <circle cx="16" cy="29" r="3.2" fill="#ff7979" opacity="0.7" />
            <circle cx="36" cy="29" r="3.2" fill="#ff7979" opacity="0.7" />
            <circle cx="19.5" cy="24" r="2.4" fill="#2c3e50" />
            <circle cx="20.5" cy="23" r="0.9" fill="#ffffff" />
            <circle cx="32.5" cy="24" r="2.4" fill="#2c3e50" />
            <circle cx="33.5" cy="23" r="0.9" fill="#ffffff" />
            <path d="M21 30 Q26 35 31 30" stroke="#3a2510" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M22 13 C22 3, 30 3, 30 13 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="2" />
            <rect x="22.5" y="10" width="7" height="2.5" fill={malePalette.ribbon} rx="1" stroke="#3a2510" strokeWidth="1" />
            <path d="M13 21 C6 17, 7 24, 13 24 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="1.8" />
            <circle cx="12" cy="21.5" r="2" fill={malePalette.ribbon} stroke="#3a2510" strokeWidth="1" />
            <path d="M39 21 C46 17, 45 24, 39 24 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="1.8" />
            <circle cx="40" cy="21.5" r="2" fill={malePalette.ribbon} stroke="#3a2510" strokeWidth="1" />
          </g>
        ) : (
          /* BÉ GÁI: ĐẦU BÉ GÁI CUTE VỚI TÓC ĐUÔI GÀ */
          <g id="dau-be-gai-toc-duoi-ga">
            <circle cx="26" cy="26" r="15" fill="#ffe0bd" stroke="#3a2510" strokeWidth="2.5" />
            <path d="M12 23 C12 12, 40 12, 40 23 C33 15, 19 15, 12 23 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="1.5" />
            <path d="M18 18 Q22 21 26 18 Q30 21 34 18" stroke="#3a2510" strokeWidth="1.5" fill="none" />
            <path d="M38 15 C50 8, 52 25, 42 28 C45 21, 42 17, 38 15 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="2" />
            <circle cx="38.5" cy="15.5" r="3" fill={femalePalette.bow} stroke="#3a2510" strokeWidth="1" />
            <path d="M38.5 15.5 L42 19.5 M38.5 15.5 L36 21" stroke={femalePalette.bow} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="29" r="3.2" fill="#ff7979" opacity="0.7" />
            <circle cx="36" cy="29" r="3.2" fill="#ff7979" opacity="0.7" />
            <circle cx="19.5" cy="24" r="2.4" fill="#2c3e50" />
            <circle cx="20.5" cy="23" r="0.9" fill="#ffffff" />
            <circle cx="32.5" cy="24" r="2.4" fill="#2c3e50" />
            <circle cx="33.5" cy="23" r="0.9" fill="#ffffff" />
            <path d="M17.5 21.5 Q19.5 20 21.5 22" stroke="#3a2510" strokeWidth="1" fill="none" />
            <path d="M34.5 21.5 Q32.5 20 30.5 22" stroke="#3a2510" strokeWidth="1" fill="none" />
            <path d="M21 30 Q26 35 31 30" stroke="#3a2510" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>

      {/* 2. DESKTOP VERSION (Full body) */}
      <svg
        width={fullDimensions.width}
        height={fullDimensions.height}
        viewBox="0 0 60 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden lg:block filter drop-shadow-xs"
      >
        {/* Shadow under character */}
        <ellipse cx="30" cy="71" rx="18" ry="4" fill="#3a2510" opacity="0.22" />

        {isMale ? (
          /* BÉ TRAI: CỞI TRẦN ĐÓNG KHỐ, TÓC 3 CHỎM FULL BODY */
          <g id="be-trai-full-body">
            {/* Chubby feet */}
            <ellipse cx="22" cy="66" rx="5" ry="3.5" fill="#ffd0a8" stroke="#3a2510" strokeWidth="2" />
            <ellipse cx="38" cy="66" rx="5" ry="3.5" fill="#ffd0a8" stroke="#3a2510" strokeWidth="2" />

            {/* Loincloth (Đóng khố) */}
            <path
              d="M17 48 C17 44, 43 44, 43 48 L41 62 C30 65, 30 65, 19 62 Z"
              fill={malePalette.loincloth}
              stroke="#3a2510"
              strokeWidth="2.5"
            />
            {/* Loincloth front flap */}
            <path
              d="M26 47 L25 68 C25 70, 35 70, 35 68 L34 47 Z"
              fill={malePalette.flap}
              stroke="#3a2510"
              strokeWidth="1.5"
            />
            {/* Loincloth knot */}
            <circle cx="30" cy="48" r="3" fill="#f39c12" stroke="#3a2510" strokeWidth="1.5" />

            {/* Bare Torso & Chubby Belly */}
            <path
              d="M19 48 C16 34, 44 34, 41 48 Z"
              fill="#ffe0bd"
              stroke="#3a2510"
              strokeWidth="2.5"
            />
            {/* Cute Belly Button */}
            <ellipse cx="30" cy="43" r="1.2" fill="#d89674" />

            {/* Cute Bare Arms */}
            <path d="M16 35 Q9 43 15 49" stroke="#3a2510" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M44 35 Q51 43 45 49" stroke="#3a2510" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M16 35 Q9 43 15 49" stroke="#ffe0bd" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M44 35 Q51 43 45 49" stroke="#ffe0bd" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Head */}
            <circle cx="30" cy="25" r="14" fill="#ffe0bd" stroke="#3a2510" strokeWidth="2.5" />

            {/* Rosy Cheeks */}
            <circle cx="20" cy="28" r="3.2" fill="#ff7979" opacity="0.65" />
            <circle cx="40" cy="28" r="3.2" fill="#ff7979" opacity="0.65" />

            {/* Eyes & Smile */}
            <circle cx="23.5" cy="23" r="2.2" fill="#2c3e50" />
            <circle cx="24.5" cy="22" r="0.8" fill="#ffffff" />
            <circle cx="36.5" cy="23" r="2.2" fill="#2c3e50" />
            <circle cx="37.5" cy="22" r="0.8" fill="#ffffff" />
            <path d="M25 29 Q30 34 35 29" stroke="#3a2510" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* HAIRSTYLE: TÓC 3 CHỎM */}
            <path d="M26 12 C26 3, 34 3, 34 12 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="2" />
            <rect x="26.5" y="9.5" width="7" height="2.5" fill={malePalette.ribbon} rx="1" stroke="#3a2510" strokeWidth="1" />
            <path d="M17 20 C10 16, 11 23, 17 23 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="1.8" />
            <circle cx="16" cy="20.5" r="2" fill={malePalette.ribbon} stroke="#3a2510" strokeWidth="1" />
            <path d="M43 20 C50 16, 49 23, 43 23 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="1.8" />
            <circle cx="44" cy="20.5" r="2" fill={malePalette.ribbon} stroke="#3a2510" strokeWidth="1" />
          </g>
        ) : (
          /* BÉ GÁI: MẶC YẾM VÀ VÁY, TÓC ĐUÔI GÀ FULL BODY */
          <g id="be-gai-full-body">
            {/* Feet */}
            <ellipse cx="23" cy="66" rx="4" ry="3" fill="#ffd0a8" stroke="#3a2510" strokeWidth="2" />
            <ellipse cx="37" cy="66" rx="4" ry="3" fill="#ffd0a8" stroke="#3a2510" strokeWidth="2" />

            {/* Skirt */}
            <path d="M16 48 C15 65, 45 65, 44 48 Z" fill={femalePalette.skirt} stroke="#3a2510" strokeWidth="2.5" />

            {/* Halter Top (Áo Yếm) */}
            <path d="M30 33 L41 48 L19 48 Z" fill={femalePalette.yem} stroke="#3a2510" strokeWidth="2.5" />
            <path d="M26 31 Q30 35 34 31" stroke="#3a2510" strokeWidth="1.8" fill="none" />
            <path d="M30 33 L30 28" stroke="#3a2510" strokeWidth="1.8" strokeDasharray="1 1" fill="none" />

            {/* Silk Sash */}
            <rect x="18" y="46.5" width="24" height="4" fill={femalePalette.sash} rx="1" stroke="#3a2510" strokeWidth="1.5" />
            <path d="M33 48 Q37 57 35 63" stroke={femalePalette.sash} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M33 48 Q37 57 35 63" stroke="#3a2510" strokeWidth="1" strokeLinecap="round" fill="none" />

            {/* Arms */}
            <path d="M16 36 Q9 43 15 48" stroke="#3a2510" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M44 36 Q51 43 45 48" stroke="#3a2510" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M16 36 Q9 43 15 48" stroke="#ffe0bd" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M44 36 Q51 43 45 48" stroke="#ffe0bd" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Head */}
            <circle cx="30" cy="25" r="13.5" fill="#ffe0bd" stroke="#3a2510" strokeWidth="2.5" />

            {/* Hair Cap & Bangs */}
            <path d="M16.5 22 C16.5 12, 43.5 12, 43.5 22 C37 15, 23 15, 16.5 22 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="1.5" />
            <path d="M22 18 Q26 21 30 18 Q34 21 38 18" stroke="#3a2510" strokeWidth="1.5" fill="none" />

            {/* Ponytail plume */}
            <path d="M41 15 C54 8, 56 25, 46 29 C49 22, 46 17, 41 15 Z" fill="#2c3e50" stroke="#3a2510" strokeWidth="2" />
            <circle cx="41.5" cy="15.5" r="3" fill={femalePalette.bow} stroke="#3a2510" strokeWidth="1" />
            <path d="M41.5 15.5 L45 19.5 M41.5 15.5 L39 21" stroke={femalePalette.bow} strokeWidth="2.5" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="20" cy="28" r="3" fill="#ff7979" opacity="0.65" />
            <circle cx="40" cy="28" r="3" fill="#ff7979" opacity="0.65" />

            {/* Eyes & Eyelashes & Smile */}
            <circle cx="23.5" cy="23" r="2.2" fill="#2c3e50" />
            <circle cx="24.5" cy="22" r="0.8" fill="#ffffff" />
            <circle cx="36.5" cy="23" r="2.2" fill="#2c3e50" />
            <circle cx="37.5" cy="22" r="0.8" fill="#ffffff" />
            <path d="M21.5 20.5 Q23.5 19 25.5 21" stroke="#3a2510" strokeWidth="1" fill="none" />
            <path d="M38.5 20.5 Q36.5 19 34.5 21" stroke="#3a2510" strokeWidth="1" fill="none" />
            <path d="M25 29 Q30 34 35 29" stroke="#3a2510" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export const RenderPieceItem: React.FC<{
  piece: Piece;
  isMoving?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: TeamColor;
}> = ({ piece, isMoving = false, size = 'md', colorScheme }) => {
  if (piece.type === 'quan') {
    return (
      <QuanCharacter
        colorScheme={colorScheme || (piece.variant === 1 ? 'red' : 'blue')}
        gender={piece.gender || 'male'}
        isMoving={isMoving}
        size={size}
      />
    );
  }
  return (
    <DanCharacter
      gender={piece.gender || 'male'}
      isMoving={isMoving}
      size={size === 'lg' ? 'md' : 'sm'}
      variant={piece.variant || 1}
    />
  );
};
