import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/shared/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard",
  description: "OPERATING PLACEMENT SYSTEM || CRETIVOX ZEN",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}