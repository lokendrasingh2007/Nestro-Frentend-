"use client";
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
export default function PriceRange() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [min, setMinPrice] = useState(800);
  const [max, setMaxPrice] = useState(100000);

  function applyFilter() {
    const params = new URLSearchParams(searchParams.toString())
    params.set("min", min);
    params.set("max", max);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mb-5">
      <div className="text-[12px] capitalize font-medium text-[#1E1E1E] mb-3 tracking-[0.03em]">
        Price Range
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          value={min}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="w-20 border border-[#C6A27E] rounded px-2 py-1 text-[12px]"
        />
        <span className="text-[#6B7280]">to</span>
        <input
          type="number"
          value={max}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-20 border border-[#C6A27E] rounded px-2 py-1 text-[12px]"
        />
      </div>
      <div className="text-[12px] text-[#444444] mt-2 flex items-center justify-between gap-2">
        <Link href="/store">
        <span  className="border-[0.5px] border-[#C6A27E] rounded px-2 py-1 text-[12px] text-[#F5EDE4] font-bold bg-[#8B5E3C]">Clear</span>
        </Link>
        <button onClick={applyFilter} className="border cursor-pointer border-[#C6A27E] rounded px-2 py-1 text-[12px] text-[#F5EDE4] font-bold bg-[#8B5E3C]"><LuSearch /></button>
    </div>
    </div >
  );
}