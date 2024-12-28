'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { auth } from "@/app/firebase"; // Adjust the import path as necessary

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getAuth().currentUser;

    // If the user is not authenticated, redirect to the /auth page
    if (!user) {
      router.push("/auth");
    }
  }, [router]);

  return <></>; // Empty because the user will be redirected
}
