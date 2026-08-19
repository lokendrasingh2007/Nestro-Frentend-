'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaBars } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { MdOutlineDashboard, MdOutlineLogout } from "react-icons/md";
import { usePathname, useRouter } from 'next/navigation';
import { FaHouseChimney } from "react-icons/fa6";
import { GrProductHunt } from "react-icons/gr";
import { IoMdColorPalette } from "react-icons/io";
import { FiUsers, FiMail } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import { BsCart4 } from "react-icons/bs";

import { client } from '@/utils/helper';
import { toast } from 'sonner';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [toggle, setToggle] = useState(true);

    const items = [
        { name: "Dashboard", path: "/admin",            icon: <MdOutlineDashboard size={22} /> },
        { name: "Category",  path: "/admin/category",   icon: <TbCategoryFilled size={22} /> },
        { name: "Room Type", path: "/admin/room-type",  icon: <FaHouseChimney size={22} /> },
        { name: "Product",   path: "/admin/product",    icon: <GrProductHunt size={22} /> },
        { name: "Color",     path: "/admin/color",      icon: <IoMdColorPalette size={22} /> },
        { name: "Users",     path: "/admin/users",      icon: <FiUsers size={22} /> },
        { name: "Customers", path: "/admin/customers",   icon: <HiOutlineUsers size={22} /> },
        { name: "Orders",   path: "/admin/orders",   icon: <BsCart4 size={22} /> },
        { name: "Contacts", path: "/admin/contacts", icon: <FiMail size={22} /> },
    ];

    const handleLogout = async () => {
        try {
            await client.post("user/logout").catch(() => {});
        } finally {
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            toast.success("Logged out successfully");
            router.push("/login");
        }
    };

    return (
        <div className={`${toggle ? 'w-20' : 'w-64'} duration-300 h-screen flex flex-col sticky z-50 top-0 bg-[#3b497e] shadow-xl`}>
            {/* Header */}
            <div className='flex justify-between py-5 px-5 border-b border-white/20 items-center'>
                {!toggle && (
                    <h1 className='text-2xl font-bold text-white tracking-wide'>Nestro</h1>
                )}
                <FaBars
                    onClick={() => setToggle(!toggle)}
                    className='text-white cursor-pointer text-xl'
                />
            </div>

            {/* Nav Items */}
            <div className='mt-6 pe-3 flex flex-col gap-2 flex-1'>
                {items.map((item, index) => {
                    const active = pathname === item.path;
                    return (
                        <div key={index} className='relative group'>
                            <Link
                                href={item.path}
                                style={{ borderRadius: "0px 20px 20px 0px" }}
                                className={`px-4 py-3 text-white flex items-center gap-4 transition-all duration-200 hover:bg-[#ffffff1a] ${active ? "bg-[#ffffff1a]" : ""}`}
                            >
                                <span className='text-xl'>{item.icon}</span>
                                {!toggle && <span className='font-medium'>{item.name}</span>}
                            </Link>
                            {toggle && (
                                <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Logout Button — bottom */}
            <div className='pe-3 pb-5 relative group'>
                <button
                    onClick={handleLogout}
                    style={{ borderRadius: "0px 20px 20px 0px" }}
                    className='w-full px-4 py-3 text-white flex items-center gap-4 transition-all duration-200 hover:bg-red-500/20 cursor-pointer'
                >
                    <span className='text-xl'><MdOutlineLogout size={22} /></span>
                    {!toggle && <span className='font-medium'>Logout</span>}
                </button>
                {toggle && (
                    <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        Logout
                    </div>
                )}
            </div>
        </div>
    );
}
