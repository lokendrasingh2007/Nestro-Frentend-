import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/website/Header";
import ConditionalFooter from "@/components/website/ConditionalFooter";
import StoreProvider from "@/redex/StoreProvider";
import { Toaster } from "sonner";
import { getProfile } from "@/utils/serverApi";

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

export default async function RootLayout({ children }) {
  const getme = await getProfile();

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
        <StoreProvider>
          <Header user={getme.data} />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </StoreProvider>
      </body>
    </html>
  );
}