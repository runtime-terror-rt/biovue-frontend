"use client";

import { motion } from "framer-motion";

interface Props {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

export default function Toggle({ enabled, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-[#0D9488]" : "bg-gray-200"
      }`}
    >
      <span className="sr-only">Toggle setting</span>
      <motion.span
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}
