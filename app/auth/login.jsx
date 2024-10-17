"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from 'next/image'; // Import the Next.js Image component

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
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Use Next.js Image component with width and height specified */}
      <Image
        className="mx-auto mb-6"
        src="/cretivox_logo.png"
        alt="Cretivox Logo"
        width={380} // Adjust as needed
        height={246} // Adjust as needed
      />

      <div className="bg-white p-8 rounded-lg shadow-lg w-[380px]">
        <h2 className="text-center text-4xl font-bold text-gray-700 mb-8">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg bg-gray-100 w-full border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xl font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-gray-100 w-full border border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember_me"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="mt-6 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};