"use client";

import React, { useState } from "react";
import Link from "next/link";
import BankSidebar from "@/components/BankSidebar";

export default function Page() {
  // TODO: Retrieve applicant financial stability metrics and verified monthly deposits (/api/v1/credit/underwrite) for the loan officer.

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
      {/*  SideNavBar (Authority: Institutional Modernism)  */}
      
      <BankSidebar />

      {/*  TopAppBar  */}
      <header className="fixed top-0 right-0 left-72 h-16 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center px-margin-desktop z-40">
      <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-outline cursor-pointer">arrow_back</span>
      <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Applicant Profile</h2>
      </div>
      <div className="flex items-center gap-4">
      <button className="hover:bg-surface-container-high rounded-full p-2 transition-all">
      <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
      </button>
      <button className="hover:bg-surface-container-high rounded-full p-2 transition-all">
      <span className="material-symbols-outlined text-on-surface-variant">verified</span>
      </button>
      <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
      <img className="w-full h-full object-cover" data-alt="A professional headshot of a financial services administrator in a corporate setting, looking confident and reliable. The lighting is soft and neutral, reflecting a corporate institutional modernist aesthetic with a palette of deep greens and crisp whites." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB50jon0UWjgDgx0E2K2JWoo20_ijw4iRThZ-WS-cEQiYcA7kIFrdWk7dDTnpy8O0bXSEjkKDpmpQ4nb-3JgID-BEE7OQ3ACRpVoSkIoHozrv3HYN40kmCP-6MXr3mDSwYjxNNbZ1mLjfTK6U8Vy2DHR2TNw25WLhhWZn0tscy4OsMQCudVbOmG6ahuMFBBkz-bHFgHcNQHoDeuFn0aweMOttsPzCPGiX_byFk6A-0XYekGP8YJMB_S1g"/>
      </div>
      </div>
      </header>
      {/*  Main Content Canvas  */}
      <main className="ml-72 pt-24 px-margin-desktop pb-stack-lg">
      <div className="max-w-container-max mx-auto space-y-stack-lg">
      {/*  Banner & Status  */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter">
      <div className="space-y-2">
      <div className="flex items-center gap-3">
      <h1 className="text-headline-lg font-headline-lg text-on-surface">Ahmed Raza</h1>
      <span className="px-3 py-1 bg-[#E8F5E9] text-[#004A3B] rounded-full text-label-sm font-label-sm flex items-center gap-1">
      <span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
                                  Active consent - valid until 14 Jan 2027
                              </span>
      </div>
      <p className="text-body-lg text-on-surface-variant">Senior Software Engineer &amp; Freelancer</p>
      </div>
      <div className="bg-primary-container/10 border border-primary-container/20 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>info</span>
      <span className="text-label-md text-primary">Purpose limitation: Credit assessment only</span>
      </div>
      </div>
      {/*  Bento Grid Layout  */}
      <div className="grid grid-cols-12 gap-gutter">
      {/*  Primary Stats Bento  */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
      {/*  Income Card  */}
      <div className="bg-surface-container-lowest p-stack-lg rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-white hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
      <p className="text-label-md text-on-surface-variant">Avg. Monthly Income</p>
      <span className="material-symbols-outlined text-secondary">payments</span>
      </div>
      <div className="space-y-1">
      <h3 className="text-headline-md font-headline-md text-primary">PKR 198,000</h3>
      <p className="text-label-sm text-[#008080] flex items-center gap-1">
      <span className="material-symbols-outlined text-xs">trending_up</span>
                                      +12% from last quarter
                                  </p>
      </div>
      <div className="mt-6 h-24 relative">
      {/*  Simple Sparkline with SVG  */}
      <svg className="w-full h-full preserve-3d" viewBox="0 0 100 30">
      <path d="M0 25 Q 10 20, 20 22 T 40 15 T 60 18 T 80 5 T 100 8" fill="none" stroke="#008080" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
      <path d="M0 25 Q 10 20, 20 22 T 40 15 T 60 18 T 80 5 T 100 8 V 30 H 0 Z" fill="url(#gradient-income)" opacity="0.1"></path>
      <defs>
      <linearGradient id="gradient-income" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#008080"></stop>
      <stop offset="100%" stopColor="#008080" stopOpacity="0"></stop>
      </linearGradient>
      </defs>
      </svg>
      </div>
      </div>
      {/*  IVS Score Card  */}
      <div className="bg-surface-container-lowest p-stack-lg rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-white hover:shadow-lg transition-all relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
      <p className="text-label-md text-on-surface-variant">IVS Score (Verified)</p>
      <span className="material-symbols-outlined text-[#D4AF37]" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
      </div>
      <div className="flex items-end gap-2">
      <h3 className="text-headline-lg font-headline-lg text-primary">82</h3>
      <p className="text-label-md text-on-surface-variant mb-2">/100</p>
      </div>
      <div className="mt-4 flex gap-2">
      <span className="px-2 py-1 bg-[#E8F5E9] text-[#004A3B] rounded text-label-sm">High Consistency</span>
      <span className="px-2 py-1 bg-[#E8F5E9] text-[#004A3B] rounded text-label-sm">Healthy Diversity</span>
      </div>
      {/*  Decorative background element  */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl"></div>
      </div>
      {/*  Source Mix Visualization  */}
      <div className="col-span-1 md:col-span-2 bg-surface-container-lowest p-stack-lg rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-white">
      <h4 className="text-label-md text-on-surface-variant mb-6 uppercase tracking-wider">Income Source Distribution</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
      <div className="flex items-center gap-3">
      <div className="w-2 h-8 rounded bg-primary"></div>
      <div>
      <p className="text-label-sm text-on-surface-variant">Domestic Salary</p>
      <p className="text-body-md font-bold">PKR 145,000</p>
      </div>
      </div>
      <div className="flex items-center gap-3">
      <div className="w-2 h-8 rounded bg-secondary"></div>
      <div>
      <p className="text-label-sm text-on-surface-variant">Foreign Remittance</p>
      <p className="text-body-md font-bold">PKR 42,000</p>
      </div>
      </div>
      <div className="flex items-center gap-3">
      <div className="w-2 h-8 rounded bg-tertiary-container"></div>
      <div>
      <p className="text-label-sm text-on-surface-variant">Dividends/Other</p>
      <p className="text-body-md font-bold">PKR 11,000</p>
      </div>
      </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
      <div className="w-full h-24 bg-surface-container flex items-end gap-2 px-2 rounded-lg overflow-hidden">
      <div className="flex-1 bg-primary rounded-t" style={{"height":"75%"}}></div>
      <div className="flex-1 bg-secondary rounded-t" style={{"height":"45%"}}></div>
      <div className="flex-1 bg-tertiary-container rounded-t" style={{"height":"25%"}}></div>
      <div className="flex-1 bg-primary rounded-t" style={{"height":"85%"}}></div>
      <div className="flex-1 bg-secondary rounded-t" style={{"height":"60%"}}></div>
      <div className="flex-1 bg-tertiary-container rounded-t" style={{"height":"30%"}}></div>
      </div>
      </div>
      </div>
      </div>
      </div>
      {/*  Eligibility & Sidebar Bento  */}
      <div className="col-span-12 lg:col-span-4 space-y-gutter">
      {/*  Eligibility Card  */}
      <div className="bg-primary text-white p-stack-lg rounded-2xl shadow-xl relative overflow-hidden group">
      <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
      <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Demo only</span>
      <span className="material-symbols-outlined text-white/50">account_balance_wallet</span>
      </div>
      <p className="text-white/70 text-label-md mb-1">Illustrative Credit Limit</p>
      <h3 className="text-headline-md font-headline-md mb-4">PKR 150,000</h3>
      <button className="w-full py-3 bg-white text-primary rounded-xl font-bold text-label-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                                      Initiate Offer Review
                                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
      </div>
      {/*  Abstract glow effect  */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#008080] rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
      </div>
      {/*  Audit Log Card  */}
      <div className="bg-surface-container-lowest p-stack-lg rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-white">
      <h4 className="text-label-md text-on-surface-variant mb-4 font-bold">Activity Log</h4>
      <div className="space-y-4">
      <div className="flex gap-3">
      <div className="mt-1 w-2 h-2 rounded-full bg-[#008080]"></div>
      <div>
      <p className="text-body-sm text-on-surface">Profile viewed by UBL Lending Team</p>
      <p className="text-label-sm text-on-surface-variant">Today 10:42 AM</p>
      </div>
      </div>
      <div className="flex gap-3 opacity-60">
      <div className="mt-1 w-2 h-2 rounded-full bg-outline"></div>
      <div>
      <p className="text-body-sm text-on-surface">Income Refresh Triggered</p>
      <p className="text-label-sm text-on-surface-variant">Yesterday 04:15 PM</p>
      </div>
      </div>
      <div className="flex gap-3 opacity-60">
      <div className="mt-1 w-2 h-2 rounded-full bg-outline"></div>
      <div>
      <p className="text-body-sm text-on-surface">Consent Granted by Ahmed Raza</p>
      <p className="text-label-sm text-on-surface-variant">14 Jan 2024</p>
      </div>
      </div>
      </div>
      <button className="w-full mt-6 text-primary text-label-md font-bold hover:underline">View Full Audit Trail</button>
      </div>
      {/*  No Data Privacy Message  */}
      <div className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant/30 flex items-start gap-3">
      <span className="material-symbols-outlined text-outline text-xl">lock</span>
      <p className="text-label-sm text-on-surface-variant">Individual transaction details are encrypted and hidden as per user's data sharing preferences. Only aggregate metadata is visible for credit assessment.</p>
      </div>
      </div>
      </div>
      {/*  Detailed Visualizations Row  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      {/*  6-Month Trend  */}
      <div className="bg-surface-container-lowest p-stack-lg rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-white">
      <div className="flex justify-between items-center mb-8">
      <h4 className="text-headline-sm text-primary">6-Month Income Trend</h4>
      <select className="bg-surface border-none rounded-lg text-label-sm text-on-surface-variant focus:ring-0">
      <option>Last 6 Months</option>
      <option>Year to Date</option>
      </select>
      </div>
      <div className="h-64 flex items-end justify-between px-2 gap-4">
      {/*  Bar chart with custom values  */}
      <div className="group relative flex-1 flex flex-col items-center gap-2">
      <div className="w-full bg-primary-container/20 rounded-t-lg transition-all duration-300 group-hover:bg-primary-container/40" style={{"height":"70%"}}></div>
      <span className="text-label-sm text-on-surface-variant">Aug</span>
      </div>
      <div className="group relative flex-1 flex flex-col items-center gap-2">
      <div className="w-full bg-primary-container/20 rounded-t-lg transition-all duration-300 group-hover:bg-primary-container/40" style={{"height":"65%"}}></div>
      <span className="text-label-sm text-on-surface-variant">Sep</span>
      </div>
      <div className="group relative flex-1 flex flex-col items-center gap-2">
      <div className="w-full bg-primary-container/20 rounded-t-lg transition-all duration-300 group-hover:bg-primary-container/40" style={{"height":"85%"}}></div>
      <span className="text-label-sm text-on-surface-variant">Oct</span>
      </div>
      <div className="group relative flex-1 flex flex-col items-center gap-2">
      <div className="w-full bg-primary-container/20 rounded-t-lg transition-all duration-300 group-hover:bg-primary-container/40" style={{"height":"80%"}}></div>
      <span className="text-label-sm text-on-surface-variant">Nov</span>
      </div>
      <div className="group relative flex-1 flex flex-col items-center gap-2">
      <div className="w-full bg-primary-container/20 rounded-t-lg transition-all duration-300 group-hover:bg-primary-container/40" style={{"height":"90%"}}></div>
      <span className="text-label-sm text-on-surface-variant">Dec</span>
      </div>
      <div className="group relative flex-1 flex flex-col items-center gap-2">
      <div className="w-full bg-primary rounded-t-lg shadow-md" style={{"height":"100%"}}></div>
      <span className="text-label-sm text-primary font-bold">Jan</span>
      </div>
      </div>
      </div>
      {/*  Identity Verification & Metadata  */}
      <div className="bg-surface-container-lowest p-stack-lg rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-white flex flex-col">
      <h4 className="text-headline-sm text-primary mb-6">Verification Insights</h4>
      <div className="grid grid-cols-2 gap-gutter flex-1">
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
      <p className="text-label-sm text-on-surface-variant mb-1">Consistency</p>
      <div className="flex items-center gap-2">
      <span className="text-headline-sm text-primary">High</span>
      <span className="material-symbols-outlined text-[#008080]" style={{"fontVariationSettings":"'FILL' 1"}}>shield_lock</span>
      </div>
      <p className="text-[10px] text-on-surface-variant mt-2">Variability within ±4% over 24 months</p>
      </div>
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
      <p className="text-label-sm text-on-surface-variant mb-1">Risk Profile</p>
      <div className="flex items-center gap-2">
      <span className="text-headline-sm text-primary">Minimal</span>
      <span className="material-symbols-outlined text-[#D4AF37]" style={{"fontVariationSettings":"'FILL' 1"}}>verified_user</span>
      </div>
      <p className="text-[10px] text-on-surface-variant mt-2">No derogatory flags in shared vault</p>
      </div>
      <div className="col-span-2 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
      <div>
      <p className="text-label-sm text-on-surface-variant">Connected Accounts</p>
      <p className="text-body-md font-bold text-primary">HBL, Faisal Bank, Standard Chartered</p>
      </div>
      <div className="flex -space-x-2">
      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-container flex items-center justify-center text-[10px] text-white font-bold">H</div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] text-white font-bold">F</div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-container flex items-center justify-center text-[10px] text-white font-bold">S</div>
      </div>
      </div>
      </div>
      <div className="mt-6 flex justify-end">
      <button className="flex items-center gap-2 text-label-md text-primary font-bold">
                                  Generate Summary PDF
                                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
      </button>
      </div>
      </div>
      </div>
      </div>
      </main>
      {/*  Floating Action Button (Contextual)  */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
      <span className="material-symbols-outlined">chat_bubble</span>
      </button>
    </>
  );
}
