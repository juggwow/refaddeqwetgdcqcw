"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, ArrowRight, Music, Volume2, VolumeX, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

// --- Configuration ---
const CONFIG = {
  partnerName: "Teerak",
  memoryImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop",
  reassuranceText: [
    "ในวันที่เธอมีความสุข",
    "ในวันที่เธอมีความทุกข์",
    "หรือในวันที่เธอไม่สบายใจ",
    "เราพร้อมรับฟังและจะอยู่ข้างเธอเสมอ ❤️",
  ],
  // --- แก้ไขส่วนนี้ (ใส่รูปที่ต้องการให้เด้งออกมา) ---
  reasons: [
    {
      id: 1,
      text: "ในตอนเธอยิ้มให้",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      text: "ในตอนที่เที่ยวด้วยกัน",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      text: "ในตอนที่กินของอร่อย",
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      text: "และทุกๆตอน",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop"
    },
  ],
};

// --- Components ---

// เพิ่ม prop: onStartMusic เพื่อรับคำสั่งเปิดเพลง
const StageIntro = ({ onNext, onStartMusic }: { onNext: () => void, onStartMusic: () => void }) => {

  const handleStart = () => {
    onStartMusic(); // สั่งเล่นเพลง
    onNext();       // เปลี่ยนหน้า
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center space-y-6 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className="relative cursor-pointer" onClick={handleStart}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-rose-500 drop-shadow-2xl"
        >
          <Heart size={100} fill="currentColor" />
        </motion.div>
      </div>

      <button onClick={onNext} className="bg-rose-500 active:bg-rose-600 text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-rose-200 font-medium text-lg touch-manipulation">
        Get Start
      </button>
    </motion.div>
  );
};

const StageMemory = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    className="w-full px-6 flex flex-col items-center space-y-8"
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -50, opacity: 0 }}
  >
    <div className="bg-white p-3 pb-12 shadow-xl rotate-2 rounded-lg w-full max-w-[300px] mx-auto transform transition active:scale-95 duration-300">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100">
        <img src={CONFIG.memoryImage} alt="Memory" className="w-full h-full object-cover" />
      </div>
      <div className="mt-4 text-center font-serif text-gray-600 italic text-lg">
        "วันของเรา :)"
      </div>
    </div>
    <button onClick={onNext} className="bg-rose-500 active:bg-rose-600 text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-rose-200 font-medium text-lg touch-manipulation">
      <ArrowRight size={20} />
    </button>
  </motion.div>
);

const StageReassurance = ({ onNext }: { onNext: () => void }) => {
  // State สำหรับเช็คว่าข้อความขึ้นครบหรือยัง
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="px-8 text-center flex flex-col justify-center h-full space-y-6 relative z-10">
      {CONFIG.reassuranceText.map((text, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 1.8, duration: 1 }}
          // ตรวจจับว่าบรรทัดสุดท้ายแสดงผลเสร็จหรือยัง
          onAnimationComplete={() => {
            if (index === CONFIG.reassuranceText.length - 1) {
              setIsFinished(true);
            }
          }}
          className="text-2xl text-rose-800 font-serif leading-relaxed"
        >
          {text}
        </motion.p>
      ))}

      {/* ปุ่มจะปรากฎขึ้นมาเมื่อข้อความแสดงครบแล้วเท่านั้น */}
      <div className="h-20 flex items-center justify-center mt-8">
        {isFinished && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-rose-200 font-medium text-lg"
          >
            <ArrowRight size={20} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

const StageInteractive = ({ onNext }: { onNext: () => void }) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [viewed, setViewed] = useState<number[]>([]);

  // Effect: ตั้งเวลาปิดเอง 5 วินาที เมื่อมีรูปเปิดอยู่
  useEffect(() => {
    if (activeId !== null) {
      const timer = setTimeout(() => {
        setActiveId(null);
      }, 5000); // 5000ms = 5 วินาที
      return () => clearTimeout(timer);
    }
  }, [activeId]);

  const handleCardClick = (id: number) => {
    // ถ้ากำลังเปิดรูปอื่นอยู่ ห้ามกดซ้อน
    if (activeId !== null) return;

    setActiveId(id);
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
    }
  };

  // เช็คว่าดูครบทุกรูปหรือยัง
  const isAllViewed = viewed.length === CONFIG.reasons.length;

  return (
    <div className="w-full h-full px-6 flex flex-col justify-center items-center relative">
      <h2 className="text-xl font-bold text-rose-600 mb-6 z-10 font-serif">
        เราอยู่ข้างเธอเสมอ
      </h2>

      {/* Grid 4 กล่อง */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-20 z-10">
        {CONFIG.reasons.map((item) => {
          const isViewed = viewed.includes(item.id);
          return (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => handleCardClick(item.id)}
              className={`
                relative h-32 rounded-2xl cursor-pointer shadow-sm overflow-hidden border-2
                ${isViewed ? "border-rose-300" : "bg-rose-400 border-transparent"}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                {isViewed ? (
                  // --- แก้ไข: รูปสีปกติ (ไม่ใส่ grayscale) ---
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // ยังไม่ดู: โชว์ดาวบนพื้นหลังสีชมพู
                  <div className="w-full h-full bg-rose-400 flex items-center justify-center">
                    <Stars size={32} className="text-white animate-pulse" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- Popup Image (Auto Close 5s) --- */}
      <AnimatePresence>
        {activeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            {/* pointer-events-none: ป้องกันการกดปิดเอง */}

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {CONFIG.reasons.map((item) => {
              if (item.id !== activeId) return null;
              return (
                <motion.div
                  key={item.id}
                  layoutId={`card-${item.id}`}
                  className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col pointer-events-auto"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 text-center bg-white relative overflow-hidden">
                    <h3 className="text-2xl font-bold text-rose-600 font-serif">
                      {item.text}
                    </h3>

                    {/* Progress Bar ด้านล่าง: บอกเวลา 5 วินาที */}
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-1.5 bg-rose-400"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* ปุ่มไปต่อ (แสดงเมื่อดูครบ และไม่มีรูปขยายอยู่) */}
      <div className="absolute bottom-20 h-16 flex items-center justify-center w-full z-0">
        <AnimatePresence>
          {isAllViewed && !activeId && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={onNext}
              className="bg-rose-600 text-white px-8 py-3 rounded-full shadow-xl font-bold text-lg animate-bounce"
            >
              สุดท้าย ❤️
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StageFinale = ({ onRestart }: { onRestart: () => void }) => {
  useEffect(() => {
    const end = Date.now() + 3000;
    const interval: any = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center px-4 space-y-6 flex flex-col items-center h-full justify-center"
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl font-bold text-rose-500 font-serif drop-shadow-sm">
          Happy Valentine's
        </h1>

        {/* --- ส่วนของขวัญ (เปลี่ยนเป็นดอกไม้) --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs mx-auto mt-6 bg-white p-4 rounded-xl shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300 border border-rose-100"
        >
          {/* รูปดอกไม้ */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-rose-50 mb-4 shadow-inner">
            <img
              // คุณสามารถเปลี่ยน URL รูปดอกไม้ที่ชอบได้ตรงนี้ครับ
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop"
              alt="Flower Bouquet"
              className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
            />
          </div>
        </motion.div>
        {/* --- ปุ่ม Replay (แบบ Icon หัวใจหมุน) --- */}
        <div className="h-24 flex items-start justify-center">
          <motion.button
            onClick={onRestart}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="group relative p-4 text-rose-300 hover:text-rose-500 transition-colors duration-300"
          >
            <RotateCcw size={48} strokeWidth={1.5} className="drop-shadow-md" />
            <div className="absolute inset-0 flex items-center justify-center pt-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart size={16} fill="currentColor" className="text-rose-500" />
              </motion.div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
export default function ValentineApp() {
  const [stage, setStage] = useState(0);

  // -- ส่วนจัดการเพลง --
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // เริ่มเล่นเพลง (จะถูกเรียกเมื่อ User กดปุ่มเริ่ม)
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // ปรับระดับเสียง 40% ไม่ให้ดังเกินไป
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(e => console.log("Audio play error:", e));
    }
  };

  // ปุ่มเปิด/ปิดเสียง
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = CONFIG.memoryImage;
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-rose-50 via-white to-rose-100 overflow-hidden touch-none select-none">

      {/* --- ส่วน Audio Element (ซ่อนไว้) --- */}
      {/* ใส่ไฟล์เพลงชื่อ bgm.mp3 ในโฟลเดอร์ public */}
      <audio ref={audioRef} loop src="/bgm.mp3" />

      {/* --- ปุ่มควบคุมเพลง (มุมขวาบน) --- */}
      <button
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-50 p-2 bg-white/50 backdrop-blur-sm rounded-full text-rose-600 shadow-sm active:scale-95 transition-all"
      >
        {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[10%] left-[10%] text-rose-300"
        >
          <Heart size={30} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] right-[10%] text-rose-300"
        >
          <Heart size={40} />
        </motion.div>
      </div>

      <main className="relative z-10 w-full h-full max-w-md mx-auto flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <StageIntro
              key="0"
              onNext={() => setStage(1)}
              onStartMusic={startMusic}
            />
          )}
          {stage === 1 && <StageMemory key="1" onNext={() => setStage(2)} />}
          {stage === 2 && <StageReassurance key="2" onNext={() => setStage(3)} />}
          {stage === 3 && <StageInteractive key="3" onNext={() => setStage(4)} />}
          {stage === 4 && <StageFinale key="4" onRestart={() => setStage(1)} />}
        </AnimatePresence>
      </main>

      <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 pb-safe">
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${s <= stage ? "w-6 bg-rose-500" : "w-1.5 bg-rose-200"
              }`}
          />
        ))}
      </div>
    </div>
  );
}