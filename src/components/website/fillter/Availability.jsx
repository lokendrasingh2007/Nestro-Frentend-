"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const options = [
  { label: "In Stock", value: "true" },
  { label: "Out of Stock", value: "false" },
];

export default function Availability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selected = searchParams.get("stock") || "";

  const handleChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selected === value) {
      // Same option click — deselect
      params.delete("stock");
    } else {
      params.set("stock", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-5">
      <div className="text-[12px] font-medium text-[#1E1E1E] mb-3 tracking-[0.03em]">
        Availability
      </div>
      {options.map((option) => (
        <div
          key={option.value}
          className="flex items-center gap-2.5 mb-2 cursor-pointer"
          onClick={() => handleChange(option.value)}
        >
          <input
            type="checkbox"
            checked={selected === option.value}
            onChange={() => handleChange(option.value)}
            className="accent-[#8B5E3C] border-[#8B5E3C] cursor-pointer"
          />
          <span className="text-[12px] text-[#444444]">{option.label}</span>
        </div>
      ))}
    </div>
  );
}
