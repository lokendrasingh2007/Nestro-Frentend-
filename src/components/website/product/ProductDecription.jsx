"use client";
import React, { useState } from "react";

export default function ProductDecription({ description, shortDescription, material, dimensions, weight }) {
  const [activeTab, setActiveTab] = useState("Description");

  const tabs = [
    {
      name: "Description",
      content: (
        <div
          className="text-[11px] sm:text-[12px] text-[#444444] leading-[1.8] prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: description || shortDescription || "No description available for this product.",
          }}
        />
      ),
    },
    {
      name: "Specification",
      content: (
        <div className="text-[11px] sm:text-[12px] text-[#444444] leading-[1.8]">
          {dimensions?.width && (
            <div className="flex flex-col sm:flex-row justify-between py-2.5 border-b border-[#E8E0D5]">
              <span className="text-[#6B7280] sm:flex-1">Dimensions</span>
              <span className="text-[#1E1E1E] font-medium sm:text-right">
                {dimensions.width} × {dimensions.depth} × {dimensions.height} cm (W×D×H)
              </span>
            </div>
          )}
          {material && (
            <div className="flex flex-col sm:flex-row justify-between py-2.5 border-b border-[#E8E0D5]">
              <span className="text-[#6B7280] sm:flex-1">Material</span>
              <span className="text-[#1E1E1E] font-medium sm:text-right">{material}</span>
            </div>
          )}
          {weight && (
            <div className="flex flex-col sm:flex-row justify-between py-2.5 border-b border-[#E8E0D5]">
              <span className="text-[#6B7280] sm:flex-1">Weight</span>
              <span className="text-[#1E1E1E] font-medium sm:text-right">{weight} kg</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between py-2.5 border-b border-[#E8E0D5]">
            <span className="text-[#6B7280] sm:flex-1">Assembly Required</span>
            <span className="text-[#1E1E1E] font-medium sm:text-right">Yes (included free)</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between py-2.5 border-b border-[#E8E0D5]">
            <span className="text-[#6B7280] sm:flex-1">Warranty</span>
            <span className="text-[#1E1E1E] font-medium sm:text-right">5 Years</span>
          </div>
          {!dimensions?.width && !material && !weight && (
            <p className="text-[#6B7280] py-3">No specifications available.</p>
          )}
        </div>
      ),
    },
    {
      name: "Reviews",
      content: (
        <div className="text-[11px] sm:text-[12px] text-[#444444] leading-[1.8] flex flex-col gap-3.5">
          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E8E0D5]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] sm:text-[12px] font-medium">Priya R.</span>
              <span className="text-[10px] sm:text-[11px] text-[#C6A27E]">★★★★★</span>
            </div>
            <div className="text-[11px] text-[#444444]">
              "Absolutely stunning. The colour is richer in person and it arrived perfectly assembled."
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#6B7280] mt-1">Mumbai · Verified Purchase</div>
          </div>
          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E8E0D5]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] sm:text-[12px] font-medium">Arjun S.</span>
              <span className="text-[10px] sm:text-[11px] text-[#C6A27E]">★★★★★</span>
            </div>
            <div className="text-[11px] text-[#444444]">
              "Worth every rupee. The velvet feels luxurious and the support is excellent."
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#6B7280] mt-1">Delhi · Verified Purchase</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-3 sm:gap-6 lg:gap-8 border-b border-[#E8E0D5] mb-4.5">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`text-[11px] sm:text-[12px] pb-2 cursor-pointer border-b-2 border-solid ${
              activeTab === tab.name
                ? "text-[#8B5E3C] border-[#8B5E3C]"
                : "text-[#6B7280] border-transparent"
            }`}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div>{tabs.find((t) => t.name === activeTab)?.content}</div>
    </div>
  );
}
