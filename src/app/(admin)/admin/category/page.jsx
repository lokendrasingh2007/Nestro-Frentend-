"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import ActionDropdown from "@/components/admin/ActionDropdown";
import TableHeader from "@/components/admin/TableHeader";
import StatusBtn from "@/components/admin/StatusBtn";

export default function Page() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        client.get("category")
            .then((res) => { if (res.data.success) setCategories(res.data.categories || []); })
            .catch(() => toast.error("Failed to load categories"))
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = (id) => {
        setCategories((prev) => prev.map((c) => c._id === id ? { ...c, status: !c.status } : c));
    };

    return (
        <div className="min-h-screen p-4 lg:p-6">
            <TableHeader title="Categories" path="/admin/category/add" />
            <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                {/* TABLE HEADER */}
                <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 px-4 py-3 lg:grid">
                    {[
                        { label: "Image",  span: "col-span-1" },
                        { label: "Name",   span: "col-span-5" },
                        { label: "Slug",   span: "col-span-2" },
                        { label: "Status", span: "col-span-2" },
                        { label: "Action", span: "col-span-2 text-right" },
                    ].map(({ label, span }) => (
                        <div key={label} className={span}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                        </div>
                    ))}
                </div>

                <div>
                    {loading ? (
                        <div className="flex min-h-75 items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#3b497e] animate-spin" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center text-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">No Category Found</h2>
                                <p className="mt-2 text-sm text-gray-500">There are no categories available right now.</p>
                            </div>
                        </div>
                    ) : categories.map((item, index) => (
                        <div key={item._id || index} className="grid grid-cols-1 gap-3 border-b border-gray-100 px-8 py-4 transition-all duration-300 hover:bg-gray-50/60 lg:grid-cols-12 lg:items-center">
                            <div className="hidden lg:block lg:col-span-1">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 lg:col-span-5">
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
                                    path={`category/status-update/${item._id}`}
                                    onToggle={() => toggleStatus(item._id)}
                                />
                            </div>
                            <div className="hidden justify-end lg:col-span-2 lg:flex">
                                <ActionDropdown module="category" id={item._id} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
