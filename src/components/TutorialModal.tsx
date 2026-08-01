import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const TutorialModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#3a2510]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#fef9e7] border-4 border-[#b87333] rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative text-[#4a2e1b]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#c0392b] text-white font-extrabold text-sm flex items-center justify-center hover:bg-[#a93226] transition-colors cursor-pointer shadow-md"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-[#d3be9c] pb-3">
              <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-[#8e2a2a] flex items-center justify-center gap-2">
                <span>🏮</span> HƯỚNG DẪN CHƠI Ô ĂN QUAN
              </h2>
              <p className="text-xs text-[#784d28] mt-1">
                Trò chơi dân gian Việt Nam với hình tượng Quan mập mạp & Dân ngộ nghĩnh
              </p>
            </div>

            {/* Rules Steps */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* 🎨 1. Team selection */}
              <div className="p-3 bg-[#fdebd0] rounded-2xl border border-[#f5b7b1]">
                <h3 className="font-extrabold text-[#c0392b] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>🚩</span> Chọn Đội Đỏ / Đội Xanh
                </h3>
                <p className="text-[#5c3a21] leading-relaxed">
                  Bạn có thể chọn cầm <strong>Đội Đỏ</strong> hoặc <strong>Đội Xanh</strong> bằng cách <strong>bấm trực tiếp vào khung báo điểm/tên đội</strong>. Khi chọn đội, màu sắc cờ hàng dưới/hàng trên cũng như màu trang phục của <strong>Quan Bà (Ô 6)</strong> và <strong>Quan Ông (Ô 12)</strong> sẽ thay đổi tương ứng theo màu đội của bạn.
                </p>
              </div>

              {/* ⏱️ 2. Timer & Time Rules */}
              <div className="p-3 bg-[#ebf5fb] rounded-2xl border border-[#aed6f1]">
                <h3 className="font-extrabold text-[#2980b9] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>⏱️</span> Thời Gian Lượt Chơi & Luật Đếm Ngược
                </h3>
                <p className="text-[#1b4f72] leading-relaxed">
                  • <strong>Thanh đếm ngược</strong> thời gian nằm ngay bên dưới ô báo điểm của từng đội.<br />
                  • <strong>Luật hết giờ</strong>: Khi hết thời gian trong lượt đi của mình, người chơi sẽ <strong>bị mất lượt</strong> (chuyển lượt cho đối thủ, không tự động rải quân).<br />
                  • Bạn có thể cài đặt mốc thời gian lượt đi: <strong>30s, 60s, 90s, 120s</strong> hoặc <strong>Ô tự nhập tùy chỉnh</strong> (từ 5s đến 600s).
                </p>
              </div>

              {/* ⚙️ 3. Settings & Customization */}
              <div className="p-3 bg-[#f3e5f5] rounded-2xl border border-[#e1bee7]">
                <h3 className="font-extrabold text-[#8e44ad] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>⚙️</span> Menu Tuỳ Chỉnh & Điều Khiển
                </h3>
                <p className="text-[#4a148c] leading-relaxed">
                  • <strong>Cấp độ chơi</strong>: Dễ, Trung bình, Khó.<br />
                  • <strong>Tốc độ rải quân</strong>: Chậm, Bình thường, Nhanh.<br />
                  • <strong>Bắt đầu / Tạm dừng</strong>: Bấm nút Bắt đầu chơi để tính giờ, hoặc Tạm dừng khi phải rời màn hình.<br />
                  • <strong>Âm thanh</strong>: Bật/Tắt hiệu ứng sâm thanh nhảy rải quân và ăn cờ sinh động.
                </p>
              </div>

              {/* 4. Setup */}
              <div className="p-3 bg-[#f4e4c1]/60 rounded-2xl border border-[#d3be9c]">
                <h3 className="font-extrabold text-[#922b21] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>1️⃣</span> Bàn Cờ & Quân Cờ
                </h3>
                <p className="text-[#5c3a21] leading-relaxed">
                  Bàn cờ gồm <strong>10 Ô Dân</strong> (mỗi bên 5 ô, bắt đầu với 5 Dân trẻ trâu/ô, 1 Dân = <strong>1 điểm</strong>) và <strong>2 Ô Quan</strong> ở hai đầu (mỗi ô chứa 1 Quan mập mạp = <strong>10 điểm</strong>).
                </p>
              </div>

              {/* 5. Movement */}
              <div className="p-3 bg-[#f4e4c1]/60 rounded-2xl border border-[#d3be9c]">
                <h3 className="font-extrabold text-[#922b21] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>2️⃣</span> Rải Quân (Di Chuyển)
                </h3>
                <p className="text-[#5c3a21] leading-relaxed">
                  Trong lượt chơi của mình, bạn chọn 1 Ô Dân có quân bên phía mình, chọn <strong>Rải quân sang Trái ⬅️</strong> hoặc <strong>Rải quân sang Phải ➡️</strong>. Bốc hết quân ở ô đó và rải lần lượt từng ô mỗi ô 1 quân.
                </p>
              </div>

              {/* 6. Continuation */}
              <div className="p-3 bg-[#f4e4c1]/60 rounded-2xl border border-[#d3be9c]">
                <h3 className="font-extrabold text-[#922b21] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>3️⃣</span> Chơi Tiếp
                </h3>
                <p className="text-[#5c3a21] leading-relaxed">
                  Khi rải đến quân cuối cùng, nếu ô liền kề tiếp theo là một <strong>Ô Dân CÓ QUÂN</strong>, bạn bốc toàn bộ quân ở ô đó và tiếp tục rải theo hướng cũ!
                </p>
              </div>

              {/* 7. Eating Pieces */}
              <div className="p-3 bg-[#e8f8f5] rounded-2xl border border-[#a3e4d7]">
                <h3 className="font-extrabold text-[#196f3d] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>4️⃣</span> Ăn Quân & Ăn Chập ✨
                </h3>
                <p className="text-[#145a32] leading-relaxed">
                  Nếu quân cuối cùng rơi vào 1 ô, và ô liền kề là <strong>Ô TRỐNG</strong>, và ô BÊN CẠNH Ô TRỐNG (ô kế tiếp) CÓ QUÂN ➔ Bạn được <strong>ĂN SẠCH</strong> toàn bộ quân ở ô đó! Nếu sau ô bị ăn lại có 1 ô trống và ô tiếp theo nữa có quân ➔ Tiếp tục <strong>ĂN CHẬP</strong>!
                </p>
              </div>

              {/* 8. Turn End */}
              <div className="p-3 bg-[#fadbd8]/60 rounded-2xl border border-[#f5b7b1]">
                <h3 className="font-extrabold text-[#78281f] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>5️⃣</span> Mất Lượt / Dừng Đi
                </h3>
                <p className="text-[#78281f] leading-relaxed">
                  Lượt đi sẽ dừng lại khi gặp phải Ô Quan có quân (không được rải tiếp Quan), hoặc khi gặp 2 ô trống liên tiếp.
                </p>
              </div>

              {/* 9. Replenishing side */}
              <div className="p-3 bg-[#fef5e7] rounded-2xl border border-[#f8c471]">
                <h3 className="font-extrabold text-[#d35400] mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>6️⃣</span> Rải 5 Quân Khi Hết Quân
                </h3>
                <p className="text-[#a04000] leading-relaxed">
                  Nếu cả 5 Ô của bạn đều trống (không còn dân), bạn bắt buộc dùng <strong>5 điểm</strong> để đổi lấy 5 dân rồi rải đều vào các ô của mình. Nếu không đủ điểm sẽ phải vay nợ, và trả nợ khi kết thúc ván!
                </p>
              </div>

              {/* 10. Victory */}
              <div className="p-3 bg-[#fdfefe] rounded-2xl border border-[#d5dbdb] text-center">
                <h3 className="font-extrabold text-[#2c3e50] mb-1 text-sm sm:text-base">
                  🏆 Kết Thúc & Thắng Cuộc
                </h3>
                <p className="text-[#34495e] leading-relaxed">
                  Trò chơi kết thúc khi <strong>CẢ 2 Ô QUAN ĐỀU HẾT QUÂN</strong>. Toàn bộ Dân còn lại ở hàng của ai thuộc về người đó. Người có tổng điểm cao nhất sẽ thắng!
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#1e8449] text-white font-extrabold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                BẠN ĐÃ BIẾT CÁCH CHƠI?!! BẮT ĐẦU NHÉ!!! 🚀
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
