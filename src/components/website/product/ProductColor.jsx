"use client";
import React, { useState } from "react";

export default function ProductColor({ color, label }) {
  const initialSwatch = color || null;
  const initialLabel = label || color || null;
  const [activeSwatch, setActiveSwatch] = useState(initialSwatch);
  const [activeLabel, setActiveLabel] = useState(initialLabel);

  const colors = initialSwatch
    ? [{ value: initialSwatch, label: initialLabel }]
    : [];

  if (colors.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="text-[10px] text-[#1E1E1E] uppercase mb-2.5 tracking-[0.04em] font-medium">
        Color
        {activeLabel && (
          <span className="ml-2 normal-case text-[#6B7280] tracking-normal font-normal">
            — {activeLabel}
          </span>
        )}
      </div>
      <div className="flex gap-2 sm:gap-2.5 flex-wrap">
        {colors.map((c) => (
          <div
            key={c.value}
            onClick={() => {
              setActiveSwatch(c.value);
              setActiveLabel(c.label);
            }}
            title={c.label}
            className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full cursor-pointer border-2 border-solid transition-all duration-150 cursor-pointer"
            style={{
              backgroundColor: c.value,
              borderColor: activeSwatch === c.value ? c.value : "transparent",
              boxShadow: activeSwatch === c.value ? "0 0 0 3px rgba(139,94,60,0.15)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
