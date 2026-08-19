import React from "react";
import { FaStar } from "react-icons/fa";

export default function Rating() {
  const ratings = [
    { stars: 5, label: "& up" },
    { stars: 4, label: "& up" },
  ];
  return (
    <div className="mb-5">
      <div className="text-[12px] capitalize font-medium text-[#1E1E1E] mb-3 tracking-[0.03em]">
        Rating
      </div>
      {ratings.map((rating, index) => (
        <div key={index} className="flex items-center gap-2 cursor-pointer mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`w-3 h-3 ${
                i < rating.stars ? "text-[#C6A27E]" : "text-[#6B7280]"
              }`}
            />
          ))}
          <span className="text-[11px] text-[#6B7280]">{rating.label}</span>
        </div>
      ))}
    </div>
  );
}