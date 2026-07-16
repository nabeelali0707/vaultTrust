"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const routes = [
  { href: "/", label: "Welcome", icon: "home" },
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/connect", label: "Connect Income", icon: "link" },
  { href: "/consent/setup", label: "Setup Consent", icon: "tune" },
  { href: "/consent/active", label: "Consent Active", icon: "verified_user" },
  { href: "/consent/manage", label: "Manage Consents", icon: "manage_accounts" },
  { href: "/audit", label: "Audit Trail", icon: "receipt_long" },
  { href: "/profile", label: "My Profile", icon: "person" },
  { href: "/onboarding", label: "Onboarding", icon: "waving_hand" },
  { href: "/lending", label: "UBL Lending", icon: "account_balance" },
  { href: "/applicant", label: "Applicant View", icon: "badge" },
];

export default function DevNav() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState("ahmed-raza-id");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )x-user-id=([^;]*)/);
    if (match) {
      setCurrentUser(match[1]);
    }
  }, []);

  const handleUserChange = async (val: string) => {
    document.cookie = `x-user-id=${val}; path=/; max-age=${60 * 60 * 24 * 7}`;
    
    if (auth) {
      let email = "";
      if (val === "ubl-bank-id") email = "ubl.officer@example.com";
      else if (val === "sana-malik-id") email = "sana.malik@example.com";
      else email = "ahmed.raza@example.com";
      
      try {
        await signInWithEmailAndPassword(auth, email, "password123");
        console.log(`[DevNav] Signed in to Firebase Auth: ${email}`);
      } catch (err: any) {
        console.warn(`[DevNav] Firebase Auth sign-in failed (local mode fallback active):`, err.message);
      }
    }

    setCurrentUser(val);
    if (val === "ubl-bank-id") {
      window.location.href = "/lending";
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      {/* Floating dev nav pill - fixed bottom center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-[#003127]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 max-w-[95vw] overflow-x-auto">
        <div className="flex flex-col gap-0.5 mr-2 shrink-0 border-r border-white/10 pr-2">
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
            Session
          </span>
          <select
            value={currentUser}
            onChange={(e) => handleUserChange(e.target.value)}
            className="bg-black/40 text-white text-[10px] font-semibold rounded-lg px-2 py-1 outline-none border border-white/10 cursor-pointer"
          >
            <option value="ahmed-raza-id" className="bg-[#003127] text-white">Ahmed Raza (Freelancer)</option>
            <option value="sana-malik-id" className="bg-[#003127] text-white">Sana Malik (Freelancer)</option>
            <option value="ubl-bank-id" className="bg-[#003127] text-white">UBL Bank Officer</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mr-1 shrink-0">
            Pages
          </span>
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                title={route.label}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all shrink-0 group ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {route.icon}
                </span>
                <span className="text-[9px] font-semibold tracking-wide leading-none">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Bottom padding so content isn't hidden behind nav */}
      <div className="h-24" />
    </>
  );
}

