import { getProfile } from '@/utils/serverApi'
import React from 'react'

export default async function DeliveryForm() {
  const user = await getProfile();
  const profile = user?.data || {};
  const defaultAddress = profile.address?.[0] || {}; // first address

  return (
    <div>
      <div className="text-[13px] text-[#1E1E1E] mb-3 font-medium">Delivery Information</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div>
          <label className='text-[#6B7280] text-[11px] block mb-1'>First Name</label>
          <input
            type="text"
            value={profile.firstName || ""}
            placeholder="First Name"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
        <div>
          <label className='text-[#6B7280] text-[11px] block mb-1'>Last Name</label>
          <input
            type="text"
            value={profile.lastName || ""}
            placeholder="Last Name"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
        <div className="col-span-full">
          <label className='text-[#6B7280] text-[11px] block mb-1'>Address</label>
          <input
            type="text"
            value={defaultAddress.addressLine || ""}
            placeholder="Address"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
        <div>
          <label className='text-[#6B7280] text-[11px] block mb-1'>City</label>
          <input
            type="text"
            value={defaultAddress.city || ""}
            placeholder="City"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
        <div>
          <label className='text-[#6B7280] text-[11px] block mb-1'>Pincode</label>
          <input
            type="text"
            value={defaultAddress.pincode || ""}
            placeholder="Pincode"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
        <div>
          <label className='text-[#6B7280] text-[11px] block mb-1'>State</label>
          <input
            type="text"
            value={defaultAddress.state || ""}
            placeholder="State"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
        <div>
          <label className='text-[#6B7280] text-[11px] block mb-1'>Phone</label>
          <input
            type="tel"
            value={defaultAddress.mobile || profile.mobile || ""}
            placeholder="Phone"
            className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] capitalize"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
