import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, RotateCw, CheckCircle2 } from 'lucide-react';

export const RotateDevicePrompt: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      // Check if mobile or tablet (width <= 1024 or touch enabled)
      const isMobileOrTablet =
        window.innerWidth <= 1024 ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      // Show prompt if device is in portrait mode on mobile/tablet
      if (isPortrait && isMobileOrTablet) {
        setIsPortraitMobile(true);
      } else {
        setIsPortraitMobile(false);
        setDismissed(false); // reset dismissal when they rotate to landscape
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortraitMobile || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.85, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 20 }}
          className="relative max-w-sm w-full bg-[#fbeee0] border-4 border-[#8e2a2a] rounded-3xl p-6 shadow-2xl text-center overflow-hidden flex flex-col items-center"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-2 left-2 text-[#8e2a2a]/30 text-xs">❖</div>
          <div className="absolute top-2 right-2 text-[#8e2a2a]/30 text-xs">❖</div>
          <div className="absolute bottom-2 left-2 text-[#8e2a2a]/30 text-xs">❖</div>
          <div className="absolute bottom-2 right-2 text-[#8e2a2a]/30 text-xs">❖</div>

          {/* Animated Phone Rotation Illustration */}
          <div className="relative my-4 flex items-center justify-center w-24 h-24 rounded-full bg-[#f5d6ba] border-2 border-[#cbb087] shadow-inner">
            <motion.div
              animate={{ rotate: [0, -90, -90, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="text-[#8e2a2a]"
            >
              <Smartphone className="w-12 h-12 stroke-[2.2]" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="absolute text-[#c0392b]"
            >
              <RotateCw className="w-16 h-16 stroke-[1.8] opacity-70" />
            </motion.div>
          </div>

          <h3 className="font-serif font-extrabold text-xl text-[#8e2a2a] mb-2 flex items-center justify-center gap-2">
            <span>🔄</span> XOAY NGANG MÀN HÌNH
          </h3>

          <p className="text-xs sm:text-sm text-[#5c3a21] font-medium leading-relaxed mb-5">
            Trò chơi <strong>Ô Ăn Quan</strong> được thiết kế tối ưu nhất khi xoay ngang thiết bị.
            Vui lòng <strong>xoay ngang màn hình (Landscape)</strong> để có trải nghiệm chơi tốt nhất nhé!
          </p>

          <div className="flex flex-col w-full gap-2.5">
            <button
              onClick={() => setDismissed(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8e2a2a] to-[#c0392b] text-white font-extrabold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ĐÃ XOAY NGANG / TIẾP TỤC CHƠI</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
