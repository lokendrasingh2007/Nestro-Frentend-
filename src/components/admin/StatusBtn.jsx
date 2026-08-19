"use client"

import { toast } from "sonner";
import { client } from '@/utils/helper';

export default function StatusBtn({ path, status, onToggle }) {

    function statushendler() {
        client.patch(path).then(
            (response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
                    // If parent provided a callback, call it to update local state
                    if (onToggle) {
                        onToggle();
                    }
                }
            }
        ).catch(
            (error) => {
                toast.error(error?.response?.data?.message || 'Internal Server Error')
            }
        )
    }

    return (
        <div
            onClick={statushendler}
            className={`inline-flex items-center gap-2 cursor-pointer rounded-full px-3 py-1.5 text-[11px] 
                font-semibold ${status
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
        >
            <div className={`h-2 w-2 rounded-full ${status ? "bg-emerald-500" : "bg-red-500"}`} />
            {status ? "Active" : "Inactive"}
        </div>
    )
}
