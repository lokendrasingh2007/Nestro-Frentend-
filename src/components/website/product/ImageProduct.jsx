"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ImageProduct({ thumbnail, images = [], name = "Product" }) {
  // Merge thumbnail + gallery, deduplicate
  const allImages = [
    ...(thumbnail ? [thumbnail] : []),
    ...images.filter((img) => img !== thumbnail),
  ];

  // Fallback if no images from API
  const displayImages = allImages.length > 0 ? allImages : ["/selles/sofa.png"];
  const [activeImage, setActiveImage] = useState(displayImages[0]);

  return (
    <div className="pr-0 sm:pr-4 lg:pr-8">
      {/* Main Image */}
      <div className="bg-[#EDE8E2] rounded-[14px] h-64 sm:h-80 md:h-96 lg:h-105 flex items-center justify-center mb-3 relative overflow-hidden">
        <Image
          src={activeImage}
          alt={name}
          fill
          className="object-contain transition-transform duration-300"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 sm:gap-2.5 lg:gap-3 flex-wrap">
          {displayImages.map((src, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(src)}
              className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 bg-[#F0E8DC] border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300
                ${activeImage === src ? "border-[#8B5E3C]" : "border-transparent"}`}
            >
              <Image
                src={src}
                alt={`${name} view ${index + 1}`}
                width={72}
                height={72}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
