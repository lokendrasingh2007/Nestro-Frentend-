"use client";
import React, { useState } from "react";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";

export default function CheckoutForm({ shippingAddress, deliveryForm, stepper }) {
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [shippingCost, setShippingCost]     = useState(0);

    const handleShippingChange = (id, cost) => {
        setShippingMethod(id);
        setShippingCost(cost);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-0 lg:gap-6">
            {/* Left Column */}
            <div className="bg-[#F8F5F1] rounded-xl lg:border-r-[0.5px] border-[#E8E0D5] p-5 sm:p-6 md:p-8">
                {stepper}
                {deliveryForm}

                <hr className="border-0 border-t-[0.5px] border-[#E8E0D5] my-5" />
                <ShippingMethod selected={shippingMethod} onChange={handleShippingChange} />
                <hr className="border-0 border-t-[0.5px] border-[#E8E0D5] my-5" />
                <PaymentMethod
                    shippingAddress={shippingAddress}
                    shippingMethod={shippingMethod}
                    extraShipping={shippingCost}
                />
            </div>

            {/* Right Column — Order Summary gets live shipping cost */}
            <OrderSummary extraShipping={shippingCost} />
        </div>
    );
}
