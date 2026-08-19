"use client";
import React from "react";
import { GoDotFill } from "react-icons/go";

const METHODS = [
    {
        id:       "standard",
        label:    "Standard Delivery",
        desc:     "5-7 business days + free assembly",
        price:    0,
        display:  "Free",
    },
    {
        id:       "express",
        label:    "Express Delivery",
        desc:     "2-3 business days",
        price:    1500,
        display:  "₹ 1,500",
    },
];

export default function ShippingMethod({ selected, onChange }) {
    return (
        <div>
            <div className="text-[13px] text-[#1E1E1E] mb-3 font-medium">Shipping Method</div>
            {METHODS.map((m) => {
                const isActive = selected === m.id;
                return (
                    <div
                        key={m.id}
                        onClick={() => onChange(m.id, m.price)}
                        className={`rounded-lg mb-2 cursor-pointer flex flex-wrap items-center gap-3 p-3 transition border-[0.5px]
                            ${isActive
                                ? "bg-[#FFF8F5] border-[#8B5E3C]"
                                : "bg-white border-[#E8E0D5] hover:border-[#C6A27E]"
                            }`}
                    >
                        {/* Radio dot */}
                        <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition
                            ${isActive ? "border-[#C6A27E]" : "border-[#C6A27E]"}`}>
                            {isActive && <GoDotFill className="w-2 h-2 text-[#8B5E3C] rounded-full" />}
                        </div>
                        <div className="flex-1">
                            <div className="text-[12px] text-[#1E1E1E]">{m.label}</div>
                            <div className="text-[12px] text-[#6B7280] mt-px">{m.desc}</div>
                        </div>
                        <div className={`text-[12px] font-medium ${isActive ? "text-[#8B5E3C]" : "text-[#1E1E1E]"}`}>
                            {m.display}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
