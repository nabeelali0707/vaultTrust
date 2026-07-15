"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  // TODO: POST verification profile data to the lending decision engine (/api/v1/lending/assess) for real-time application processing.

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
      {/*  SideNavBar Component (Enterprise Portal)  */}
      <aside className="h-screen w-72 fixed left-0 top-0 flex flex-col py-stack-lg bg-surface dark:bg-inverse-surface shadow-[0px_4px_20px_rgba(0,0,0,0.04)] z-50">
      <div className="px-6 mb-10 flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
      <span className="material-symbols-outlined text-white" style={{"fontVariationSettings":"'FILL' 1"}}>account_balance</span>
      </div>
      <div>
      <h1 className="text-headline-sm font-headline-sm font-extrabold text-primary dark:text-inverse-primary leading-none">UBL Digital</h1>
      <p className="text-label-sm font-label-sm text-on-surface-variant opacity-70 uppercase tracking-widest mt-1">Enterprise Portal</p>
      </div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
      <a className="flex items-center gap-4 py-3 px-4 transition-colors text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
      <span className="material-symbols-outlined" data-icon="group">group</span>
      <span className="text-label-md font-label-md">Applicant Profiles</span>
      </a>
      <a className="flex items-center gap-4 py-3 px-4 transition-colors text-primary dark:text-inverse-primary font-bold bg-secondary-container/20 rounded-lg mx-2" href="#">
      <span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
      <span className="text-label-md font-label-md">Shared Income Profiles</span>
      </a>
      <a className="flex items-center gap-4 py-3 px-4 transition-colors text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
      <span className="material-symbols-outlined" data-icon="fact_check">fact_check</span>
      <span className="text-label-md font-label-md">Consent Status</span>
      </a>
      <a className="flex items-center gap-4 py-3 px-4 transition-colors text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
      <span className="material-symbols-outlined" data-icon="history_edu">history_edu</span>
      <span className="text-label-md font-label-md">Audit Trail</span>
      </a>
      <a className="flex items-center gap-4 py-3 px-4 transition-colors text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
      <span className="material-symbols-outlined" data-icon="insights">insights</span>
      <span className="text-label-md font-label-md">Insights</span>
      </a>
      </nav>
      <div className="px-4 mt-auto pt-6 border-t border-surface-variant/50">
      <button className="w-full flex items-center gap-4 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 active:scale-95">
      <span className="material-symbols-outlined" data-icon="switch_account">switch_account</span>
      <span className="text-label-md font-label-md">Profile Switcher</span>
      </button>
      </div>
      </aside>
      {/*  Main Content Wrapper  */}
      <main className="ml-72 flex-1 h-screen overflow-y-auto relative">
      {/*  TopAppBar Component  */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-16 bg-surface-container-lowest dark:bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] sticky top-0 z-40">
      <div className="flex items-center gap-4">
      <h2 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed">Income Verification</h2>
      <div className="h-6 w-[1px] bg-outline-variant"></div>
      <div className="flex gap-2">
      <span className="text-label-sm font-label-sm text-secondary bg-secondary-container/20 px-3 py-1 rounded-full">Institutional Access</span>
      </div>
      </div>
      <div className="flex items-center gap-6">
      <div className="relative group">
      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-opacity active:opacity-80" data-icon="notifications">notifications</span>
      <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-opacity active:opacity-80" data-icon="verified">verified</span>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed cursor-pointer transition-transform active:scale-95">
      <img className="w-full h-full object-cover" data-alt="Close-up professional portrait of a high-ranking bank executive wearing a sharp dark suit against a minimalist architectural background. The image has soft, professional studio lighting with a neutral color palette of greys and deep greens, conveying authority, trust, and institutional reliability in a modern corporate setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQjQMgqipzs0f5OWdKbmSpqM2xsP7yILdqsbSV2hPeicM92R4nDzAchrNrXkeB47C8tgSNhQXFKtgAYb7lA1HJ0mqBucmtXXWsJWdRYq4HmuHD2oOWXy4klUdG2zwIqWvYo1AY1psaG50AewgTWEsbxE87BsNKjgNEjRcvqxn-agb_TLea-2K39e5zNCUWK6wxzpdWR2RTg-juYYrgfjP0qF_sTTOH-ZN2FgpngHrYUPB9dv71SE-I1A"/>
      </div>
      </div>
      </header>
      {/*  Content Canvas  */}
      <div className="p-stack-lg max-w-container-max mx-auto">
      {/*  KPI Section (Bento Style)  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div className="glass-card p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
      <div>
      <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Profiles Shared</p>
      <h3 className="text-headline-md font-headline-md mt-2">124</h3>
      </div>
      <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-label-sm">
      <span className="material-symbols-outlined text-[18px]">trending_up</span>
      <span>+12% this month</span>
      </div>
      </div>
      <div className="glass-card p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
      <div>
      <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Active Consents</p>
      <h3 className="text-headline-md font-headline-md mt-2 text-primary">98</h3>
      </div>
      <div className="mt-4 flex items-center gap-2 text-on-surface-variant opacity-60 text-label-sm">
      <span className="material-symbols-outlined text-[18px]">verified_user</span>
      <span>79% conversion rate</span>
      </div>
      </div>
      <div className="glass-card p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden relative">
      <div className="relative z-10">
      <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Avg IVS Score</p>
      <h3 className="text-headline-md font-headline-md mt-2 text-secondary">74</h3>
      </div>
      <div className="mt-4 flex items-center gap-2 text-label-sm">
      <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
      <div className="bg-secondary h-full rounded-full" style={{"width":"74%"}}></div>
      </div>
      </div>
      {/*  Subtle background decoration  */}
      <div className="absolute -right-4 -bottom-4 opacity-5 text-secondary">
      <span className="material-symbols-outlined text-8xl" style={{"fontVariationSettings":"'FILL' 1"}}>analytics</span>
      </div>
      </div>
      <div className="bg-error-container/20 p-6 rounded-2xl shadow-sm border border-error/10 flex flex-col justify-between">
      <div>
      <p className="text-label-md font-label-md text-error">Expiring Soon</p>
      <h3 className="text-headline-md font-headline-md mt-2 text-error">12</h3>
      </div>
      <button className="mt-4 text-error font-bold text-label-sm underline underline-offset-4 hover:opacity-80 transition-opacity">
                              Review expirations
                          </button>
      </div>
      </div>
      {/*  Filters and Search  */}
      <div className="flex flex-col md:flex-row items-center gap-gutter mb-stack-md">
      <div className="relative flex-1 w-full">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
      <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none" placeholder="Search applicant by name, ID or mobile..." type="text"/>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
      <div className="relative inline-block text-left w-full md:w-40">
      <select className="appearance-none w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-label-md font-label-md pr-10 focus:ring-2 focus:ring-secondary transition-all">
      <option>IVS Score</option>
      <option>&gt; 80 High</option>
      <option>50-80 Med</option>
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
      </div>
      <div className="relative inline-block text-left w-full md:w-40">
      <select className="appearance-none w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-label-md font-label-md pr-10 focus:ring-2 focus:ring-secondary transition-all">
      <option>Income Range</option>
      <option>&gt; 200k</option>
      <option>100k-200k</option>
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
      </div>
      <button className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md">
      <span className="material-symbols-outlined text-[20px]">filter_list</span>
      <span>Filters</span>
      </button>
      </div>
      </div>
      {/*  Main Data Table  */}
      <div className="glass-card rounded-2xl border border-outline-variant/30 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-surface-container-high/50 border-b border-outline-variant/20">
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant">Applicant</th>
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant">Verified Income</th>
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant">IVS Score</th>
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant">Trend</th>
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant">Status</th>
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant">Last Updated</th>
      <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant text-right">Action</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/10">
      {/*  Highlighted Row  */}
      <tr className="bg-primary-container/[0.03] hover:bg-primary-container/[0.06] transition-colors">
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center font-bold text-primary">AR</div>
      <div>
      <p className="text-body-md font-semibold text-on-surface">Ahmed Raza</p>
      <p className="text-label-sm text-on-surface-variant opacity-70">UBL-672901-PK</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex flex-col">
      <span className="text-body-md font-bold text-primary">PKR 198k</span>
      <span className="text-label-sm text-on-surface-variant">Monthly Avg.</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <div className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-body-sm">
                                                  82
                                              </div>
      <span className="text-label-sm text-secondary font-medium">Excellent</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-1 text-primary">
      <span className="material-symbols-outlined text-[20px]">trending_up</span>
      <span className="text-label-sm font-semibold">Growing</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-label-sm font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                              Active
                                          </span>
      </td>
      <td className="px-6 py-5 text-on-surface-variant text-body-sm">
                                          14 Oct 2023
                                      </td>
      <td className="px-6 py-5 text-right">
      <button className="px-4 py-2 bg-surface-container-lowest border border-primary text-primary font-bold text-label-md rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                                              View profile
                                          </button>
      </td>
      </tr>
      {/*  Standard Row 1  */}
      <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">ZK</div>
      <div>
      <p className="text-body-md font-semibold text-on-surface">Zoya Khan</p>
      <p className="text-label-sm text-on-surface-variant opacity-70">UBL-112908-PK</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex flex-col">
      <span className="text-body-md font-bold text-on-surface">PKR 145k</span>
      <span className="text-label-sm text-on-surface-variant">Monthly Avg.</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <div className="px-2.5 py-1 bg-surface-container-highest text-on-surface-variant rounded-lg font-bold text-body-sm">
                                                  68
                                              </div>
      <span className="text-label-sm text-on-surface-variant font-medium">Standard</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-1 text-on-surface-variant opacity-50">
      <span className="material-symbols-outlined text-[20px]">horizontal_rule</span>
      <span className="text-label-sm font-semibold">Stable</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-bold">
                                              Active
                                          </span>
      </td>
      <td className="px-6 py-5 text-on-surface-variant text-body-sm">
                                          12 Oct 2023
                                      </td>
      <td className="px-6 py-5 text-right">
      <button className="px-4 py-2 bg-surface-container-lowest border border-outline text-outline text-label-md rounded-lg hover:bg-surface-container-high transition-all active:scale-95">
                                              View profile
                                          </button>
      </td>
      </tr>
      {/*  Standard Row 2  */}
      <tr className="hover:bg-surface-container-low transition-colors opacity-75">
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">SI</div>
      <div>
      <p className="text-body-md font-semibold text-on-surface">Saad Iqbal</p>
      <p className="text-label-sm text-on-surface-variant opacity-70">UBL-882190-PK</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex flex-col">
      <span className="text-body-md font-bold text-on-surface">PKR 210k</span>
      <span className="text-label-sm text-on-surface-variant">Monthly Avg.</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <div className="px-2.5 py-1 bg-surface-container-highest text-on-surface-variant rounded-lg font-bold text-body-sm">
                                                  72
                                              </div>
      <span className="text-label-sm text-on-surface-variant font-medium">Good</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-1 text-error">
      <span className="material-symbols-outlined text-[20px]">trending_down</span>
      <span className="text-label-sm font-semibold">Declining</span>
      </div>
      </td>
      <td className="px-6 py-5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/40 text-on-error-container text-label-sm font-bold">
                                              Expiring
                                          </span>
      </td>
      <td className="px-6 py-5 text-on-surface-variant text-body-sm">
                                          09 Oct 2023
                                      </td>
      <td className="px-6 py-5 text-right">
      <button className="px-4 py-2 bg-surface-container-lowest border border-outline text-outline text-label-md rounded-lg hover:bg-surface-container-high transition-all active:scale-95">
                                              View profile
                                          </button>
      </td>
      </tr>
      </tbody>
      </table>
      </div>
      {/*  Pagination  */}
      <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/20 flex justify-between items-center">
      <p className="text-label-sm text-on-surface-variant font-medium">Showing 1 to 10 of 124 entries</p>
      <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-surface-container-high rounded-lg text-outline">
      <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-label-sm font-bold">1</button>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-label-sm">2</button>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-label-sm">3</button>
      <button className="p-2 hover:bg-surface-container-high rounded-lg text-outline">
      <span className="material-symbols-outlined">chevron_right</span>
      </button>
      </div>
      </div>
      </div>
      {/*  Detailed Analysis Section  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-stack-lg">
      <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-outline-variant/30">
      <div className="flex justify-between items-center mb-6">
      <h4 className="text-headline-sm font-headline-sm">Verification Volume Trend</h4>
      <div className="flex gap-2">
      <button className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm font-bold">30D</button>
      <button className="px-3 py-1 text-label-sm font-bold text-on-surface-variant opacity-60">90D</button>
      </div>
      </div>
      <div className="h-64 flex items-end justify-between gap-2">
      {/*  Chart Mockup  */}
      <div className="flex-1 bg-primary/10 rounded-t-lg h-[40%]" title="Day 1"></div>
      <div className="flex-1 bg-primary/20 rounded-t-lg h-[60%]" title="Day 2"></div>
      <div className="flex-1 bg-primary/40 rounded-t-lg h-[80%]" title="Day 3"></div>
      <div className="flex-1 bg-primary/30 rounded-t-lg h-[50%]" title="Day 4"></div>
      <div className="flex-1 bg-primary/60 rounded-t-lg h-[90%]" title="Day 5"></div>
      <div className="flex-1 bg-secondary rounded-t-lg h-[75%]" title="Day 6"></div>
      <div className="flex-1 bg-primary rounded-t-lg h-[100%]" title="Day 7"></div>
      </div>
      </div>
      <div className="glass-card p-6 rounded-2xl border border-outline-variant/30 flex flex-col">
      <h4 className="text-headline-sm font-headline-sm mb-4">Risk Distribution</h4>
      <div className="flex-1 flex flex-col justify-center space-y-4">
      <div className="space-y-1">
      <div className="flex justify-between text-label-sm font-bold">
      <span>High Trust (&gt;80)</span>
      <span>42%</span>
      </div>
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
      <div className="bg-primary h-full" style={{"width":"42%"}}></div>
      </div>
      </div>
      <div className="space-y-1">
      <div className="flex justify-between text-label-sm font-bold">
      <span>Medium Trust (50-80)</span>
      <span>48%</span>
      </div>
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
      <div className="bg-secondary h-full" style={{"width":"48%"}}></div>
      </div>
      </div>
      <div className="space-y-1">
      <div className="flex justify-between text-label-sm font-bold">
      <span>Low Trust (&lt;50)</span>
      <span>10%</span>
      </div>
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
      <div className="bg-error h-full" style={{"width":"10%"}}></div>
      </div>
      </div>
      </div>
      <div className="mt-6 pt-6 border-t border-outline-variant/20">
      <p className="text-label-sm text-on-surface-variant mb-4">Quick Insights:</p>
      <div className="flex items-center gap-3 p-3 bg-tertiary-container/10 rounded-xl border border-tertiary/20">
      <span className="material-symbols-outlined text-tertiary" style={{"fontVariationSettings":"'FILL' 1"}}>lightbulb</span>
      <p className="text-label-sm font-medium text-on-tertiary-container">Average IVS score increased by 4 points since last quarter.</p>
      </div>
      </div>
      </div>
      </div>
      </div>
      </main>
      {/*  Micro-interaction Scripts  */}
    </>
  );
}
