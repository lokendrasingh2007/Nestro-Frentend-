"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import Image from "next/image";
import { FiSearch, FiDownload, FiEye, FiX } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { LuSofa } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";

// ── Constants ─────────────────────────────────────────────────────────────────
const ORDER_STATUSES = [
    { value: "placed",           label: "Placed",           color: "bg-blue-100 text-blue-700" },
    { value: "confirmed",        label: "Confirmed",        color: "bg-indigo-100 text-indigo-700" },
    { value: "shipped",          label: "Shipped",          color: "bg-yellow-100 text-yellow-700" },
    { value: "out_for_delivery", label: "Processing",       color: "bg-orange-100 text-orange-700" },
    { value: "delivered",        label: "Delivered",        color: "bg-green-100 text-green-700" },
    { value: "return",           label: "Cancelled",        color: "bg-red-100 text-red-700" },
];

const TABS = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const TAB_MAP = {
    All:        null,
    Pending:    "placed",
    Confirmed:  "confirmed",
    Processing: "out_for_delivery",
    Shipped:    "shipped",
    Delivered:  "delivered",
    Cancelled:  "return",
};

const PAYMENT_COLORS = {
    Pending: "bg-yellow-100 text-yellow-700",
    Paid:    "bg-green-100 text-green-700",
    Failed:  "bg-red-100 text-red-700",
};

const statusColor = (val) => ORDER_STATUSES.find((s) => s.value === val)?.color || "bg-gray-100 text-gray-600";
const statusLabel = (val) => ORDER_STATUSES.find((s) => s.value === val)?.label || val;
const formatDate  = (iso)  => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/");
const formatAmt   = (n)    => Number(n || 0).toLocaleString("en-IN");

// ── Detail Modal ──────────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange, updating }) {
    if (!order) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6">
                <div className="flex items-center justify-between bg-[#3b497e] px-5 py-4 rounded-t-2xl">
                    <div>
                        <div className="text-white font-semibold text-[15px]">Order #{order._id.slice(-8).toUpperCase()}</div>
                        <div className="text-blue-200 text-[11px] mt-0.5">{formatDate(order.createdAt)}</div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition cursor-pointer"><FiX size={18} /></button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Status + payment */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[12px] font-semibold text-gray-600">Status:</span>
                        <select
                            value={order.orderStatus}
                            disabled={updating}
                            onChange={(e) => onStatusChange(order._id, e.target.value)}
                            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer disabled:opacity-50 ${statusColor(order.orderStatus)}`}
                        >
                            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                            {order.paymentStatus}
                        </span>
                        <span className="text-[11px] text-gray-500">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
                    </div>

                    {/* Items */}
                    <div>
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</div>
                        <div className="space-y-2">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-[#f9faff] rounded-xl p-3 border border-gray-100">
                                    <div className="w-12 h-12 bg-[#eef0f8] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                        {item.product_id?.thumbnail
                                            ? <Image src={item.product_id.thumbnail} alt={item.product_id.name || "product"} width={48} height={48} className="object-cover w-full h-full" />
                                            : <LuSofa className="text-[18px] text-[#3b497e]" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-medium text-[#1a1d2e] truncate">{item.product_id?.name || "Product"}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">Qty: {item.qty} × ₹{formatAmt(item.price)}</div>
                                    </div>
                                    <div className="text-[13px] font-bold text-[#3b497e] flex items-center whitespace-nowrap">
                                        <MdCurrencyRupee />{formatAmt(item.total)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Price breakdown */}
                        <div className="bg-[#f4f5fb] rounded-xl p-4">
                            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Price Breakdown</div>
                            <div className="space-y-1.5 text-[12px]">
                                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="flex items-center"><MdCurrencyRupee />{formatAmt(order.itemsPrice)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${formatAmt(order.shippingPrice)}`}</span></div>
                                <div className="flex justify-between font-bold text-[#1a1d2e] border-t border-gray-200 pt-2 mt-1">
                                    <span>Total</span><span className="flex items-center text-[#3b497e]"><MdCurrencyRupee />{formatAmt(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping address */}
                        <div className="bg-[#f4f5fb] rounded-xl p-4">
                            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Shipping Address</div>
                            <div className="flex gap-2">
                                <HiOutlineLocationMarker className="text-[#3b497e] shrink-0 mt-0.5" />
                                <div className="text-[12px] text-gray-600 leading-[1.8]">
                                    <span className="font-medium text-[#1a1d2e] block">{order.shippingAddress?.fullName}</span>
                                    {order.shippingAddress?.addressLine}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pinCode}<br />
                                    {order.shippingAddress?.mobile}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer */}
                    {order.user && (
                        <div className="bg-[#f4f5fb] rounded-xl p-4">
                            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</div>
                            <div className="text-[12px] text-gray-600 leading-[1.8]">
                                <span className="font-medium text-[#1a1d2e] capitalize">{order.user.firstName} {order.user.lastName}</span><br />
                                {order.user.email}{order.user.mobile && ` · ${order.user.mobile}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrdersPage() {
    const [orders, setOrders]             = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [activeTab, setActiveTab]       = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating]         = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        client.get("order")
            .then((res) => { if (res.data.success) setOrders(res.data.orders || []); })
            .catch((err) => toast.error(err.response?.data?.message || "Failed to load orders"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    // Filter
    const filtered = orders.filter((o) => {
        const tabStatus = TAB_MAP[activeTab];
        if (tabStatus && o.orderStatus !== tabStatus) return false;
        if (search.trim()) {
            const q = search.toLowerCase();
            return (
                o._id.toLowerCase().includes(q) ||
                o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
                `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            const res = await client.patch(`order/${orderId}/status`, { orderStatus: newStatus });
            if (res.data.success) {
                toast.success("Status updated!");
                const update = (list) => list.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o);
                setOrders(update);
                if (selectedOrder?._id === orderId) setSelectedOrder((p) => ({ ...p, orderStatus: newStatus }));
            }
        } catch { toast.error("Failed to update status"); }
        finally { setUpdating(false); }
    };

    return (
        <div className="p-5 sm:p-7 bg-[#f4f5fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-[22px] font-bold text-[#1a1d2e]">Orders</h1>
                    <p className="text-[12px] text-gray-500 mt-0.5">Manage customer orders</p>
                </div>
                <button className="inline-flex items-center gap-2 border border-gray-200 bg-white text-[#3b497e] rounded-xl px-4 py-2 text-[13px] font-medium hover:bg-[#f4f5fb] transition cursor-pointer">
                    <FiDownload size={14} /> Export
                </button>
            </div>

            {/* Tabs + Search */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
                {/* Tabs row */}
                <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-gray-100 flex-wrap">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-2 text-[13px] font-medium rounded-t-lg transition cursor-pointer border-b-2 -mb-px
                                ${activeTab === tab
                                    ? "text-[#3b497e] border-[#3b497e] bg-[#eef0f8]"
                                    : "text-gray-500 border-transparent hover:text-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                    {/* Search — right side */}
                    <div className="ml-auto pb-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search orders..."
                                className="pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg text-[12px] outline-none focus:border-[#3b497e] bg-[#f9faff] w-48"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase text-gray-500 tracking-wide">
                                <th className="px-5 py-3">Order ID</th>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Amount</th>
                                <th className="px-5 py-3">Payment</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="py-16 text-center text-[13px] text-gray-400">Loading orders...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="py-16 text-center text-[13px] text-gray-400">No orders found</td></tr>
                            ) : filtered.map((order) => (
                                <tr key={order._id} className="border-b border-gray-100 last:border-0 hover:bg-[#fafbff] transition">
                                    {/* Order ID */}
                                    <td className="px-5 py-3.5 font-semibold text-[#1a1d2e] font-mono text-[12px]">
                                        {order._id.slice(-8).toUpperCase()}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-5 py-3.5 text-gray-700 capitalize">
                                        {order.shippingAddress?.fullName ||
                                            `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "—"}
                                    </td>

                                    {/* Amount */}
                                    <td className="px-5 py-3.5 font-semibold text-[#1a1d2e]">
                                        <span className="flex items-center gap-0.5">
                                            <MdCurrencyRupee className="text-[13px]" />{formatAmt(order.totalAmount)}
                                        </span>
                                    </td>

                                    {/* Payment */}
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                                            {order.paymentStatus?.toLowerCase()}
                                        </span>
                                    </td>

                                    {/* Status dropdown */}
                                    <td className="px-5 py-3.5">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            disabled={updating}
                                            onClick={(e) => e.stopPropagation()}
                                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-gray-200 outline-none cursor-pointer disabled:opacity-50 ${statusColor(order.orderStatus)}`}
                                        >
                                            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </td>

                                    {/* Date */}
                                    <td className="px-5 py-3.5 text-gray-500 text-[12px]">
                                        {formatDate(order.createdAt)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#eef0f8] text-[#3b497e] hover:bg-[#3b497e] hover:text-white transition cursor-pointer"
                                            title="View details"
                                        >
                                            <FiEye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusChange={handleStatusChange}
                updating={updating}
            />
        </div>
    );
}
