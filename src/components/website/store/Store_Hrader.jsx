"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Store_Header({ count }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const rooms = searchParams.get("rooms")?.split(",") || [];
    const categories = searchParams.get("category")?.split(",") || [];
    setFilters([...rooms, ...categories]);
  }, [searchParams]);

  function applyFilter(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  }

  const removeFilter = (filterToRemove) => {
    const params = new URLSearchParams(searchParams.toString());

    let currentRooms = params.get("rooms")?.split(",") || [];
    let currentCategories = params.get("category")?.split(",") || [];

    currentRooms = currentRooms.filter((r) => r !== filterToRemove);
    currentCategories = currentCategories.filter((c) => c !== filterToRemove);

    if (currentRooms.length > 0) {
      params.set("rooms", currentRooms.join(","));
    } else {
      params.delete("rooms");
    }

    if (currentCategories.length > 0) {
      params.set("category", currentCategories.join(","));
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-[10px] border-[0.5px] border-[#E8E0D5] px-4 py-3 mb-5">
        <span className="text-[12px] text-[#6B7280]">
          <strong className="text-[#1E1E1E] font-medium">{count ?? "..."}</strong> products found
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="bg-[#F5EDE4] text-[#8B5E3C] text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              {filter}
              <IoCloseOutline
                onClick={() => removeFilter(filter)}
                className="hover:text-red-500 cursor-pointer"
              />
            </div>
          ))}
          <select
            onChange={(e) => applyFilter(e.target.value)}
            className="border-[0.5px] border-[#E8E0D5] rounded-md px-2.5 py-1.5 text-[12px] text-[#444444] bg-[#FAFAF9] outline-none cursor-pointer"
          >
            <option value="">Sort: Featured</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
            <option value="createAt">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
