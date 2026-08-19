'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import Link from 'next/link';
import { client } from '@/utils/helper';

const STORAGE_KEY = "admin_notifications";
const SEEN_KEY    = "admin_notif_seen_ids";

function loadNotifications() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveNotifications(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function loadSeenIds() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); } catch { return new Set(); }
}
function saveSeenIds(set) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
}

function timeStr(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Header() {
  const [user, setUser]               = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]               = useState(false);
  const [seenIds, setSeenIds]         = useState(new Set());
  const panelRef                      = useRef(null);
  const lastOrderIds                  = useRef(null); // null = first load

  // Load user
  useEffect(() => {
    client.get('user/profile')
      .then((res) => { if (res.data.success) setUser(res.data.user); })
      .catch(() => {});
  }, []);

  // Load persisted notifications + seen IDs on mount
  useEffect(() => {
    setNotifications(loadNotifications());
    setSeenIds(loadSeenIds());
  }, []);

  // Poll orders every 15s — detect new orders & paid payments
  useEffect(() => {
    const check = () => {
      client.get("order")
        .then((res) => {
          if (!res.data.success) return;
          const orders = res.data.orders || [];
          const currentIds = new Set(orders.map((o) => o._id));

          if (lastOrderIds.current === null) {
            // First load — just record existing IDs, no notifications
            lastOrderIds.current = currentIds;
            return;
          }

          const newNotifs = [];

          orders.forEach((order) => {
            const nidOrder   = `order-${order._id}`;
            const nidPayment = `payment-${order._id}`;

            // New order placed
            if (!lastOrderIds.current.has(order._id)) {
              newNotifs.push({
                id:      nidOrder,
                type:    "order",
                title:   "🛒 New Order Placed!",
                body:    `Order #${order._id} placed for ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}`,
                time:    order.createdAt || new Date().toISOString(),
                read:    false,
              });
            }

            // Payment received (Paid status)
            if (order.paymentStatus === "Paid") {
              const existing = loadNotifications().find((n) => n.id === nidPayment);
              if (!existing) {
                newNotifs.push({
                  id:      nidPayment,
                  type:    "payment",
                  title:   "💰 Payment Received!",
                  body:    `Payment of ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")} received for Order #${order._id}`,
                  time:    order.paidAt || order.updatedAt || new Date().toISOString(),
                  read:    false,
                });
              }
            }
          });

          if (newNotifs.length > 0) {
            setNotifications((prev) => {
              // deduplicate
              const existingIds = new Set(prev.map((n) => n.id));
              const unique = newNotifs.filter((n) => !existingIds.has(n.id));
              const updated = [...unique, ...prev].slice(0, 50); // keep last 50
              saveNotifications(updated);
              return updated;
            });
          }

          lastOrderIds.current = currentIds;
        })
        .catch(() => {});
    };

    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markRead = (id) => {
    const updated = notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const initials  = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : '?';
  const fullName  = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Loading...';
  const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : user?.role || '';

  return (
    <header className="w-full h-[60.8px] shadow-sm border-b border-white/20 px-6 flex items-center justify-between sticky top-0 z-40 bg-white">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back 👋</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 duration-200"
            aria-label="Notifications"
          >
            <FaBell className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-bold text-[15px] text-gray-800">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[12px] text-blue-500 hover:underline cursor-pointer">
                    Mark all as read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-[13px] text-gray-400">No notifications yet</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition hover:bg-gray-50
                        ${!notif.read ? "bg-blue-50" : ""}`}
                    >
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-xl bg-[#eef0f8] flex items-center justify-center text-[16px] shrink-0 mt-0.5">
                        🛒
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-gray-800">{notif.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 leading-[1.5]">{notif.body}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{timeStr(notif.time)}</div>
                      </div>
                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                  <Link href="/admin/orders" onClick={() => setOpen(false)} className="text-[12px] text-[#3b497e] font-medium hover:underline">
                    View all orders →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <Link href="/admin/profile" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
          <div className="w-10 h-10 rounded-full bg-[#3b497e] flex items-center justify-center text-white text-[13px] font-semibold shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <h3 className="text-sm font-semibold text-gray-800 capitalize">{fullName}</h3>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
