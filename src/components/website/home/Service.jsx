import React from 'react'
import { ImLoop2 } from "react-icons/im";
import { FaPencilRuler } from "react-icons/fa";
import { TbShieldBolt } from "react-icons/tb";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineCurrencyRupee } from "react-icons/md"

export default function Service() {
  const features = [
    { icon: <TbTruckDelivery />, title: "Free Delivery", description: <>On orders above <MdOutlineCurrencyRupee /> 50,000</> },
    { icon: <ImLoop2 />, title: "30-Day Returns", description: <>Hassle-free return policy</> },
    { icon: <FaPencilRuler />, title: "Expert Assembly", description: <>Professional setup at home</> },
    { icon: <TbShieldBolt />, title: "5-Year Warranty", description: "On all furniture items" },
  ];

  return (
    <div className='max-w-container mx-auto  mb-5 sm:mb-6'>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E0D5] rounded-xl overflow-hidden border-[0.5px] border-[#E8E0D5]">
        {features.map((item, index) => (
          <div key={index} className="bg-white p-3 sm:p-4 text-center">
            <div className="text-[20px] sm:text-[22px] mb-2 text-[#8B5E3C] flex items-center justify-center">
              {item.icon}
            </div>
            <div className="text-[11px] sm:text-[12px] font-medium mb-1 text-[#1e1e1e]">
              {item.title}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#6B7280] leading-normal  px-1 flex items-center justify-center">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}