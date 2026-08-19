"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/utils/helper";
import { HiOutlineShoppingBag, HiOutlineCube, HiOutlineTag, HiOutlineCurrencyRupee, HiOutlineUsers, } from "react-icons/hi";
import { MdCurrencyRupee } from "react-icons/md";
import { LuSofa } from "react-icons/lu";



const PAYMENT_COLORS = {
    Pending: "bg-amber-50 text-amber-700",
    Paid: "bg-emerald-50 text-emerald-700",
    Failed: "bg-red-50 text-red-600",
};

const ORDER_STATUS_COLORS = {
    placed: "bg-[#eef0f8] text-[#3b497e]",
    confirmed: "bg-[#e6eaf5] text-[#2a3460]",
    shipped: "bg-amber-50 text-amber-700",
    out_for_delivery: "bg-orange-50 text-orange-700",
    delivered: "bg-emerald-50 text-emerald-700",
    return: "bg-red-50 text-red-600",
};

const ORDER_STATUS_LABELS = {
    placed: "Placed",
    confirmed: "Confirmed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    return: "Returned",
};

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const fmtK = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            client.get("order"),
            client.get("product"),
            client.get("user/admin/customers"),
            client.get("user/admin/users"),
            client.get("category"),
            client.get("room-type"),
            client.get("color"),
        ]).then(([ordRes, prodRes, custRes, usersRes, catRes, roomRes, colorRes]) => {
            if (ordRes.data.success) setOrders(ordRes.data.orders || []);
            if (prodRes.data.success) setProducts(prodRes.data.products || []);
            if (custRes.data.success) setCustomers(custRes.data.users || []);
            if (usersRes.data.success) setAdminUsers(usersRes.data.users || []);
            if (catRes.data.success) setCategories(catRes.data.categories || []);
            if (roomRes.data.success) setRooms(roomRes.data.rooms || []);
            if (colorRes.data.success) setColors(colorRes.data.colors || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const totalRevenue = orders.filter(o => o.paymentStatus === "Paid").reduce((s, o) => s + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => ["placed", "confirmed"].includes(o.orderStatus)).length;
    const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;

    const stats = [
        { label: "Total Revenue", value: "₹" + fmtK(totalRevenue), sub: "Paid orders", icon: <HiOutlineCurrencyRupee size={20} /> },
        { label: "Delivered", value: deliveredOrders, sub: "Completed", icon: <HiOutlineCube size={20} /> },
        { label: "Pending Orders", value: pendingOrders, sub: "Awaiting confirmation", icon: <HiOutlineTag size={20} /> },
        { label: "Users", value: adminUsers.length, sub: "Admin & Super Admin", icon: <HiOutlineUsers size={20} /> },
        { label: "Customers", value: customers.length, sub: "Registered", icon: <HiOutlineUsers size={20} /> },
    ];

    const overviewItems = [
        { label: "Categories", total: categories.length, sub: `${categories.filter(c => c.status).length} active` },
        { label: "Room Types", total: rooms.length, sub: `${rooms.filter(r => r.status).length} active` },
        { label: "Products", total: products.length, sub: `${products.filter(p => p.status).length} active` },
        { label: "Colors", total: colors.length, sub: `${colors.filter(c => c.status).length} active` },
        { label: "Customers", total: customers.length, sub: "Registered" },
        { label: "Total Orders", total: orders.length, sub: `${pendingOrders} pending` },
    ];

    if (loading) return (
        <div className="min-h-screen bg-[#f4f5fb] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-[#eef0f8] border-t-[#3b497e] animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f4f5fb] p-5 sm:p-7 space-y-6">

            {/* Title */}
            <div>
                <h1 className="text-[22px] font-bold text-[#1a1d2e]">Dashboard</h1>
                <p className="text-[13px] text-gray-500 mt-0.5">Welcome back — here's what's happening today.</p>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#e8eaf5] shadow-sm p-4 flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#eef0f8] text-[#3b497e] flex items-center justify-center">
                            {s.icon}
                        </div>
                        <div>
                            <div className="text-[22px] font-bold text-[#3b497e] leading-tight">{s.value}</div>
                            <div className="text-[11px] text-[#3b497e] font-medium mt-0.5">{s.label}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Total Overview Summary ── */}
            <div className="bg-white rounded-2xl border border-[#e8eaf5] shadow-sm p-5">
                <h2 className="text-[14px] font-semibold text-[#1a1d2e] mb-4">Total Overview Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {overviewItems.map((item, i) => (
                        <div key={i} className="rounded-xl bg-[#eef0f8] border border-[#d8dcee] p-4 text-center">
                            <div className="text-[24px] font-bold text-[#3b497e] leading-tight">{item.total}</div>
                            <div className="text-[12px] font-semibold text-[#2a3460] mt-1">{item.label}</div>
                            <div className="text-[10px] text-[#6b7fc4] mt-0.5">{item.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── Order Status Overview ── */}

                <h2 className="text-[14px] font-semibold text-[#1a1d2e] mb-4 pt-5">Order Status Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => {
                        const count = orders.filter(o => o.orderStatus === key).length;
                        return (
                            <div key={key} className={`rounded-xl p-3 text-center ${ORDER_STATUS_COLORS[key]}`}>
                                <div className="text-[22px] font-bold">{count}</div>
                                <div className="text-[11px] font-medium mt-0.5">{label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Recent Orders + Recent Products ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-[#e8eaf5] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eaf5] bg-[#fafbff]">
                        <h2 className="text-[14px] font-semibold text-[#1a1d2e]">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-[12px] text-[#3b497e] hover:underline font-medium">View All →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[12px]">
                            <thead className="bg-[#f4f5fb] text-[10px] uppercase text-[#6b7fc4] tracking-wide">
                                <tr>
                                    <th className="px-5 py-3">Order</th>
                                    <th className="px-5 py-3">Customer</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Payment</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr><td colSpan={5} className="py-10 text-center text-gray-400 text-[13px]">No orders yet</td></tr>
                                ) : orders.slice(0, 6).map((order) => (
                                    <tr key={order._id} className="border-b border-[#f0f1f8] last:border-0 hover:bg-[#fafbff] transition">
                                        <td className="px-5 py-3">
                                            <div className="font-mono font-semibold text-[#1a1d2e] text-[11px]">#{order._id.slice(-8).toUpperCase()}</div>
                                            <div className="text-[10px] text-gray-400">{fmtDate(order.createdAt)}</div>
                                        </td>
                                        <td className="px-5 py-3 capitalize text-[#1a1d2e] max-w-30 truncate">
                                            {order.shippingAddress?.fullName || "—"}
                                        </td>
                                        <td className="px-5 py-3 font-semibold text-[#1a1d2e]">
                                            <span className="flex items-center gap-0.5 text-[#3b497e]"><MdCurrencyRupee />{fmt(order.totalAmount)}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                                                {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Recent Products */}
                <div className="bg-white rounded-2xl border border-[#e8eaf5] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eaf5] bg-[#fafbff]">
                        <h2 className="text-[14px] font-semibold text-[#1a1d2e]">Recent Products</h2>
                        <Link href="/admin/product" className="text-[12px] text-[#3b497e] hover:underline font-medium">View All →</Link>
                    </div>
                    <div className="divide-y divide-[#f0f1f8]">
                        {products.length === 0 ? (
                            <div className="py-10 text-center text-gray-400 text-[13px]">No products yet</div>
                        ) : products.slice(0, 5).map((product) => (
                            <div key={product._id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbff] transition">
                                <div className="w-10 h-10 bg-[#eef0f8] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                    {product.thumbnail
                                        ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                        : <LuSofa className="text-[18px] text-[#3b497e]" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-medium text-[#1a1d2e] truncate">{product.name}</div>
                                    <div className="text-[10px] text-[#6b7fc4]">{product.categoryId?.name || "—"}</div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-[12px] font-semibold text-[#3b497e] flex items-center"><MdCurrencyRupee />{fmt(product.salePrice)}</div>
                                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${product.stock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                        {product.stock ? "In Stock" : "Out"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

