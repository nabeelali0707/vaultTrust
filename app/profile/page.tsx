"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  // TODO: Fetch computed Trust Score and income reliability metrics (/api/v1/profile/reliability) based on linked accounts.

  const [consentActive, setConsentActive] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Interaction helpers for events inside the HTML designs
  const openDetail = (eventId: string) => {
    console.log('Opening details for:', eventId);
    if (typeof document !== 'undefined') {
      const rows = document.querySelectorAll('tbody tr');
      rows.forEach(row => {
        row.classList.remove('active-row', 'border-l-4', 'border-primary');
      });
    }
  };

  const openModal = () => {
    if (typeof document !== 'undefined') {
      const modal = document.getElementById('revocationModal');
      const content = document.getElementById('modalContent');
      if (modal && content) {
        modal.classList.remove('hidden');
        setTimeout(() => {
          content.classList.remove('scale-95', 'opacity-0');
          content.classList.add('scale-100', 'opacity-100');
        }, 10);
      }
    }
  };

  const closeModal = () => {
    if (typeof document !== 'undefined') {
      const content = document.getElementById('modalContent');
      const modal = document.getElementById('revocationModal');
      if (content && modal) {
        content.classList.add('scale-95', 'opacity-0');
        content.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
          modal.classList.add('hidden');
        }, 300);
      }
    }
  };

  const executeRevoke = () => {
    closeModal();
    if (typeof document !== 'undefined') {
      const toast = document.getElementById('successToast');
      if (toast) {
        setTimeout(() => {
          toast.classList.remove('translate-y-20', 'opacity-0');
          setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
          }, 4000);
        }, 400);
      }
    }
  };

  return (
    <>
      {/*  SideNavBar Execution  */}
      <nav className="h-screen w-64 fixed left-0 top-0 bg-surface dark:bg-inverse-surface shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col py-stack-lg z-50">
      <div className="px-6 mb-10">
      <h1 className="text-headline-md font-headline-md font-extrabold text-primary dark:text-inverse-primary">VaultTrust</h1>
      <p className="text-label-sm font-label-sm text-on-surface-variant/70 mt-1">Freelancer Portal</p>
      </div>
      <div className="flex-1 space-y-1">
      <a className="flex items-center px-6 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors" href="#">
      <span className="material-symbols-outlined mr-3">dashboard</span>
      <span className="text-label-md font-label-md">Overview</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors" href="#">
      <span className="material-symbols-outlined mr-3">account_balance</span>
      <span className="text-label-md font-label-md">Connected Accounts</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors" href="#">
      <span className="material-symbols-outlined mr-3">verified_user</span>
      <span className="text-label-md font-label-md">Consent Center</span>
      </a>
      <a className="flex items-center px-6 py-3 text-primary dark:text-inverse-primary font-bold border-r-4 border-primary dark:border-inverse-primary bg-primary-container/10" href="#">
      <span className="material-symbols-outlined mr-3">payments</span>
      <span className="text-label-md font-label-md">Income Profile</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors" href="#">
      <span className="material-symbols-outlined mr-3">receipt_long</span>
      <span className="text-label-md font-label-md">Activity &amp; Audit Trail</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors" href="#">
      <span className="material-symbols-outlined mr-3">settings</span>
      <span className="text-label-md font-label-md">Settings</span>
      </a>
      </div>
      <div className="px-6 mt-auto">
      <button className="w-full bg-primary-container text-on-primary py-4 px-4 rounded-xl font-label-md text-center shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
      <span className="material-symbols-outlined text-[18px]">verified</span>
                      View Active Consents
                  </button>
      </div>
      </nav>
      {/*  Main Content Canvas  */}
      <main className="ml-64 min-h-screen">
      {/*  TopAppBar Execution  */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-16 bg-surface-container-lowest dark:bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] sticky top-0 z-40">
      <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Income Profile</h2>
      <div className="flex items-center gap-4">
      <button className="hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-full p-2 transition-opacity active:opacity-80">
      <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
      </button>
      <div className="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden ring-2 ring-primary/10">
      <img className="w-full h-full object-cover" data-alt="A professional close-up portrait of a freelancer in their late 20s, with a soft-focus office background. The lighting is clean and institutional, with a calm, trust-evoking expression. The image color palette matches the deep greens and mint tones of the VaultTrust brand for a cohesive identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuASpHMZOEB8JHuADjq8shr6na23FCYrctTdBpgoBmmWSnoMggSmjRGIIzJQ_9VQ9rdGRZCEpEkyVNGemErNxH-yFyzFjKuLJyNg85YFdNwvlArMSTcCnKIwgI_WZZkuzIobWajCilYaSHwnMqZdPfmqh7AGFDEywyw2TqbnEEPkPjGSQoWHYvqexn2Ehz7kTD-4TqeDo40764nGi8X2SJLAf0ScZkXiMloxDvtprqoWo5inKQuXPdKKWQ"/>
      </div>
      </div>
      </header>
      {/*  Canvas Body  */}
      <div className="p-stack-lg max-w-container-max mx-auto">
      {/*  Bento Grid Layout  */}
      <div className="grid grid-cols-12 gap-gutter">
      {/*  Score Card & Gauge (Major Section)  */}
      <section className="col-span-12 lg:col-span-7 space-y-gutter">
      <div className="bg-surface-container-lowest rounded-card p-stack-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden group">
      {/*  Decorative background texture  */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
      <span className="material-symbols-outlined text-[120px]">shield_person</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-stack-lg">
      <div className="flex flex-col items-center">
      <div className="gauge-container">
      <svg className="w-full" viewBox="0 0 200 100">
      <path className="gauge-path" d="M20,90 A80,80 0 0,1 180,90"></path>
      <path className="gauge-fill" d="M20,90 A80,80 0 0,1 180,90"></path>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
      <span className="text-headline-lg font-headline-lg text-primary">82</span>
      <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Trust Score</span>
      </div>
      </div>
      <div className="mt-4 px-4 py-1 bg-primary/5 rounded-full">
      <span className="text-primary font-bold text-body-md">Score 82 - Strong</span>
      </div>
      </div>
      <div className="flex-1 space-y-stack-md">
      <h3 className="text-headline-sm font-headline-sm text-primary">Financial Reliability</h3>
      <p className="text-body-md text-on-surface-variant leading-relaxed">
                                          Your profile demonstrates exceptional stability. This human-friendly score indicates a high likelihood of consistent future earnings based on 18 months of historical freelancer platform data.
                                      </p>
      <div className="flex items-start gap-2 p-3 bg-surface-container rounded-xl">
      <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">info</span>
      <p className="text-body-sm text-on-surface-variant italic">
                                              Score is an indicator, not a final lending decision.
                                          </p>
      </div>
      </div>
      </div>
      </div>
      {/*  Metric Cards Sub-grid  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
      {/*  Avg Income  */}
      <div className="bg-surface-container-lowest p-stack-md rounded-card shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-primary">
      <div className="flex justify-between items-start">
      <div>
      <p className="text-label-sm font-label-sm text-on-surface-variant">Average Monthly</p>
      <h4 className="text-headline-sm font-headline-sm text-primary mt-1">PKR 198,000</h4>
      </div>
      <span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-lg">account_balance_wallet</span>
      </div>
      <div className="mt-4 flex items-center gap-1 text-primary text-label-sm">
      <span className="material-symbols-outlined text-sm">trending_up</span>
      <span>Above average for your sector</span>
      </div>
      </div>
      {/*  Consistency  */}
      <div className="bg-surface-container-lowest p-stack-md rounded-card shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-secondary">
      <div className="flex justify-between items-start">
      <div>
      <p className="text-label-sm font-label-sm text-on-surface-variant">Consistency Rank</p>
      <h4 className="text-headline-sm font-headline-sm text-secondary mt-1">High Consistency</h4>
      </div>
      <span className="material-symbols-outlined text-secondary bg-secondary/5 p-2 rounded-lg">rebase_edit</span>
      </div>
      <p className="mt-4 text-body-sm text-on-surface-variant">98% predictable income flow.</p>
      </div>
      {/*  Trend  */}
      <div className="bg-surface-container-lowest p-stack-md rounded-card shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-tertiary-container">
      <div className="flex justify-between items-start">
      <div>
      <p className="text-label-sm font-label-sm text-on-surface-variant">Income Velocity</p>
      <h4 className="text-headline-sm font-headline-sm text-tertiary mt-1">Growing Trend</h4>
      </div>
      <span className="material-symbols-outlined text-tertiary bg-tertiary/5 p-2 rounded-lg">show_chart</span>
      </div>
      <p className="mt-4 text-body-sm text-on-surface-variant">+12% growth over last quarter.</p>
      </div>
      {/*  Diversity  */}
      <div className="bg-surface-container-lowest p-stack-md rounded-card shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-on-primary-container">
      <div className="flex justify-between items-start">
      <div>
      <p className="text-label-sm font-label-sm text-on-surface-variant">Income Sources</p>
      <h4 className="text-headline-sm font-headline-sm text-on-primary-fixed-variant mt-1">Healthy Diversity</h4>
      </div>
      <span className="material-symbols-outlined text-on-primary-fixed-variant bg-on-primary-container/10 p-2 rounded-lg">hub</span>
      </div>
      <p className="mt-4 text-body-sm text-on-surface-variant">Spread across 4 major clients.</p>
      </div>
      </div>
      </section>
      {/*  Right Column: "What the Bank Sees"  */}
      <aside className="col-span-12 lg:col-span-5 space-y-gutter">
      <div className="glass-card rounded-card p-stack-lg shadow-[0px_12px_32px_rgba(0,74,59,0.08)]">
      <div className="flex items-center gap-3 mb-6">
      <span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>visibility</span>
      <h3 className="text-headline-sm font-headline-sm text-primary">What the bank sees</h3>
      </div>
      <p className="text-body-sm text-on-surface-variant mb-6">
                                  Banks only receive aggregated verification tokens. Your raw transaction data remains private and locked in the vault.
                              </p>
      <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/60">
      <span className="text-label-md font-label-md text-on-surface">Verified Identity</span>
      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
      </div>
      <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/60">
      <span className="text-label-md font-label-md text-on-surface">6-Month Aggregate</span>
      <span className="text-body-md font-bold text-primary">PKR 1.24M</span>
      </div>
      <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/60">
      <span className="text-label-md font-label-md text-on-surface">Stability Rating</span>
      <span className="px-3 py-1 bg-primary text-white rounded-full text-[12px] font-bold">ALPHA+</span>
      </div>
      <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/60">
      <span className="text-label-md font-label-md text-on-surface">Risk Token</span>
      <code className="text-[11px] bg-surface-container px-2 py-1 rounded">vt_hash_7712...</code>
      </div>
      </div>
      <div className="mt-8 pt-6 border-t border-surface-container">
      <div className="flex items-center gap-4 text-primary group cursor-pointer">
      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">security</span>
      <span className="text-label-md font-label-md">Manage privacy &amp; consent</span>
      </div>
      </div>
      </div>
      {/*  Security Badge  */}
      <div className="bg-surface-container p-stack-lg rounded-card flex items-center gap-stack-md border border-outline-variant/30">
      <div className="p-3 bg-white rounded-full text-tertiary shadow-sm">
      <span className="material-symbols-outlined text-[32px]">lock</span>
      </div>
      <div>
      <h4 className="text-label-md font-label-md text-on-surface">Restricted Data Access</h4>
      <p className="text-body-sm text-on-surface-variant">Zero-knowledge proof encryption active.</p>
      </div>
      </div>
      {/*  Chart Placeholder Visual  */}
      <div className="bg-surface-container-lowest rounded-card p-stack-lg shadow-sm h-48 overflow-hidden relative group">
      <div className="flex justify-between items-center mb-4">
      <h5 className="text-label-sm font-label-sm text-on-surface-variant uppercase">Earning Trajectory</h5>
      <span className="text-primary font-bold text-label-sm">+4.2% MoM</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-primary/10 to-transparent"></div>
      <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 100">
      <path className="drop-shadow-lg" d="M0,80 Q50,75 100,60 T200,45 T300,30 T400,10" fill="none" stroke="#004a3b" strokeLinecap="round" strokeWidth="3"></path>
      <circle cx="100" cy="60" fill="#004a3b" r="4"></circle>
      <circle cx="200" cy="45" fill="#004a3b" r="4"></circle>
      <circle cx="300" cy="30" fill="#004a3b" r="4"></circle>
      <circle cx="400" cy="10" fill="#004a3b" r="4"></circle>
      </svg>
      </div>
      </aside>
      </div>
      </div>
      </main>
      {/*  FAB Suppression Rule: Hide on Detail Screens (per prompt instructions, we focus on profile view, but usually suppressed on details)  */}
      {/*  However, we want 'Manage Consent' as an action, so we use a prominent bottom action bar for mobile or fixed action  */}
      <div className="fixed bottom-8 right-8 md:hidden">
      <button className="bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center">
      <span className="material-symbols-outlined">manage_accounts</span>
      </button>
      </div>
    </>
  );
}
