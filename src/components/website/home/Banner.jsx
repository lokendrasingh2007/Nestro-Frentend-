import React from 'react'

export default function Banner() {
  return (
    <div className='max-w-container mx-auto  '>
      <div className='bg-[#1A1208] rounded-xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5'>
        <div className="text-center sm:text-left">
          <div className="text-[10px] tracking-[0.18em] uppercase text-[#C6A27E] mb-2">Stay in the loop</div>
          <h2 className="text-[18px] sm:text-[20px] text-[#FAF7F4] font-normal mb-1.5">Design tips & new arrivals</h2>
          <p className="text-[11px] sm:text-[12px] text-[#ffffff73] leading-[1.6]">Join 8,000 subscribers who get exclusive first looks.</p>
        </div>
        <div className="flex flex-col gap-2.5 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input 
              className='bg-[#ffffff14] text-[#D6BFA7] border-[0.5px] border-[#c6a27e59] sm:border-r-0 rounded-sm sm:rounded-l-sm sm:rounded-r-none px-3.5 py-2.5 text-[11px] w-full sm:w-auto' 
              type="email" 
              placeholder='Enter your email address' 
            />
            <button className='bg-[#8B5E3C] border-none text-white px-4 py-2.5 rounded-sm sm:rounded-r-sm sm:rounded-l-none text-[11px] cursor-pointer w-full sm:w-auto'>
              Subscribe
            </button>
          </div>
          <div className="text-[10px] text-[#ffffff47] text-center sm:text-right">No spam. Unsubscribe anytime.</div>
        </div>
      </div>
    </div>
  )
}