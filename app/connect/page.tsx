"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  // TODO: Trigger OAuth handshake flow with Upwork, Fiverr, or Payoneer and handle the redirect callback to link accounts.

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
      {/*  SideNavBar Shell  */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface dark:bg-inverse-surface shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col py-stack-lg z-50">
      <div className="px-6 mb-10">
      <h1 className="text-headline-md font-headline-md font-extrabold text-primary">VaultTrust</h1>
      <p className="text-label-sm text-on-surface-variant">Freelancer Portal</p>
      </div>
      <nav className="flex-1 space-y-1">
      <a className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container transition-colors group" href="#">
      <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">dashboard</span>
      <span className="text-label-md">Overview</span>
      </a>
      <a className="flex items-center px-6 py-3 text-primary font-bold border-r-4 border-primary bg-primary-container/10 transition-all duration-200" href="#">
      <span className="material-symbols-outlined mr-3 text-primary">account_balance</span>
      <span className="text-label-md">Connected Accounts</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container transition-colors group" href="#">
      <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">verified_user</span>
      <span className="text-label-md">Consent Center</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container transition-colors group" href="#">
      <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">payments</span>
      <span className="text-label-md">Income Profile</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container transition-colors group" href="#">
      <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">receipt_long</span>
      <span className="text-label-md">Activity & Audit Trail</span>
      </a>
      <a className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container transition-colors group" href="#">
      <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">settings</span>
      <span className="text-label-md">Settings</span>
      </a>
      </nav>
      <div className="px-4 mt-auto">
      <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
      <span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
                      View Active Consents
                  </button>
      </div>
      </aside>
      {/*  TopAppBar Shell  */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-16 ml-64 max-w-[calc(100%-16rem)] fixed top-0 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] z-40">
      <div className="flex items-center gap-4">
      <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Connected Accounts</h2>
      </div>
      <div className="flex items-center gap-4">
      <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant">
      <span className="material-symbols-outlined">notifications</span>
      </button>
      <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant">
      <span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
      </button>
      <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-primary-container overflow-hidden">
      <img className="w-full h-full object-cover" data-alt="A professional high-resolution headshot of a smiling freelancer in a bright modern home office. The lighting is warm and natural coming from a large window. The aesthetic is clean and institutional modern, with a soft-focus background of tech gadgets and books, emphasizing trust and professionalism in a light-mode corporate palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-9-rD2LSkhXLM3X1npe117GheEoafYDMs7tA10JT6IxH1s1rS6vqQS4ZAfpkoaq2ZhebZuc3x-cvIBYkbFOLcGHkIt93dAzs70jhsYyHuSh0rPn-ElfVmvECBUt01_N-nmUa6dngvRyEi4Ks5imSNMJSxgxrx4be0uxKzzMZD3yatW16CHJdHEY-dA3W5TwFbzgBNefmNhlCGuPfpKPjLxtNbWIQSJvE6aqPRHzLGoRK9pQXrNjBGBg"/>
      </div>
      </div>
      </header>
      {/*  Main Content Canvas  */}
      <main className="ml-64 pt-24 pb-stack-lg px-margin-desktop min-h-screen">
      <div className="max-w-container-max mx-auto">
      {/*  Header Section  */}
      <div className="mb-stack-lg">
      <h3 className="text-headline-lg font-headline-lg text-primary mb-2">Connect Income Sources</h3>
      <p className="text-body-lg text-on-surface-variant max-w-2xl">Aggregate your earnings to build a verifiable financial profile. Securely link your accounts to simplify loan and rental applications.</p>
      </div>
      {/*  Bento-style Grid for Source Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      {/*  Card: Payoneer (Connected)  */}
      <div className="md:col-span-8 glass-card rounded-[24px] p-stack-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 p-6">
      <span className="bg-[#E8F5E9] text-primary px-4 py-1 rounded-full text-label-md flex items-center gap-1 font-bold">
      <span className="material-symbols-outlined text-[18px]" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
                                  Connected
                              </span>
      </div>
      <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant">
      <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
      </div>
      <div>
      <h4 className="text-headline-sm font-headline-sm">Payoneer</h4>
      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Global Payments Account</p>
      </div>
      </div>
      <div className="grid grid-cols-2 gap-stack-lg mb-12">
      <div className="p-stack-md bg-surface-container-low rounded-xl">
      <p className="text-label-sm text-on-surface-variant mb-1">Last Synced</p>
      <p className="text-body-md font-bold text-on-surface">Today, 10:45 AM</p>
      </div>
      <div className="p-stack-md bg-surface-container-low rounded-xl">
      <p className="text-label-sm text-on-surface-variant mb-1">Total Transactions</p>
      <p className="text-body-md font-bold text-on-surface">24 Syncable Items</p>
      </div>
      </div>
      <div className="mt-auto flex justify-between items-center">
      <div className="flex -space-x-2">
      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed"></div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-fixed"></div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-fixed"></div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">+21</div>
      </div>
      <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-98 transition-all">
                                      Manage
                                      <span className="material-symbols-outlined text-[18px]">settings</span>
      </button>
      </div>
      </div>
      </div>
      {/*  Card: UBL Bank Account (Connected)  */}
      <div className="md:col-span-4 bg-white rounded-[24px] p-stack-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
      <div>
      <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-secondary-container/30 rounded-xl flex items-center justify-center">
      <span className="material-symbols-outlined text-secondary text-2xl">account_balance</span>
      </div>
      <span className="bg-[#E8F5E9] text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">Active</span>
      </div>
      <h4 className="text-headline-sm font-headline-sm mb-1">UBL Bank Account</h4>
      <p className="text-body-sm text-on-surface-variant mb-6">Savings Account ****9281</p>
      <div className="space-y-3 mb-8">
      <div className="flex justify-between text-label-sm">
      <span className="text-on-surface-variant">Transactions</span>
      <span className="font-bold">18 records</span>
      </div>
      <div className="flex justify-between text-label-sm">
      <span className="text-on-surface-variant">Last activity</span>
      <span className="font-bold">2 hours ago</span>
      </div>
      </div>
      </div>
      <button className="w-full py-3 border-2 border-secondary text-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary hover:text-on-secondary transition-all active:scale-95">
                              Sync now
                              <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500">sync</span>
      </button>
      </div>
      {/*  Card: Local Invoicing (Connect New)  */}
      <div className="md:col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[24px] p-stack-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-2 border-dashed border-outline-variant flex items-center gap-stack-lg group hover:border-primary/50 transition-colors cursor-pointer">
      <div className="w-20 h-20 bg-surface-container flex-shrink-0 rounded-2xl flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
      <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">cloud_upload</span>
      </div>
      <div className="flex-1">
      <h4 className="text-headline-sm font-headline-sm mb-1">Local Invoicing</h4>
      <p className="text-body-md text-on-surface-variant mb-4">Upload PDF invoices or link local billing software to include non-platform earnings.</p>
      <button className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-bold flex items-center gap-2">
                                  Connect source
                                  <span className="material-symbols-outlined">add</span>
      </button>
      </div>
      </div>
      {/*  Secure Data Notice  */}
      <div className="md:col-span-12 lg:col-span-6 bg-primary-container text-on-primary-container p-stack-lg rounded-[24px] flex items-center gap-6 relative overflow-hidden">
      {/*  Subtle pattern overlay  */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{"backgroundImage":"radial-gradient(#ffffff 1px, transparent 1px)","backgroundSize":"20px 20px"}}></div>
      <div className="w-16 h-16 bg-on-primary-container/10 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>shield_lock</span>
      </div>
      <div>
      <p className="text-label-md font-bold mb-1 flex items-center gap-2">
                                  Data Stewardship
                                  <span className="material-symbols-outlined text-[14px]" style={{"color":"#D4AF37"}}>verified</span>
      </p>
      <p className="text-body-md leading-relaxed">
                                  VaultTrust processes your data securely and only shares the summary you approve. Your raw bank credentials are never stored or shared with third parties.
                              </p>
      </div>
      </div>
      </div>
      {/*  Primary Action Footer  */}
      <div className="mt-stack-lg flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-[24px] shadow-[0px_4px_32px_rgba(0,74,59,0.08)] border border-primary-container/10">
      <div className="mb-4 md:mb-0">
      <p className="text-headline-sm font-headline-sm text-primary">Summary Ready</p>
      <p className="text-body-sm text-on-surface-variant">2 sources connected • 42 total transactions analyzed</p>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
      <button className="flex-1 md:flex-initial px-8 py-4 border-2 border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all">
                              Save Draft
                          </button>
      <button className="flex-1 md:flex-initial px-10 py-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 transition-all">
                              Continue to Consent Setup
                              <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      </div>
      </div>
      {/*  Spacer for visual breathing room  */}
      <div className="h-16"></div>
      </div>
      </main>
      {/*  Interactive background element for "Glassmorphism" effect depth  */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      <style>{`
              @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
              }
          `}</style>
    </>
  );
}
