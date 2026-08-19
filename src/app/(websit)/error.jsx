"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TbRefresh } from "react-icons/tb";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F5F1] px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="text-[#8B5E3C] text-7xl mb-4">!</div>
        <h2 className="text-2xl sm:text-3xl font-normal text-[#1E1E1E] mb-3">
          Something went wrong
        </h2>
        <p className="text-[#6B7280] text-sm mb-6">
          We apologize for the inconvenience. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[#8B5E3C] text-white text-xs sm:text-[11px] tracking-[0.08em] py-2.5 px-5 rounded-sm hover:bg-[#7a4f32] transition"
          >
            <TbRefresh className="text-sm" /> Try again
          </button>
          <Link href="/">
            <span className="inline-flex items-center justify-center border border-[#C6A27E66] text-[#8B5E3C] text-xs sm:text-[11px] tracking-[0.08em] py-2.5 px-5 rounded-sm hover:bg-white/50 transition">
              Go Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}