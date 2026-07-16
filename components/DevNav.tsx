"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";

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

  const handleLogout = async () => {
    if (auth) {
      try {
        await auth.signOut();
        // Clear cookies
        document.cookie = "x-user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/login";
      } catch (err: any) {
        console.error("[DevNav] Logout failed:", err);
      }
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-black/40 hover:bg-error-container/20 text-white hover:text-error text-[10px] font-semibold rounded-lg px-2.5 py-1.5 outline-none border border-white/10 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            <span>Logout</span>
          </button>
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

