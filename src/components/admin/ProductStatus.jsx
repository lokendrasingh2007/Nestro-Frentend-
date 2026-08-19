'use client'

import { client } from '@/utils/helper';
import React from 'react'
import { toast } from 'sonner';

export default function ProductStatus({ status, flag, id, onToggle }) {

  function statusHandler() {
    client.patch(`product/status/${id}`, { flag }).then(
      (response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          if (onToggle) onToggle();
        }
      }
    ).catch(
      (error) => {
        toast.error(error?.response?.data?.message || 'Internal Server Error')
      }
    )
  }

  const lable = {
    stock:      ["Stock",       "Out of Stock"],
    bestSeller: ["BestSeller",  "Not BestSeller"],
    featured:   ["Featured",    "Not Featured"],
    newArrival: ["New Arrival", "Not New Arrival"],
  }
  const [Active, Inactive] = lable[flag]

  return (
    <div
      onClick={statusHandler}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold cursor-pointer ${
        status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
      }`}
    >
      <div className={`h-2 w-2 rounded-full ${status ? "bg-emerald-500" : "bg-red-500"}`} />
      {status ? Active : Inactive}
    </div>
  )
}