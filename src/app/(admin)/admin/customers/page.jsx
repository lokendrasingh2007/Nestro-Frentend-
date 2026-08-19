"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import Swal from "sweetalert2";

export default function CustomersPage() {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchCustomers = () => {
        setLoading(true);
        client.get("user/admin/customers")
            .then((res) => {
                if (res.data.success) {
                    setUsers(res.data.users || []);
                    setFiltered(res.data.users || []);
                }
            })
            .catch(() => toast.error("Failed to load customers"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCustomers(); }, []);

    // Search filter
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(users);
        } else {
            const q = search.toLowerCase();
            setFiltered(users.filter((u) =>
                u.firstName?.toLowerCase().includes(q) ||
                u.lastName?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.mobile?.includes(q)
            ));
        }
    }, [search, users]);

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete customer "${name}"? This cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3b497e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            setDeletingId(id);
            const res = await client.delete(`user/admin/customers/${id}`);
            if (res.data.success) {
                Swal.fire({ title: "Deleted!", text: "Customer has been deleted.", icon: "success", confirmButtonColor: "#3b497e" });
                fetchCustomers();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete customer");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2a3460]">Customers</h1>
                    <p className="text-sm text-[#7a84a6] mt-1">All registered customer accounts</p>
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl w-64 shadow-sm">
                    <FiSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full text-gray-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-[#2a3460]">
                        Total Customers: <span className="text-[#3b497e]">{users.length}</span>
                    </h2>
                    {search && (
                        <span className="text-[12px] text-gray-500">
                            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-4 border-[#eef0f8] border-t-[#3b497e] animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <HiOutlineUser size={40} className="mb-3 opacity-40" />
                        <p className="text-sm">{search ? "No customers match your search" : "No customers found"}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Table Head */}
                        <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 pl-6 pr-4 py-3 lg:grid">
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">S.No</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Name</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone</p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Verified</p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Joined</p>
                            </div>
                            <div className="col-span-1 text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Action</p>
                            </div>
                        </div>

                        {/* Table Body */}
                        {filtered.map((u, i) => (
                            <div
                                key={u._id}
                                className="grid grid-cols-1 gap-2 border-b border-gray-100 px-4 py-4 transition-all hover:bg-gray-50/60 lg:grid-cols-12 lg:items-center"
                            >
                                {/* # */}
                                <div className="hidden lg:block lg:col-span-1">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700">
                                        {i + 1}
                                    </div>
                                </div>

                                {/* Name + Avatar */}
                                <div className="lg:col-span-3 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#eef0f8] flex items-center justify-center text-[#3b497e] text-[13px] font-semibold shrink-0 uppercase">
                                        {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-sm font-bold text-gray-900 capitalize truncate">
                                            {u.firstName} {u.lastName}
                                        </h2>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="lg:col-span-3">
                                    <p className="text-[12px] text-gray-600 truncate">{u.email}</p>
                                </div>

                                {/* Phone */}
                                <div className="lg:col-span-2">
                                    <p className="text-[12px] text-gray-600">{u.mobile || "—"}</p>
                                </div>

                                {/* Verified */}
                                <div className="lg:col-span-1">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {u.isVerified ? "Yes" : "No"}
                                    </span>
                                </div>

                                {/* Joined */}
                                <div className="hidden lg:block lg:col-span-1">
                                    <p className="text-[10px] text-gray-400">
                                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                                    </p>
                                </div>

                                {/* Delete */}
                                <div className="hidden lg:flex lg:col-span-1 justify-end">
                                    <button
                                        onClick={() => handleDelete(u._id, `${u.firstName} ${u.lastName}`)}
                                        disabled={deletingId === u._id}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                                        title="Delete customer"
                                    >
                                        {deletingId === u._id
                                            ? <div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                            : <FiTrash2 size={14} />
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
