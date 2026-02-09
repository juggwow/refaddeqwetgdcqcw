"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, KeyRound, Sparkles, Loader2, Delete, ChevronRight } from "lucide-react";

import ValentineApp from "@/component/valentine";
import { verifyAndGetConfig } from "./action";

type ConfigType = any;

export default function Page() {
  const [status, setStatus] = useState<'locked' | 'unlocked'>('locked');
  const [configData, setConfigData] = useState<ConfigType | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ฟังก์ชันกดตัวเลข
  const handleNumClick = (num: number) => {
    if (inputValue.length < 6) { // จำกัดความยาวไม่เกิน 6 ตัว
      setInputValue((prev) => prev + num);
      setErrorMsg(""); // เคลียร์ Error เมื่อมีการพิมพ์ใหม่
    }
  };

  // ฟังก์ชันลบตัวเลข
  const handleDelete = () => {
    setInputValue((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  // ฟังก์ชันส่งรหัส (Submit)
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      // ส่งรหัสไปตรวจ (แม้จะเป็นค่าว่าง "" ก็ส่งไปได้)
      const result = await verifyAndGetConfig(inputValue);

      if (result) {
        setConfigData(result.data);
        setStatus('unlocked');
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">

        {/* --- 1. หน้าใส่รหัส (Keypad UI) --- */}
        {status === 'locked' && (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="fixed inset-0 w-full h-[100dvh] bg-rose-50 flex flex-col items-center justify-center px-6 overflow-hidden select-none"
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 left-10 text-rose-200"
              >
                <Heart size={40} />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute bottom-10 right-10 text-rose-200"
              >
                <Sparkles size={40} />
              </motion.div>
            </div>

            {/* Login Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-rose-200 w-full max-w-xs text-center relative z-10"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="bg-rose-100 p-3 rounded-full text-rose-500 mb-2">
                  <Lock size={24} />
                </div>
              </div>

              {/* จอแสดงผลตัวเลข (Display) */}
              <div className="mb-6 h-12 flex items-center justify-center gap-2">
                {/* เปลี่ยนเป็นจุด • แทนตัวเลขเพื่อให้ดูเป็นรหัสลับ (หรือจะเอา inputValue แสดงเลยก็ได้) */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${i < inputValue.length ? "bg-rose-500 scale-110" : "bg-rose-200 scale-100"
                      }`}
                  />
                ))}
              </div>

              {/* ข้อความ Error */}
              <div className="h-6 mb-2">
                {errorMsg && <p className="text-red-400 text-xs animate-pulse">{errorMsg}</p>}
              </div>

              {/* แป้นพิมพ์ตัวเลข (Numpad Grid) */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <motion.button
                    key={num}
                    whileTap={{ scale: 0.85, backgroundColor: "#fecdd3" }}
                    onClick={() => handleNumClick(num)}
                    className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 text-2xl font-bold shadow-sm hover:bg-rose-100 transition-colors mx-auto flex items-center justify-center"
                  >
                    {num}
                  </motion.button>
                ))}

                {/* แถวล่าง: ลบ | 0 | ตกลง */}
                <div className="flex items-center justify-center">
                  {inputValue.length > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleDelete}
                      className="w-16 h-16 rounded-full text-rose-300 hover:text-rose-500 transition-colors flex items-center justify-center"
                    >
                      <Delete size={24} />
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.85, backgroundColor: "#fecdd3" }}
                  onClick={() => handleNumClick(0)}
                  className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 text-2xl font-bold shadow-sm hover:bg-rose-100 transition-colors mx-auto flex items-center justify-center"
                >
                  0
                </motion.button>

                <div className="flex items-center justify-center">
                  {/* ปุ่ม Enter (ปลดล็อค) */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-16 h-16 rounded-full bg-rose-500 text-white shadow-md shadow-rose-200 flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <ChevronRight size={32} />}
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* --- 2. หน้า ValentineApp --- */}
        {status === 'unlocked' && configData && (
          <motion.div
            key="app-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            <ValentineApp CONFIG={configData} />
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}