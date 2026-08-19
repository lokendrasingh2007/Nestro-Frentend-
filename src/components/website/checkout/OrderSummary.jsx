"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { lsToCart, cartTotal } from '@/redex/features/CartSlice';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { TbShieldCheck } from "react-icons/tb";
import { LuSofa } from "react-icons/lu";


export default function OrderSummary({ extraShipping = 0 }) {
    const dispatch = useDispatch();
    const { items, final_total, original_total } = useSelector((state) => state.cart);
    const [mounted, setMounted] = useState(false);

    // Hydrate Redux from localStorage on mount
    useEffect(() => {
        setMounted(true);
        dispatch(lsToCart());
        dispatch(cartTotal());
    }, [dispatch]);

    const subtotal = original_total;
    const baseDelivery = subtotal > 50000 ? 0 : (extraShipping > 0 ? 0 : 1000);
    const deliveryCharge = baseDelivery + extraShipping;
    const discount = original_total - final_total;
    const total = final_total + deliveryCharge;

    if (!mounted) {
        return (
            <div className="bg-[#FAFAF9] p-5 sm:p-6 md:p-7 rounded-xl min-h-105"></div>
        );
    }

    return (
        <div className="bg-[#FAFAF9] p-5 sm:p-6 md:p-7 rounded-xl">
            <div className="bg-white border border-[#E8E0D5] rounded-xl p-5">
                <div className="border-b border-[#E8E0D5] pb-3 mb-4 text-[13px] font-medium text-[#1E1E1E]">Order Summary</div>

                {/* Cart items */}
                {items.length === 0 ? (
                    <div className="flex items-center gap-3 mb-4 text-[12px] text-[#6B7280]">
                        <LuSofa className="text-[22px] text-[#C6A27E]" />
                        Your cart is empty
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <div key={item.id || `item-${idx}`} className="flex items-start gap-3 mb-4">
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-[#C6A27E] text-[20px] relative shrink-0 overflow-hidden">
                                {item.thumbnail ? (
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title || item.name || "Product"}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <LuSofa />
                                )}                         
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <div className="text-[#1E1E1E] font-medium text-[12px] truncate">
                                    {item.title || item.name}
                                </div>
                                <div className="text-[#6B7280] text-[10px] mt-0.5">
                                    {item.variant || "Standard"}
                                </div>
                            </div>

                            {/* Price × qty */}
                            <div className="text-[#1E1E1E] font-medium text-[13px] flex items-center whitespace-nowrap shrink-0">
                                <MdOutlineCurrencyRupee />
                                {((Number(item.salePrice) || Number(item.price) || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                            </div>
                        </div>
                    ))
                )}

                {/* Totals */}
                <div className="border-t border-[#E8E0D5] pt-3 mt-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-[12px] text-[#444444] mb-2">
                        <span>Subtotal</span>
                        <span className="flex items-center">
                            <MdOutlineCurrencyRupee />{(Number(subtotal) || 0).toLocaleString("en-IN")}
                        </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex justify-between text-[12px] text-[#444444] mb-2">
                        <span>Delivery</span>
                        {baseDelivery === 0
                            ? <span className="text-[#3B6D11]">Free</span>
                            : <span className="flex items-center"><MdOutlineCurrencyRupee />{baseDelivery.toLocaleString("en-IN")}</span>
                        }
                    </div>

                    {/* Express Delivery — only when selected */}
                    {extraShipping > 0 && (
                        <div className="flex justify-between text-[12px] text-[#444444] mb-2">
                            <span>Express Delivery</span>
                            <span className="flex items-center">
                                <MdOutlineCurrencyRupee />{extraShipping.toLocaleString("en-IN")}
                            </span>
                        </div>
                    )}

                    {/* Assembly */}
                    <div className="flex justify-between text-[12px] text-[#444444] mb-2">
                        <span>Assembly</span>
                        <span className="text-[#3B6D11]">Free</span>
                    </div>

                    {/* Discount — only show if > 0 */}
                    {discount > 0 && (
                        <div className="flex justify-between text-[12px] text-[#444444] mb-2">
                            <span>Discount</span>
                            <span className="flex items-center text-[#3B6D11]">
                                -<MdOutlineCurrencyRupee />{(Number(discount) || 0).toLocaleString("en-IN")}
                            </span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between border-t border-[#E8E0D5] font-medium text-[14px] text-[#1E1E1E] pt-3 mt-1">
                        <span>Total</span>
                        <span className="flex items-center">
                            <MdOutlineCurrencyRupee />{(Number(total) || 0).toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* Purchase Protection */}
                <div className="border border-[#E8E0D5] p-3.5 mt-4 bg-white rounded-[10px]">
                    <div className="text-[11px] font-medium text-[#1E1E1E] flex items-center mb-2">
                        <TbShieldCheck className='text-[#8B5E3C] mr-1.5' />Purchase Protection
                    </div>
                    <div className="text-[10px] text-[#6B7280] leading-[1.6]">
                        5-year warranty · 30-day returns · Free assembly included · Tracked delivery
                    </div>
                </div>
            </div>
        </div>
    );
}
