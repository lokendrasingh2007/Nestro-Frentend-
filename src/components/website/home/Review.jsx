import React from 'react'
import { IoIosStar } from "react-icons/io"

export default function Review() {
  const testimonials = [
    {
      name: "Priya Rao",
      initials: "PR",
      location: "Mumbai",
      review: "The Ember Velvet sofa is absolutely stunning. Delivery was flawless and the quality is beyond what I expected.",
    },
    {
      name: "Arjun Sharma",
      initials: "AS",
      location: "Mumbai",
      review: "Nestro transformed our living room. Every piece feels like it belongs — timeless and beautifully crafted.",
    },
    {
      name: "Neha Patel",
      initials: "NP",
      location: "Mumbai",
      review: "Premium quality at a fair price. The travertine side table is a conversation starter every time.",
    },
  ];

  return (
    <div className="max-w-container mx-auto  mb-5 sm:mb-6">
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#8B5E3C] mb-2.5">What our customers say</div>
      <h2 className="text-[18px] font-normal text-[#1E1E1E] leading-[1.2] tracking-[-0.02em] mb-4 sm:mb-5">Loved by 12,000+ homes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((item, index) => (
          <div key={index} className="bg-white border-[0.5px] border-[#E8E0D5] rounded-xl p-4 sm:p-5">
            <div className="text-[11px] text-[#C6A27E] mb-2.5 flex items-center">
              {[...Array(4)].map((_, i) => <IoIosStar key={i} />)}
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#444444] leading-[1.7] mb-3.5 italic">
              "{item.review}"
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F0EBE3] flex items-center justify-center text-[11px] font-medium text-[#8B5E3C] uppercase">
                {item.initials}
              </div>
              <div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#1E1E1E]">{item.name}</div>
                <div className="text-[9px] sm:text-[10px] text-[#6B7280]">{item.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}