"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  // TODO: Fetch live income streams and transactions from platform connectors (/api/v1/connectors/summary) to display real data.

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
      {/*  SideNavBar Component  */}
      <nav className="h-screen w-64 fixed left-0 top-0 bg-surface dark:bg-inverse-surface shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col py-stack-lg z-50">
      <div className="px-6 mb-10">
      <h1 className="text-headline-md font-headline-md font-extrabold text-primary dark:text-inverse-primary">VaultTrust</h1>
      <p className="text-label-sm font-label-sm text-on-surface-variant opacity-70">Freelancer Portal</p>
      </div>
      <div className="flex-1 space-y-2 px-2">
      {/*  Active Tab: Overview  */}
      <a className="flex items-center gap-3 px-4 py-3 text-primary dark:text-inverse-primary font-bold border-r-4 border-primary dark:border-inverse-primary bg-primary-container/10 transition-all duration-200 active:scale-[0.98]" href="#">
      <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
      <span className="text-label-md font-label-md">Overview</span>
      </a>
      <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors rounded-lg mx-2 group" href="#">
      <span className="material-symbols-outlined" data-icon="account_balance">account_balance</span>
      <span className="text-label-md font-label-md">Connected Accounts</span>
      </a>
      <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors rounded-lg mx-2 group" href="#">
      <span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
      <span className="text-label-md font-label-md">Consent Center</span>
      </a>
      <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors rounded-lg mx-2 group" href="#">
      <span className="material-symbols-outlined" data-icon="payments">payments</span>
      <span className="text-label-md font-label-md">Income Profile</span>
      </a>
      <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors rounded-lg mx-2 group" href="#">
      <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
      <span className="text-label-md font-label-md">Activity & Audit Trail</span>
      </a>
      <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors rounded-lg mx-2 group" href="#">
      <span className="material-symbols-outlined" data-icon="settings">settings</span>
      <span className="text-label-md font-label-md">Settings</span>
      </a>
      </div>
      <div className="px-4 mt-auto">
      <button className="w-full bg-primary-container text-on-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:shadow-lg transition-all active:scale-95">
      <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
      <span className="text-label-sm">View Active Consents</span>
      </button>
      </div>
      </nav>
      {/*  TopAppBar Component  */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-16 ml-64 max-w-[calc(100%-16rem)] fixed top-0 bg-surface-container-lowest dark:bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] z-40">
      <div className="flex items-center gap-4">
      <span className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed">VaultTrust</span>
      </div>
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
      <button className="relative hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-full p-2 transition-opacity active:opacity-80">
      <span className="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
      <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <button className="hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-full p-2 transition-opacity active:opacity-80">
      <span className="material-symbols-outlined text-on-surface-variant" data-icon="verified">verified</span>
      </button>
      </div>
      <div className="h-8 w-[1px] bg-outline-variant"></div>
      <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
      <p className="text-label-md font-label-md text-on-surface">Ahmed Khan</p>
      <p className="text-label-sm font-label-sm text-on-surface-variant">Top-Rated Freelancer</p>
      </div>
      <img className="w-10 h-10 rounded-full border-2 border-primary-fixed-dim object-cover" data-alt="A professional headshot of a young South Asian male freelancer, smiling warmly, wearing a crisp navy blazer over a white shirt, against a soft-focus minimalist office background with institutional modernism lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ldjxntAmT-euIz_rJIZk-7m15v3MXxWPH1LSAwOUCA5Xl9C9jsCLaWyAXDOGoAV4u5XJKY0dRWr93oBbcuiumaQBngqXLtLAegN-aROuqPTAEvN6htJf6RdTFcU1zLi3AAF9HiKkJBBkYlKSZyvwmE6qe4ZMgJMuQskWsY8nRTydFJRI2IpQcnAoBGqKGb0ZjvHpfXtBmozh4KqxXpWhB42Sd0Vvwj5BztenhTEsfb9TmSfubVyCwA"/>
      </div>
      </div>
      </header>
      {/*  Main Content Canvas  */}
      <main className="ml-64 mt-16 p-stack-lg min-h-screen">
      <div className="max-w-container-max mx-auto space-y-8">
      {/*  Welcome Header  */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
      <h2 className="text-headline-lg font-headline-lg text-primary">Good morning, Ahmed</h2>
      <p className="text-body-lg text-on-surface-variant">Here is your verified financial health and consent status for today.</p>
      </div>
      <div className="flex gap-3">
      <button className="flex items-center gap-2 px-6 py-3 border border-outline text-primary rounded-full font-bold hover:bg-surface-container transition-all">
      <span className="material-symbols-outlined" data-icon="download">download</span>
                              Export Statement
                          </button>
      <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:shadow-xl transition-all">
      <span className="material-symbols-outlined" data-icon="share">share</span>
                              Share Profile
                          </button>
      </div>
      </section>
      {/*  KPI Bento Grid  */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/*  KPI 1  */}
      <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
      <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary-fixed rounded-xl text-primary">
      <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
      </div>
      <span className="text-primary font-bold text-label-sm flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>
                                  +12%
                              </span>
      </div>
      <div>
      <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Verified Monthly Income</p>
      <h3 className="text-headline-md font-headline-md mt-1">PKR 198,000</h3>
      </div>
      </div>
      {/*  KPI 2  */}
      <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
      <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-secondary-fixed rounded-xl text-secondary">
      <span className="material-symbols-outlined" data-icon="verified">verified</span>
      </div>
      <div className="bg-primary-container/10 px-3 py-1 rounded-full">
      <span className="text-primary font-bold text-label-sm">Growing</span>
      </div>
      </div>
      <div>
      <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Verification Score</p>
      <div className="flex items-end gap-2 mt-1">
      <h3 className="text-headline-md font-headline-md">82</h3>
      <span className="text-body-sm text-on-surface-variant mb-1.5">/ 100</span>
      </div>
      </div>
      </div>
      {/*  KPI 3  */}
      <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between hover:translate-y-[-4px] transition-transform relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-tertiary-fixed rounded-xl text-tertiary">
      <span className="material-symbols-outlined" data-icon="lock_clock">lock_clock</span>
      </div>
      </div>
      <div>
      <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Active Consent</p>
      <h3 className="text-headline-sm font-headline-sm mt-1">UBL Bank</h3>
      <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
      <div className="w-[60%] h-full bg-tertiary-container"></div>
      </div>
      <span className="text-label-sm font-label-sm">174 days left</span>
      </div>
      </div>
      </div>
      {/*  KPI 4 (Asymmetric Profile Card)  */}
      <div className="bg-primary-container text-on-primary p-6 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
      <p className="text-label-md text-on-primary-container uppercase tracking-wider">Financial Posture</p>
      <div className="space-y-3 mt-4">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary-fixed" data-icon="check_circle">check_circle</span>
      <span className="text-body-sm">Stable income</span>
      </div>
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary-fixed" data-icon="check_circle">check_circle</span>
      <span className="text-body-sm">Strong diversity</span>
      </div>
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary-fixed" data-icon="check_circle">check_circle</span>
      <span className="text-body-sm">Low client concentration</span>
      </div>
      </div>
      </div>
      </section>
      {/*  Analytics Section  */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/*  Stacked Bar Chart Card  */}
      <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-8">
      <div>
      <h4 className="text-headline-sm font-headline-sm text-primary">Income Stream Analysis</h4>
      <p className="text-body-sm text-on-surface-variant">Last 6 months comparison</p>
      </div>
      <div className="flex items-center gap-4 text-label-sm">
      <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary"></span> Payoneer</div>
      <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary"></span> Direct Bank</div>
      <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tertiary"></span> Invoices</div>
      </div>
      </div>
      <div className="h-64 flex items-end justify-between gap-4 group">
      {/*  Bar Feb  */}
      <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full flex flex-col-reverse gap-0.5 h-full max-h-[160px]">
      <div className="h-[60%] bg-primary rounded-sm hover:opacity-80 transition-all cursor-pointer" title="Payoneer"></div>
      <div className="h-[25%] bg-secondary rounded-sm hover:opacity-80 transition-all cursor-pointer" title="Bank"></div>
      <div className="h-[15%] bg-tertiary rounded-sm hover:opacity-80 transition-all cursor-pointer" title="Invoices"></div>
      </div>
      <span className="text-label-sm text-on-surface-variant">Feb</span>
      </div>
      {/*  Bar Mar  */}
      <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full flex flex-col-reverse gap-0.5 h-full max-h-[180px]">
      <div className="h-[55%] bg-primary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[30%] bg-secondary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[15%] bg-tertiary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      </div>
      <span className="text-label-sm text-on-surface-variant">Mar</span>
      </div>
      {/*  Bar Apr  */}
      <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full flex flex-col-reverse gap-0.5 h-full max-h-[200px]">
      <div className="h-[65%] bg-primary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[20%] bg-secondary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[15%] bg-tertiary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      </div>
      <span className="text-label-sm text-on-surface-variant">Apr</span>
      </div>
      {/*  Bar May  */}
      <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full flex flex-col-reverse gap-0.5 h-full max-h-[190px]">
      <div className="h-[50%] bg-primary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[35%] bg-secondary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[15%] bg-tertiary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      </div>
      <span className="text-label-sm text-on-surface-variant">May</span>
      </div>
      {/*  Bar Jun  */}
      <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full flex flex-col-reverse gap-0.5 h-full max-h-[220px]">
      <div className="h-[70%] bg-primary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[20%] bg-secondary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      <div className="h-[10%] bg-tertiary rounded-sm hover:opacity-80 transition-all cursor-pointer"></div>
      </div>
      <span className="text-label-sm text-on-surface-variant">Jun</span>
      </div>
      {/*  Bar Jul (Current)  */}
      <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full flex flex-col-reverse gap-0.5 h-full max-h-[240px]">
      <div className="h-[60%] bg-primary rounded-t-lg hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20"></div>
      <div className="h-[30%] bg-secondary rounded-sm hover:brightness-110 transition-all cursor-pointer"></div>
      <div className="h-[10%] bg-tertiary rounded-sm hover:brightness-110 transition-all cursor-pointer"></div>
      </div>
      <span className="text-label-md font-bold text-primary">Jul</span>
      </div>
      </div>
      </div>
      {/*  Source Doughnut Card  */}
      <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col">
      <h4 className="text-headline-sm font-headline-sm text-primary mb-2">Source Mix</h4>
      <p className="text-body-sm text-on-surface-variant mb-6">Revenue distribution by channel</p>
      <div className="relative flex-1 flex items-center justify-center">
      {/*  Custom SVG Doughnut  */}
      <svg className="w-48 h-48 transform -rotate-90">
      <circle cx="96" cy="96" fill="transparent" r="80" stroke="#ebeef3" strokeWidth="18"></circle>
      <circle className="transition-all duration-1000" cx="96" cy="96" fill="transparent" r="80" stroke="#003127" strokeDasharray="502" strokeDashoffset="150" strokeWidth="18"></circle>
      <circle className="transition-all duration-1000" cx="96" cy="96" fill="transparent" r="80" stroke="#006a6a" strokeDasharray="502" strokeDashoffset="400" strokeWidth="18"></circle>
      <circle className="transition-all duration-1000" cx="96" cy="96" fill="transparent" r="80" stroke="#735c00" strokeDasharray="502" strokeDashoffset="480" strokeWidth="18"></circle>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span className="text-headline-md font-headline-md">3</span>
      <span className="text-label-sm text-on-surface-variant uppercase">Major Channels</span>
      </div>
      </div>
      <div className="mt-8 space-y-3">
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-body-sm">Global Marketplace</span></div>
      <span className="text-label-md font-bold">62%</span>
      </div>
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span><span className="text-body-sm">Enterprise Direct</span></div>
      <span className="text-label-md font-bold">28%</span>
      </div>
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span><span className="text-body-sm">Local Retainers</span></div>
      <span className="text-label-md font-bold">10%</span>
      </div>
      </div>
      </div>
      </section>
      {/*  Activity & Ledger Section  */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/*  Activity Feed  */}
      <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-6">
      <h4 className="text-headline-sm font-headline-sm text-primary">Recent Activity</h4>
      <button className="text-primary text-label-md font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-6">
      <div className="flex gap-4">
      <div className="mt-1 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]" data-icon="link">link</span>
      </div>
      <div>
      <p className="text-body-md font-bold">Account connected</p>
      <p className="text-body-sm text-on-surface-variant">Payoneer account ****4291 successfully synced via secure API.</p>
      <p className="text-label-sm text-outline mt-1">2 hours ago</p>
      </div>
      </div>
      <div className="flex gap-4">
      <div className="mt-1 w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]" data-icon="task_alt">task_alt</span>
      </div>
      <div>
      <p className="text-body-md font-bold">Consent granted</p>
      <p className="text-body-sm text-on-surface-variant">Income verification access provided to UBL Digital Mortgage Department.</p>
      <p className="text-label-sm text-outline mt-1">Yesterday, 4:15 PM</p>
      </div>
      </div>
      <div className="flex gap-4">
      <div className="mt-1 w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]" data-icon="history_edu">history_edu</span>
      </div>
      <div>
      <p className="text-body-md font-bold">Ledger reference generated</p>
      <p className="text-body-sm text-on-surface-variant">Hash <span className="font-mono text-[12px] bg-surface p-0.5 rounded">0x88...f2a9</span> committed for Q3 income proof.</p>
      <p className="text-label-sm text-outline mt-1">July 18, 2023</p>
      </div>
      </div>
      </div>
      </div>
      {/*  Ledger & Verification CTA  */}
      <div className="relative rounded-[24px] overflow-hidden group cursor-pointer shadow-lg">
      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" data-alt="A sophisticated abstract technological background with subtle data pathways and node connections in deep forest green and teal, with a professional corporate lighting aesthetic." style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuBlyCOLiJx0135hSdM1T7hYQDi1OqudzRn0XxBJ-tNp03Cavhge5YUWDXe_ARlvg8PwVuIZEdVczU5rG7ha8qKxjbPF6LrFJjDpiEWGHpK9G-998ue294BXat6KOmW0VaCMVJSsXQTxBYlxPut1HwWnOF2Gx0iUlzMk461RMp1Vc7Q2b_M1DtvLXEBu9BXRRKqPVX4fAgtz0gJ81FrfYr_-SGLNBFllFZpSObvDddVi2a1EkJarPmLnTg')"}}></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent"></div>
      <div className="relative h-full p-10 flex flex-col justify-end text-on-primary">
      <span className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
      <span className="material-symbols-outlined text-white" data-icon="shield_with_heart">shield_with_heart</span>
      </span>
      <h4 className="text-headline-md font-headline-md mb-2">Institutional-Grade Identity</h4>
      <p className="text-body-lg text-primary-fixed mb-8 max-w-md">Your income profile is protected by multi-signature ledger technology and bank-grade encryption.</p>
      <div className="flex">
      <button className="bg-white text-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-primary-fixed transition-colors">
                                      View full income profile
                                      <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
      </button>
      </div>
      </div>
      </div>
      </section>
      </div>
      </main>
      {/*  Micro-interaction Scripts  */}
    </>
  );
}
