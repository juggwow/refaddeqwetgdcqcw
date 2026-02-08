"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, ArrowRight, Music, Volume2, VolumeX, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

// --- Configuration ---
const CONFIG = {
  partnerName: "Teerak",
  memoryImage: "/us.jpg", // ใส่ / นำหน้าชื่อไฟล์ใน public
  reassuranceText: [
    "ในวันที่เธอมีความสุข",
    "ในวันที่เธอมีความทุกข์",
    "หรือในวันที่เธอไม่สบายใจ",
    "เราพร้อมรับฟังและจะอยู่ข้างเธอเสมอ ❤️",
  ],
  reasons: [
    {
      id: 1,
      text: "ในตอนเธอยิ้มให้",
      image: "/smile-2.jpg"
    },
    {
      id: 2,
      text: "ในตอนที่เที่ยวด้วยกัน",
      image: "/travel.jpg"
    },
    {
      id: 3,
      text: "ในตอนที่กินของอร่อย",
      image: "/yummy.jpg"
    },
    {
      id: 4,
      text: "และทุกๆตอน",
      image: "/all-time.jpg"
    },
  ],
};

// --- Components ---

// Stage 0: Intro (รอ Load รูปเสร็จก่อนถึงกดได้)
const StageIntro = ({
  onNext,
  onStartMusic,
  isLoading
}: {
  onNext: () => void,
  onStartMusic: () => void,
  isLoading: boolean
}) => {

  const handleStart = () => {
    if (!isLoading) {
      onStartMusic();
      onNext();
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center space-y-8 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className="relative cursor-pointer" onClick={handleStart}>
        <motion.div
          animate={{ scale: isLoading ? [1, 0.9, 1] : [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: isLoading ? 0.6 : 1.2 }}
          className={`text-rose-500 drop-shadow-2xl ${isLoading ? "opacity-70 grayscale" : "opacity-100"}`}
        >
          <Heart size={100} fill="currentColor" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`
            px-8 py-3 rounded-full flex items-center gap-2 shadow-lg font-bold text-lg transition-all mx-auto
            ${isLoading
              ? "bg-rose-100 text-rose-400 cursor-wait"
              : "bg-rose-500 active:bg-rose-600 text-white shadow-rose-200 animate-bounce"
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-sm">
              Loading...
            </span>
          ) : (
            <>Get Start <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Stage 1: Memory
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
      <div className="mt-4 text-center text-rose-800 text-xl font-bold">
        "วันของเรา :)"
      </div>
    </div>
    <button onClick={onNext} className="bg-rose-500 active:bg-rose-600 text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-rose-200 font-medium text-lg touch-manipulation">
      <ArrowRight size={20} />
    </button>
  </motion.div>
);

// Stage 2: Reassurance (ข้อความขึ้นครบ ปุ่มถึงโผล่)
const StageReassurance = ({ onNext }: { onNext: () => void }) => {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="px-8 text-center flex flex-col justify-center h-full space-y-6 relative z-10">
      {CONFIG.reassuranceText.map((text, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 1.5, duration: 0.8 }}
          onAnimationComplete={() => {
            if (index === CONFIG.reassuranceText.length - 1) {
              setIsFinished(true);
            }
          }}
          className="text-2xl text-rose-800 leading-relaxed font-medium"
        >
          {text}
        </motion.p>
      ))}

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

// Stage 3: Interactive (Auto close 5s)
const StageInteractive = ({ onNext }: { onNext: () => void }) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [viewed, setViewed] = useState<number[]>([]);

  useEffect(() => {
    if (activeId !== null) {
      const timer = setTimeout(() => {
        setActiveId(null);
      }, 5000); // 5 วินาทีปิดเอง
      return () => clearTimeout(timer);
    }
  }, [activeId]);

  const handleCardClick = (id: number) => {
    if (activeId !== null) return;
    setActiveId(id);
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
    }
  };

  const isAllViewed = viewed.length === CONFIG.reasons.length;

  return (
    <div className="w-full h-full px-6 flex flex-col justify-center items-center relative">
      <h2 className="text-2xl font-bold text-rose-600 mb-8 z-10 drop-shadow-sm">
        เราอยู่ข้างเธอเสมอ
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-20 z-10">
        {CONFIG.reasons.map((item) => {
          const isViewed = viewed.includes(item.id);
          return (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => handleCardClick(item.id)}
              className={`
                relative h-32 rounded-2xl cursor-pointer shadow-sm overflow-hidden border-2 transition-colors
                ${isViewed ? "border-rose-400 bg-white" : "bg-rose-400 border-transparent"}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {isViewed ? (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Stars size={32} className="text-white animate-pulse" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
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
                    <h3 className="text-2xl font-bold text-rose-600">
                      {item.text}
                    </h3>
                    {/* Progress Bar */}
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
              สุดท้าย
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stage 4: Finale
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
        <h1 className="text-4xl font-bold text-rose-500 drop-shadow-sm">
          Happy Valentine's
        </h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs mx-auto mt-6 bg-white p-4 rounded-xl shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300 border border-rose-100"
        >
          <div className="relative aspect-square rounded-lg overflow-hidden bg-rose-50 mb-4 shadow-inner">
            <img
              src="/hand.jpg"
              alt="Flower"
              className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
            />
          </div>
        </motion.div>
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

// --- Main App Controller ---
export default function ValentineApp() {
  const [stage, setStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Preload Images
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = [
        CONFIG.memoryImage,
        ...CONFIG.reasons.map(r => r.image),
        "/hand.jpg",
      ];

      const promises = imageUrls.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(promises);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => { });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-rose-50 via-white to-rose-100 overflow-hidden touch-none select-none">

      <audio ref={audioRef} loop src="/bgm.mp3" />

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
              isLoading={isLoading}
            />
          )}
          {stage === 1 && <StageMemory key="1" onNext={() => setStage(2)} />}
          {stage === 2 && <StageReassurance key="2" onNext={() => setStage(3)} />}
          {stage === 3 && <StageInteractive key="3" onNext={() => setStage(4)} />}
          {stage === 4 && <StageFinale key="4" onRestart={() => setStage(0)} />}
        </AnimatePresence>
      </main>

      <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 pb-safe">
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${s <= stage ? "w-6 bg-rose-500" : "w-1.5 bg-rose-200"}`}
          />
        ))}
      </div>
    </div>
  );
}