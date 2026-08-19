"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { FiMail, FiTrash2, FiSearch, FiEye, FiX, FiSend } from "react-icons/fi";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

const SUBJECT_COLORS = {
    "General Inquiry":    "bg-[#eef0f8] text-[#3b497e]",
    "Product Information":"bg-blue-50 text-blue-700",
    "Order Support":      "bg-amber-50 text-amber-700",
    "Custom Order":       "bg-purple-50 text-purple-700",
    "Return & Refund":    "bg-red-50 text-red-600",
};

// ── Detail + Reply Modal ──────────────────────────────────────────────────────
function MessageModal({ msg, onClose, onMarkRead, onDelete }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending]     = useState(false);

    if (!msg) return null;

    const handleSendReply = async () => {
        if (!replyText.trim()) { toast.error("Please write a reply message"); return; }
        setSending(true);
        try {
            const res = await client.post(`contact/${msg._id}/reply`, { replyMessage: replyText });
            if (res.data.success) {
                toast.success(`Reply sent to ${msg.email}`);
                setReplyText("");
                setShowReply(false);
                onMarkRead(msg._id);
            } else {
                toast.error(res.data.message || "Failed to send");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-[#3b497e] px-5 py-4">
                    <div>
                        <div className="text-white font-semibold text-[15px]">Message Detail</div>
                        <div className="text-blue-200 text-[11px] mt-0.5">{fmtDate(msg.createdAt)}</div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition cursor-pointer">
                        <FiX size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Sender info */}
                    <div className="bg-[#f4f5fb] rounded-xl p-4 space-y-2 text-[13px]">
                        <div className="flex gap-3">
                            <span className="text-[#6b7fc4] w-16 shrink-0">Name</span>
                            <span className="font-semibold text-[#1a1d2e] capitalize">{msg.firstName} {msg.lastName}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-[#6b7fc4] w-16 shrink-0">Email</span>
                            <span className="text-[#3b497e]">{msg.email}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-[#6b7fc4] w-16 shrink-0">Subject</span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[msg.subject] || "bg-gray-100 text-gray-600"}`}>
                                {msg.subject}
                            </span>
                        </div>
                    </div>

                    {/* Original message */}
                    <div>
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</div>
                        <div className="bg-[#f9faff] border border-[#e8eaf5] rounded-xl p-4 text-[13px] text-gray-700 leading-[1.8] whitespace-pre-wrap">
                            {msg.message}
                        </div>
                    </div>

                    {/* Reply textarea */}
                    {showReply && (
                        <div className="border border-[#e8eaf5] rounded-xl overflow-hidden">
                            <div className="bg-[#f4f5fb] px-4 py-2.5 flex items-center justify-between border-b border-[#e8eaf5]">
                                <span className="text-[11px] font-semibold text-[#3b497e]">
                                    Replying to {msg.firstName} · {msg.email}
                                </span>
                            </div>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={5}
                                placeholder="Type your reply here..."
                                className="w-full px-4 py-3 text-[13px] text-gray-700 outline-none resize-none leading-[1.7] placeholder:text-gray-400"
                                disabled={sending}
                            />
                            <div className="flex items-center gap-2 px-4 py-3 border-t border-[#e8eaf5] bg-[#fafbff]">
                                <button onClick={handleSendReply} disabled={sending}
                                    className="flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2 text-[12px] font-semibold transition disabled:opacity-50 cursor-pointer">
                                    <FiSend size={13} /> {sending ? "Sending..." : "Send Reply"}
                                </button>
                                <button onClick={() => { setShowReply(false); setReplyText(""); }}
                                    className="text-[12px] text-gray-500 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition cursor-pointer">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {!showReply && (
                        <div className="flex items-center gap-3 pt-1">
                            <button onClick={() => setShowReply(true)}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl py-2.5 text-[13px] font-medium transition cursor-pointer">
                                <FiMail size={14} /> Reply via Email
                            </button>
                            {!msg.isRead && (
                                <button onClick={() => onMarkRead(msg._id)}
                                    className="flex items-center gap-1.5 border border-[#3b497e] text-[#3b497e] rounded-xl px-4 py-2.5 text-[12px] font-medium hover:bg-[#eef0f8] transition cursor-pointer">
                                    <MdOutlineMarkEmailRead size={15} /> Mark Read
                                </button>
                            )}
                            <button onClick={() => onDelete(msg._id)}
                                className="flex items-center gap-1.5 border border-red-200 text-red-500 rounded-xl px-4 py-2.5 text-[12px] font-medium hover:bg-red-50 transition cursor-pointer">
                                <FiTrash2 size={13} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactsPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState("");
    const [filter, setFilter]     = useState("all");
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const fetchMessages = () => {
        setLoading(true);
        client.get("contact")
            .then((res) => { if (res.data.success) setMessages(res.data.contacts || []); })
            .catch(() => toast.error("Failed to load messages"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchMessages(); }, []);

    const handleMarkRead = async (id) => {
        try {
            const res = await client.patch(`contact/${id}/read`);
            if (res.data.success) {
                setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
                if (selected?._id === id) setSelected((p) => ({ ...p, isRead: true }));
            }
        } catch { toast.error("Failed"); }
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            const res = await client.delete(`contact/${id}`);
            if (res.data.success) {
                setMessages((prev) => prev.filter((m) => m._id !== id));
                if (selected?._id === id) setSelected(null);
                toast.success("Deleted");
            }
        } catch { toast.error("Failed to delete"); }
        finally { setDeleting(null); }
    };

    const handleOpen = (msg) => {
        setSelected(msg);
        if (!msg.isRead) handleMarkRead(msg._id);
    };

    const filtered = messages.filter((m) => {
        if (filter === "unread" && m.isRead)  return false;
        if (filter === "read"   && !m.isRead) return false;
        if (search.trim()) {
            const q = search.toLowerCase();
            return (
                m.firstName?.toLowerCase().includes(q) ||
                m.lastName?.toLowerCase().includes(q)  ||
                m.email?.toLowerCase().includes(q)     ||
                m.subject?.toLowerCase().includes(q)   ||
                m.message?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const unreadCount = messages.filter((m) => !m.isRead).length;

    return (
        <div className="p-5 sm:p-7 bg-[#f4f5fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[22px] font-bold text-[#1a1d2e]">Contact Messages</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}` : "All messages read"}
                    </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#eef0f8] text-[#3b497e] flex items-center justify-center relative">
                    <FiMail size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#e8eaf5] shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
                <div className="flex gap-1">
                    {["all","unread","read"].map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition cursor-pointer capitalize
                                ${filter === f ? "bg-[#3b497e] text-white" : "bg-[#f4f5fb] text-[#6b7fc4] hover:bg-[#eef0f8]"}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 min-w-40">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, subject..."
                        className="w-full pl-8 pr-4 py-2 border border-[#e8eaf5] rounded-xl text-[12px] outline-none focus:border-[#3b497e] bg-[#f9faff]" />
                </div>
                <div className="text-[12px] text-gray-400 ml-auto">{filtered.length} message{filtered.length !== 1 ? "s" : ""}</div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#e8eaf5] shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_0.8fr] gap-4 px-5 py-3 bg-[#f4f5fb] text-[10px] uppercase text-[#6b7fc4] tracking-wide font-medium border-b border-[#e8eaf5]">
                    <div>Sender</div><div>Subject</div><div>Date</div><div>Status</div><div className="text-right">Actions</div>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-[13px] text-gray-400">Loading messages...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiMail className="mx-auto text-[32px] text-[#d8dcee] mb-3" />
                        <div className="text-[13px] text-gray-400">No messages found</div>
                    </div>
                ) : filtered.map((msg) => (
                    <div key={msg._id}
                        className={`grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_1fr_0.8fr] gap-4 px-5 py-4 items-center border-b border-[#f0f1f8] last:border-0 hover:bg-[#fafbff] transition cursor-pointer
                            ${!msg.isRead ? "bg-[#fafbff] border-l-2 border-l-[#3b497e]" : ""}`}
                        onClick={() => handleOpen(msg)}>

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#3b497e] flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                                {`${msg.firstName?.charAt(0)||""}${msg.lastName?.charAt(0)||""}`.toUpperCase() || "?"}
                            </div>
                            <div>
                                <div className={`text-[12px] ${!msg.isRead ? "font-bold" : "font-medium"} text-[#1a1d2e] capitalize`}>
                                    {msg.firstName} {msg.lastName}
                                </div>
                                <div className="text-[10px] text-[#6b7fc4] truncate max-w-40">{msg.email}</div>
                            </div>
                        </div>

                        <div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[msg.subject] || "bg-gray-100 text-gray-600"}`}>
                                {msg.subject}
                            </span>
                            <div className="text-[11px] text-gray-400 mt-1 truncate max-w-56">{msg.message}</div>
                        </div>

                        <div className="text-[11px] text-gray-500">{fmtDate(msg.createdAt)}</div>

                        <div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${msg.isRead ? "bg-gray-100 text-gray-500" : "bg-[#eef0f8] text-[#3b497e]"}`}>
                                {msg.isRead ? "Read" : "Unread"}
                            </span>
                        </div>

                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleOpen(msg)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#eef0f8] text-[#3b497e] hover:bg-[#3b497e] hover:text-white transition cursor-pointer">
                                <FiEye size={13} />
                            </button>
                            <button onClick={() => handleDelete(msg._id)} disabled={deleting === msg._id}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-50 cursor-pointer">
                                <FiTrash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <MessageModal
                msg={selected}
                onClose={() => setSelected(null)}
                onMarkRead={handleMarkRead}
                onDelete={(id) => { handleDelete(id); setSelected(null); }}
            />
        </div>
    );
}
