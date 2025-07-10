"use client";
import React, { useEffect } from "react";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = /thêm|đã|thành công/i.test(message);
  const isError = /lỗi|thất bại|không/i.test(message);
  const isInfo = !isSuccess && !isError;

  const icon = isSuccess
    ? <CheckCircle className="text-green-100 w-5 h-5 mt-1" />
    : isError
    ? <AlertTriangle className="text-yellow-100 w-5 h-5 mt-1" />
    : <Info className="text-blue-100 w-5 h-5 mt-1" />;

  const bgGradient = isSuccess
    ? "from-green-500 to-emerald-400"
    : isError
    ? "from-rose-500 to-red-400"
    : "from-sky-500 to-indigo-400";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-fade-in-up">
      <div
        className={clsx(
          "flex items-start space-x-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm",
          "text-white transition-all duration-300 ease-in-out bg-gradient-to-r",
          bgGradient
        )}
      >
        {icon}
        <div className="flex-1 text-sm font-medium leading-snug">{message}</div>
        <button onClick={onClose} className="hover:opacity-80 transition-opacity">
          <X size={16} className="mt-1" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
