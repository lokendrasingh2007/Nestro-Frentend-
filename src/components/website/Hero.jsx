import React from 'react';
import { GoArrowRight } from "react-icons/go";
import Image from "next/image";

export default function Hero({
  subtitle,
  title1,
  title2,
  highlight,
  description1,
  description2,
  bgColor,
  image,
  button1 = "Shop Collection",
  button2 = "View Lookbook",
}) {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className='relative mx-auto overflow-hidden rounded-2xl px-4 mb-5 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10'
    >
      <div className='relative z-10 max-w-2xl lg:max-w-xl'>
        <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[#C6A27E] mb-3 sm:mb-4">
          {subtitle}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal text-[#FAF7F4] leading-tight sm:leading-[1.2] tracking-[-0.02em] mb-2 sm:mb-3.5">
          {title1}
          <br />
          {title2}
          <span className='italic text-[#D6BFA7]'> {highlight}</span>
        </h1>
        <p className='text-xs sm:text-sm text-[#ffffff80] leading-relaxed sm:leading-[1.75] max-w-md sm:max-w-lg '>
          {description1}
        </p>
        <p className='text-xs sm:text-sm text-[#ffffff80] leading-relaxed sm:leading-[1.75] max-w-md sm:max-w-lg mb-5 sm:mb-7'>
          {description2}
        </p>
        <div className='flex flex-wrap gap-3'>
          <button className='bg-[#8B5E3C] text-[#FFF8F3] text-xs sm:text-[11px] tracking-[0.08em] py-2.5 px-5 rounded-sm cursor-pointer border-none font-medium inline-flex items-center gap-2 transition hover:bg-[#7a4f32]'>
            {button1}
            <GoArrowRight />
          </button>
          <button className='text-[#FFFFFFB3] border border-[#C6A27E66] bg-transparent text-xs sm:text-[11px] tracking-[0.08em] py-2.5 px-5 rounded-sm cursor-pointer inline-flex items-center gap-2 font-medium transition hover:bg-white/5'>
            {button2}
          </button>
        </div>
      </div>
      <div className='relative mt-6 sm:mt-8 md:mt-0 md:absolute md:right-0 md:top-0 md:bottom-0 md:w-2/5 lg:w-1/2 md:flex md:items-center md:justify-center md:opacity-85'>
        <div className='w-full max-w-55 sm:max-w-70 md:max-w-[320px] mx-auto md:mx-0'>
          <Image
            width={320}
            height={220}
            src={image}
            alt="Hero Image"
            className="rounded-xl object-cover w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}