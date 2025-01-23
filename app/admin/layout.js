import { Inter } from "next/font/google";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin",
  description: "OPERATING PLACEMENT SYSTEM || CRETIVOX ZEN",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex w-screen h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}