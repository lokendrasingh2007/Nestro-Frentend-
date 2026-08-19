import React from 'react'
import Link from 'next/link'
import { fetchProduct } from '@/utils/api'

export default async function Categry({ catagries }) {

  // Fetch all products to count per category
  const productsRes = await fetchProduct({ status: true, limit: 1000 });
  const allProducts = productsRes?.data || [];

  // Build count map: categoryId → count
  const countMap = {};
  allProducts.forEach((p) => {
    const catId = p.categoryId?._id || p.categoryId;
    if (catId) countMap[catId] = (countMap[catId] || 0) + 1;
  });

  return (
    <div className="max-w-container mx-auto mb-5 sm:mb-6">
      {/* Section Header */}
      <div className='flex flex-wrap items-end justify-between mb-6 sm:mb-8 gap-2'>
        <div>
          <div className='text-[10px] tracking-[0.2em] uppercase text-[#8B5E3C] mb-2.5'>
            Browse
          </div>
          <h2 className='text-[24px] sm:text-[28px] md:text-[34px] font-normal text-[#1E1E1E] leading-[1.2] tracking-[-0.02em]'>
            Shop by Category
          </h2>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8  pb-2">
        {catagries.map((item) => {
          const count = countMap[item._id] || 0;
          return (
            <Link href={`/store?category=${item.slug}`} key={item._id}>
              <div className="flex flex-col items-center text-center cursor-pointer group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[3px] border-[#E8E0D5] bg-[#F5F0EB] mb-3 transition-all duration-300 group-hover:border-[#C6A27E] group-hover:shadow-md shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Name */}
                <div className="text-[13px] sm:text-[14px] font-semibold text-[#1E1E1E] leading-tight mb-0.5">
                  {item.name}
                </div>

                {/* Pieces count */}
                <div className="text-[11px] sm:text-[12px] text-[#6B7280]">
                  {count} {count === 1 ? "piece" : "pieces"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}
