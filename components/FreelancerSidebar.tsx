"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Overview" },
  { href: "/connect", icon: "account_balance", label: "Connected Accounts" },
  { href: "/consent/setup", icon: "verified_user", label: "Consent Center" },
  { href: "/profile", icon: "payments", label: "Income Profile" },
  { href: "/audit", icon: "receipt_long", label: "Activity & Audit Trail" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function FreelancerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d1f1a] fixed left-0 top-0 h-screen flex flex-col py-8 shadow-[4px_0px_20px_rgba(0,0,0,0.15)] z-30 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link href="/" className="block">
          <h1 className="text-headline-sm font-bold text-[#95d3bf]">VaultTrust</h1>
          <p className="text-label-sm text-white/40 mt-0.5">Freelancer Portal</p>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 transition-colors ${
                    isActive
                      ? "text-[#95d3bf] font-bold border-r-4 border-[#95d3bf] bg-white/5"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">
                    {item.icon}
                  </span>
                  <span className="text-label-md font-label-md">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom CTA */}
      <div className="px-6 mt-auto pt-6 border-t border-white/10">
        <Link
          href="/consent/active"
          className="w-full bg-[#95d3bf] text-[#0d1f1a] py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          View Active Consents
        </Link>
      </div>
    </aside>
  );
}
