import { Inter } from "next/font/google";
import "./globals.css";
import Sidenav from "@/components/shared/Sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OPERATING PLACEMENT SYSTEM",
  description: "OPERATING PLACEMENT SYSTEM || CRETIVOX ZEN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidenav />
          <div className="flex-1 p-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
