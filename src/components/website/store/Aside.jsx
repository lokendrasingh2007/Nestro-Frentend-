import React from 'react'
import Availability from "../fillter/Availability";
import RoomType from "../fillter/RoomType";
import PriceRange from "../fillter/PriceRange";
import Color from "../fillter/Color";
import Rating from "../fillter/Rating";
import Category from "../fillter/Category";
import { fetchCategory, fetchRooms, fetchColors } from "@/utils/api";

export default async function Aside() {
    const room = await fetchRooms();
    const category = await fetchCategory();
    const colors = await fetchColors();

    return (
        <div>
            <div className="">
                <div className="bg-white rounded-xl border border-[#E8E0D5] p-4 sm:p-5 sticky top-24">
                    <RoomType title="Room Type" data={room.data} queryKey="rooms" />
                    <PriceRange />
                    <Category title="Category" data={category.data} queryKey="category" />
                    <Color data={colors.data || []} />
                    <Availability />
                    <Rating />
                    <button className="w-full mt-4 border border-[#8B5E3C] text-[#8B5E3C] text-[11px] py-2 rounded-md hover:bg-[#8B5E3C] hover:text-white transition">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    )
}
