import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OPERATING PLACEMENT SYSTEM",
  description: "OPERATING PLACEMENT SYSTEM || CRETIVOX ZEN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div className="flex w-screen h-screen">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
