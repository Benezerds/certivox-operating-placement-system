"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { auth } from "../firebase";
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import Image from "next/image";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Added state for showing password
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard"); // Use push so users can navigate back to the login page if desired.
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Determine persistence type based on "Remember Me"
    const persistenceType = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    // Set persistence and sign in
    setPersistence(auth, persistenceType)
      .then(() => signInWithEmailAndPassword(auth, email, password))
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

        // Delay to show loading state before redirecting
        setTimeout(() => {
          router.push("/dashboard"); // Keep using push to allow back navigation.
          Swal.fire({
            icon: "success",
            title: "Uhuy!",
            text: "Masuk nih bener password nya.",
          });
        }, 3000);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        Swal.fire({
          icon: "error",
          title: "Yeuhhhhh...",
          text: "Email atau password salah, coba lagi!",
        });
      });
  };

  if (!isAuthenticated) {
    return null; // Avoid showing the login form until authentication state is known.
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image
        className="mx-auto mb-6"
        src="/cretivox_logo.png"
        alt="Cretivox Logo"
        width={380}
        height={246}
      />
      <div className="bg-white p-8 rounded-lg shadow-lg w-[380px]">
        <h2 className="mb-8 text-4xl font-bold text-center text-gray-700">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-xl font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-xl font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember_me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="block ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="px-4 py-3 mt-6 text-white transition-all duration-300 bg-black rounded-lg hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

export default Auth;
