"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import ActionDropdown from "@/components/admin/ActionDropdown";
import TableHeader from "@/components/admin/TableHeader";
import StatusBtn from "@/components/admin/StatusBtn";

export default function Page() {
    const [rooms, setRooms]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get("room-type")
            .then((res) => { if (res.data.success) setRooms(res.data.rooms || []); })
            .catch(() => toast.error("Failed to load room types"))
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = (id) => {
        setRooms((prev) => prev.map((r) => r._id === id ? { ...r, status: !r.status } : r));
    };

    return (
        <div className="min-h-screen p-4 lg:p-6">
            <TableHeader title="Room Type" path="/admin/room-type/add" />
            <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                {/* TABLE HEADER */}
                <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 pl-6 pr-4 py-3 lg:grid">
                    {["ID", "Name", "Slug", "Status", "Action"].map((h, i) => (
                        <div key={h} className={i === 4 ? "col-span-2 text-right" : i === 1 ? "col-span-5" : "col-span-2"}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</p>
                        </div>
                    ))}
                </div>

                <div>
                    {loading ? (
                        <div className="flex min-h-75 items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#3b497e] animate-spin" />
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="flex min-h-75 items-center justify-center text-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">No Room Type Found</h2>
                                <p className="mt-2 text-sm text-gray-500">There are no room types available right now.</p>
                            </div>
                        </div>
                    ) : rooms.map((item, index) => (
                        <div key={item._id} className="grid grid-cols-1 gap-3 border-b border-gray-100 px-4 py-4 transition-all duration-300 hover:bg-gray-50/60 lg:grid-cols-12 lg:items-center">
                            <div className="hidden lg:block lg:col-span-1">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700">{index + 1}</div>
                            </div>
                            <div className="lg:col-span-5 flex items-center gap-3">
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-bold text-gray-900">{item.name}</h2>
                                    <p className="mt-1 text-[11px] text-gray-500 lg:hidden">{item.slug}</p>
                                </div>
                            </div>
                            <div className="hidden lg:block lg:col-span-2">
                                <div className="inline-flex rounded-xl bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-600">{item.slug}</div>
                            </div>
                            <div className="lg:col-span-2">
                                <StatusBtn
                                    status={item.status}
                                    path={`room-type/status-update/${item._id}`}
                                    onToggle={() => toggleStatus(item._id)}
                                />
                            </div>
                            <div className="hidden justify-end lg:col-span-2 lg:flex">
                                <ActionDropdown module="room-type" id={item._id} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
