import Link from 'next/link'
import { fetchProduct } from '@/utils/api'
import Sellider from './Sellider'

export default async function Selles() {
  const products = await fetchProduct({ status: true, featured: true });

  return (
    <div className='max-w-container mx-auto mb-5 sm:mb-6'>
      <div className='flex flex-wrap items-end justify-between mb-4 sm:mb-6 gap-2'>
        <div>
          <div className='text-[10px] tracking-[0.2em] uppercase text-[#8B5E3C] mb-2.5'>
            Featured Collection
          </div>
          <h2 className='text-[24px] sm:text-[28px] md:text-[34px] font-normal text-[#1E1E1E] leading-[1.2] tracking-[-0.02em]'>
            Featured
          </h2>
        </div>
        <Link
          href="/store"
          className='text-[11px] text-[#8B5E3C] cursor-pointer tracking-[0.06em] border-b border-[#C6A27E] hover:border-b-2 transition-all'>
          View All
        </Link>
      </div>

      {products?.data?.length > 0 ? (
        <Sellider products={products.data} />
      ) : (
        <div className="text-center py-10">
          <p className="text-lg font-medium text-gray-700 mb-2">
            No featured products available right now.
          </p>
          <p className="text-sm text-gray-500">
            Check back later or explore our full store.
          </p>
          <Link
            href="/store"
            className="inline-block mt-4 px-4 py-2 bg-[#8B5E3C] text-white rounded hover:bg-[#6A452A] transition"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  )
}