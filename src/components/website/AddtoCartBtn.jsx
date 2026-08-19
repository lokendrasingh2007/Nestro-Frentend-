"use client";
import { addToCart } from '@/redex/features/CartSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export default function AddtoCartBtn({ product }) {
    const dispatch = useDispatch();

    function cartHandaler() {
        const cartItem = {
            id: product._id || product.id || `product-${Date.now()}`,
            name: product.name || product.title,
            salePrice: Number(product.salePrice) || Number(product.price) || 0,
            originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
            discount: product.discount || 0,
            thumbnail: product.thumbnail || product.image,
            title: product.name || product.title,
            qty: 1,
        };
        
        console.log("Cart item being added:", cartItem);
        
        dispatch(addToCart(cartItem));
    }
    return (
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            {/* Product Name */}
            <div className="text-[12px] sm:text-[13px] font-medium leading-tight text-[#1E1E1E]">
                {product.name}
            </div>

            {product.stock ? (
                <button
                    onClick={cartHandaler}
                    className="bg-[#8B5E3C] border border-[#8B5E3C] text-white text-[10px] sm:text-[11px] px-2 py-1 rounded-sm tracking-[0.08em] hover:bg-[#7a4f32] transition whitespace-nowrap cursor-pointer"
                >
                    Add to cart
                </button>
            ) : (
                <span className="border border-[#8B5E3C] text-[#87420d] text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-sm shadow-sm tracking-[0.08em] whitespace-nowrap">
                    Out of stock
                </span>
            )}
        </div>
    );
}
