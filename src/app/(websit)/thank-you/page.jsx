"use client";

import Link from "next/link";
import { use } from "react";
import { BsCheckLg } from "react-icons/bs";
import { MdArrowForward } from "react-icons/md";
import { TbShieldCheck } from "react-icons/tb";
import { LuPackage } from "react-icons/lu";

export default function ThankYouPage({ searchParams }) {
    const params = use(searchParams);
    const orderId = params?.orderId || null;

    const steps = [
        { label: "Order Placed",     desc: "We've received your order",          done: true  },
        { label: "Confirmed",        desc: "Your order is being processed",       done: false },
        { label: "Shipped",          desc: "On its way to you",                   done: false },
        { label: "Delivered",        desc: "Enjoy your new furniture!",           done: false },
    ];

    return (
        <div className="w-full bg-[#F8F5F1] min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">

                {/* Success card */}
                <div className="bg-white border border-[#E8E0D5] rounded-2xl p-8 text-center mb-5">
                    {/* Checkmark */}
                    <div className="w-16 h-16 rounded-full bg-[#EAF3DE] flex items-center justify-center mx-auto mb-5">
                        <BsCheckLg className="text-[#3B6D11] text-[28px]" />
                    </div>

                    <div className="text-[11px] tracking-[0.15em] uppercase text-[#8B5E3C] mb-2 font-medium">
                        Order Confirmed
                    </div>
                    <h1 className="text-[22px] font-medium text-[#1E1E1E] mb-2">
                        Thank you for your order!
                    </h1>
                    <p className="text-[12px] text-[#6B7280] leading-[1.7] mb-5">
                        Your order has been placed successfully. We'll send you a confirmation
                        and keep you updated on every step.
                    </p>

                    {orderId && (
                        <div className="bg-[#F8F5F1] border border-[#E8E0D5] rounded-lg px-4 py-3 mb-6 inline-flex items-center gap-2">
                            <LuPackage className="text-[#8B5E3C] text-[14px]" />
                            <span className="text-[12px] text-[#1E1E1E] font-medium">Order ID:</span>
                            <span className="text-[12px] text-[#6B7280] font-mono">{orderId}</span>
                        </div>
                    )}

                    {/* Order progress */}
                    <div className="flex items-start justify-between gap-2 mb-7 px-2">
                        {steps.map((step, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 relative">
                                {/* connector line */}
                                {i < steps.length - 1 && (
                                    <div className={`absolute top-3 left-1/2 w-full h-[1px] ${step.done ? "bg-[#3B6D11]" : "bg-[#E8E0D5]"}`} />
                                )}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 text-[10px] font-medium ${
                                    step.done
                                        ? "bg-[#3B6D11] text-white"
                                        : "bg-[#E8E0D5] text-[#6B7280]"
                                }`}>
                                    {step.done ? <BsCheckLg /> : i + 1}
                                </div>
                                <div className="text-[9px] text-[#1E1E1E] font-medium text-center leading-tight">{step.label}</div>
                                <div className="text-[9px] text-[#9CA3AF] text-center leading-tight hidden sm:block">{step.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                        <Link
                            href="/profile"
                            className="flex-1 bg-[#8B5E3C] text-[#FFF8F3] text-[12px] tracking-[0.08em] py-3 rounded-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-[#7A5235] transition"
                        >
                            View My Orders
                            <MdArrowForward />
                        </Link>
                        <Link
                            href="/store"
                            className="flex-1 bg-white border border-[#E8E0D5] text-[#1E1E1E] text-[12px] tracking-[0.08em] py-3 rounded-sm font-medium inline-flex items-center justify-center hover:bg-[#F8F5F1] transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Purchase protection */}
                <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 flex items-start gap-3">
                    <TbShieldCheck className="text-[#8B5E3C] text-[20px] shrink-0 mt-0.5" />
                    <div>
                        <div className="text-[12px] font-medium text-[#1E1E1E] mb-1">Purchase Protection</div>
                        <div className="text-[11px] text-[#6B7280] leading-[1.6]">
                            5-year warranty · 30-day returns · Free assembly included · Tracked delivery
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
