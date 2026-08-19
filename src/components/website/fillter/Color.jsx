"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ColorFilter({ colors = [], data = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const colorOptions = Array.isArray(colors) && colors.length > 0 ? colors : data || [];
  const selectedColors = searchParams.get("color")?.split(",") || [];

  const handleColor = (colorName) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("color")?.split(",").filter(Boolean) || [];

    // Agar same color select hai toh deselect karo (toggle)
    // Agar alag color hai toh sirf wahi rakho (single select)
    if (current.length === 1 && current[0] === colorName) {
      // Same color — deselect
      params.delete("color");
    } else {
      // Naya color — replace karo
      params.set("color", colorName);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  if (!colorOptions || colorOptions.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <div className="text-[12px] capitalize font-medium text-[#1E1E1E] mb-3 tracking-[0.03em]">
          Color
        </div>
        {selectedColors.length > 0 && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("color");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="text-[10px] text-[#8B5E3C] mb-3 cursor-pointer tracking-[0.03em] hover:underline block"
          >
            Clear colors
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {colorOptions.map((color) => {
          const isSelected = selectedColors.includes(color.name);
          return (
            <div
              key={color._id || color.name}
              onClick={() => handleColor(color.name)}
              title={color.name}
              className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-150 ${isSelected
                ? "ring-2 ring-offset-1 ring-[#8B5E3C] scale-110"
                : "hover:scale-110"
                }`}
              style={{
                backgroundColor: color.hex,
                border: "1.5px solid rgba(0,0,0,0.12)",
              }}
            />
          );
        })}
      </div>

    </div>
  );
}
