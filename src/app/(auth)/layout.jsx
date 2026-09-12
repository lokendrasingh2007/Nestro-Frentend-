import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import { TbTruckDelivery } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { TbDiscount } from "react-icons/tb";
import { Toaster } from "sonner";
import Link from "next/link";
import StoreProvider from "@/redex/StoreProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nestro",
  description: "Luxury Furniture Store",
};

export default function RootLayout({ children }) {
  const features = [
    {
      icon: <TbTruckDelivery />,
      text: "Free delivery + white glove assembly on all orders",
    },
    {
      icon: <FaRegStar />,
      text: "Earn reward points on every purchase",
    },
    {
      icon: <TbDiscount />,
      text: "Members-only prices & early access",
    },
  ];
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-[#F8F5F1]">
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            duration: 700,
            style: {
              background: "#FFFFFF",
              color: "#8B5E3C",
              border: "1px solid #E8E0D5",
              borderRadius: "8px",
              fontSize: "13px",
            },
            className: "my-toast",
          }}
        />
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8F5F1] overflow-auto">
          {/* Left Side - Brand Section */}
          <div className="hidden md:flex w-full lg:w-[42%] bg-[#2C2016] flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-8 lg:py-10">
            <Link href="/">
              <div className="text-[18px] font-medium tracking-[0.14em] uppercase text-[#FAF7F4] mb-6">
                Nestro <span className="text-[#C6A27E]">.</span>
              </div>
            </Link>
            {/* <div className="text-center mb-6">
              <Image
                src="/selles/table.png"
                alt="Login Image"
                width={160}
                height={140}
                className="mx-auto w-32 sm:w-40 lg:w-44"
                priority
              />
            </div> */}
            <div className="text-[22px] sm:text-[26px] lg:text-[28px] font-normal text-center tracking-[-0.02em] leading-tight text-[#FAF7F4] mb-3">
              Your
              <em className="text-[#D6BFA7]"> Dream Home</em>
              <br />
              Starts Here
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#ffffff73] text-center leading-[1.7] mb-6 max-w-xs">
              Join 12,000 homeowners who've transformed their living spaces with Nestro.
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {features.map((item, index) => (
                <div key={index} className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 bg-[#c6a27e26] rounded-md flex items-center justify-center text-[#C6A27E] text-[14px] shrink-0">
                    {item.icon}
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-[#ffffff8c] leading-normal">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form Section */}
          <StoreProvider>
            {children}
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}