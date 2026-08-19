import React from 'react'
import { BsCheckLg } from "react-icons/bs";
import Link from 'next/link';
import DeliveryForm from '@/components/website/checkout/DeliveryForm';
import CheckoutForm from '@/components/website/checkout/CheckoutForm';
import { getProfile } from '@/utils/serverApi';

export default async function Page() {
    const user = await getProfile();
    const profile = user?.data || {};
    const defaultAddress = profile.address?.[0] || {};

    const shippingAddress = {
        fullName:    `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
        mobile:      defaultAddress.mobile || profile.mobile || "",
        addressLine: defaultAddress.addressLine || "",
        city:        defaultAddress.city || "",
        pinCode:     defaultAddress.pincode || "",
        state:       defaultAddress.state || "",
        country:     defaultAddress.country || "India",
    };

    // Stepper — server-rendered static markup passed as prop
    const stepper = (
        <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-7">
            <div className="flex items-center gap-1.5 text-[11px] text-[#C6A27E]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#C6A27E] text-white text-[9px] font-medium">
                    <BsCheckLg className="text-[10px]" />
                </div>
                <span>Cart</span>
            </div>
            <div className="w-5 h-[0.7px] bg-[#E8E0D5]"></div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8B5E3C]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#8B5E3C] text-white text-[9px] font-medium">
                    <span className="text-[10px]">2</span>
                </div>
                <span>Delivery</span>
            </div>
            <div className="w-5 h-[0.7px] bg-[#E8E0D5]"></div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#E8E0D5] text-[9px] font-medium">
                    <span className="text-[10px]">3</span>
                </div>
                <span>Payment</span>
            </div>
            <div className="w-5 h-[0.7px] bg-[#E8E0D5]"></div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#E8E0D5] text-[9px] font-medium">
                    <span className="text-[10px]">4</span>
                </div>
                <span>Review</span>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-[#F8F5F1] min-h-screen">
            <div className="max-w-container mx-auto">
                {/* Logo */}
                <div className="p-5 sm:p-6 md:p-8 pb-0">
                    <Link href="/">
                        <div className="text-[15px] text-[#1E1E1E] font-medium tracking-[0.12em] uppercase mb-6 sm:mb-7">
                            Nestro<span className="text-[#8B5E3C]">.</span>
                        </div>
                    </Link>
                </div>

                {/* CheckoutForm owns the grid — left col + right col (OrderSummary) */}
                <CheckoutForm
                    shippingAddress={shippingAddress}
                    stepper={stepper}
                    deliveryForm={<DeliveryForm />}
                />
            </div>
        </div>
    );
}
