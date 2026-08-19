
"use client";

import { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal, HiOutlineEye, HiOutlinePencilAlt, } from "react-icons/hi";
import DeleteBtn from "./DeleteBtn";
import Link from "next/link";
export default function ActionDropdown({ id, module }) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-9 items-center gap-1.5 rounded-xl border cursor-pointer border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white ${open ? "bg-[#1E1E1E] text-white border-[#1E1E1E]" : ""
          }`}
      >
        Actions
        <HiOutlineDotsHorizontal className="text-base" />
      </button>
      {/* DROPDOWN */}
      <div
        className={`absolute -right-5 -top-25 z-50 w-48 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.10)] transition-all duration-200 ${open
          ? "visible scale-100 opacity-100"
          : "invisible scale-95 opacity-0"
          }`}
      >
        {/* VIEW — only for product module */}
        {module === "product" && (
          <Link href={`/admin/${module}/view/${id}`}>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <HiOutlineEye className="text-sm text-blue-500" />
              </div>
              View
            </button>
          </Link>
        )}

        {/* EDIT */}
        <Link href={`/admin/${module}/edit/${id}`}>
          <button className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
              <HiOutlinePencilAlt className="text-sm" />
            </div>
            Edit
          </button>
        </Link>
        {/* DIVIDER */}
        <div className="mx-4 h-px bg-gray-100" />
        {/* DELETE */}
        <DeleteBtn path={`${module}/delete/${id}`} />
      </div>
    </div>
  );
}