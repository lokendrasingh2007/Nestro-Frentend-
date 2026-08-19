import React from 'react'
import Link from 'next/link'
import { fetchProduct } from '@/utils/api';
import ProductCard from '../ProductCard';
export default async function NewProduct() {
    const products = await fetchProduct({ status: true, stock: true, limit: 4 });
    return (
        <div className="px-4 sm:px-6 pb-8 sm:pb-10">
            <div className="flex items-end justify-between mb-4">
                <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[#8B5E3C] mb-2">
                        You might also like
                    </div>
                    <h2 className="text-[18px] font-normal text-[#1E1E1E] leading-[1.2] tracking-[-0.02em]">
                        Related Products
                    </h2>
                </div>
                <Link href="/store" className="text-[11px] text-[#8B5E3C] cursor-pointer tracking-[0.06em] border-b border-[#C6A27E] hover:border-b-2 transition-all">
                    View All
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {products.data.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}
