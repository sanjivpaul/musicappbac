import React from "react";
import { XCircle, CheckCircle, Info } from "lucide-react";

const variantStyles = {
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
};

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export default function AlertMessage({ type = "info", message, onClose }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg shadow-sm ${variantStyles[type]} animate-fadeIn mb-5`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="font-bold px-2">
        ✕
      </button>
    </div>
  );
}
