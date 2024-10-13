"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Swal.fire({
          title: "SABARR!",
          text: "Bentar ya dek ya...",
          imageUrl:
            "https://media.tenor.com/Gjgw3iUuqpwAAAAM/the-fresh-prince-of-bel-air-wait-a-minute.gif",
          imageWidth: 400,
          imageHeight: 200,
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        setTimeout(() => {
          router.push("/dashboard");
          Swal.fire({
            icon: "success",
            title: "Uhuy!",
            text: "Masuk nih bener password nya.",
          });
        }, 3000);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Yeuhhhhh...",
          text: "Email atau password salah, coba lagi!",
        });
      });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="flex justify-center items-center bg-[#0f0e0a] min-h-dvh bg-[url('/backgroundImg.jpeg')] bg-no-repeat bg-cover bg-center">
      <div className="px-6 py-6 bg-gray-700/30 flex justify-center items-center rounded-xl w-1/3">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <label htmlFor="email" className="text-3xl font-bold text-white">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-3 rounded-lg bg-gray-200 w-full"
          />
          <label htmlFor="password" className="text-3xl font-bold text-white">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-3 rounded-lg bg-gray-200 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 w-full"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};
