"use client";

import React, { useState } from "react";
import Link from "next/link";
import FreelancerSidebar from "@/components/FreelancerSidebar";

export default function Page() {
  // TODO: Fetch immutable blockchain/database-anchored audit trail logs (/api/v1/audit/ledger) to verify digital proof.

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
      {/*  Predicted Component: SideNavBar  */}
      
      <FreelancerSidebar />

      {/*  Predicted Component: TopAppBar  */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-16 ml-64 max-w-[calc(100%-16rem)] bg-surface-container-lowest dark:bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] fixed top-0 z-40">
      <div className="flex items-center gap-4">
      <span className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed">Audit Ledger</span>
      <div className="flex items-center gap-2 bg-mint/10 px-3 py-1 rounded-full border border-primary/10">
      <span className="material-symbols-outlined text-primary text-[16px]" data-icon="verified" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
      <span className="text-[12px] font-bold text-primary uppercase tracking-wider">Ledger integrity verified</span>
      </div>
      </div>
      <div className="flex items-center gap-4">
      <button className="hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-full p-2 transition-opacity active:opacity-80">
      <span className="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
      </button>
      <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
      <img className="w-full h-full object-cover" data-alt="A professional headshot of a young freelancer with a clean, modern aesthetic. Soft studio lighting illuminates the subject against a neutral, high-key background. The overall style is institutional yet approachable, featuring high-quality portrait photography with a slight corporate polish." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVC4906PfUvLry-CHSmbAQ4FknjQr-ltLUB4bgKqLlwUHtJs1ZrgbdO3p0D0gSUtIuwDZ6701rY_5nyLwAUNev_DiPyzxHCarusIrfjXRAdIBSAlThFMDBdTtFgt0e2HEG95lFWvh2ANMKOGskIn3-RSIrs1hNI3QOP4RRl1GIBCPuOtKGyQqrH4wk-1sMmIMo9zVNtQONyyRmEJHepS_P5KUhb3nfPGVQ-fE0k7h5u68yANg7c4H9-w"/>
      </div>
      </div>
      </header>
      {/*  Main Content Canvas  */}
      <main className="ml-64 mt-16 p-stack-lg min-h-screen flex gap-stack-lg">
      {/*  Audit Timeline & Table Section  */}
      <div className="flex-grow space-y-6">
      <div className="glass-card rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-white/50">
      <div>
      <h2 className="text-headline-sm font-headline-sm text-primary">Immutable Activity Log</h2>
      <p className="text-body-sm text-on-surface-variant">Real-time tracking of all data access and account mutations.</p>
      </div>
      <div className="flex gap-2">
      <button className="flex items-center gap-2 px-4 py-2 border border-outline rounded-xl text-label-md hover:bg-surface-container transition-all">
      <span className="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span>
                                  Filter
                              </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-label-md hover:shadow-lg transition-all">
      <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
                                  Export Report
                              </button>
      </div>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-surface-container-low text-on-surface-variant">
      <th className="px-8 py-4 font-label-md text-label-sm uppercase tracking-wider">Date &amp; Time</th>
      <th className="px-6 py-4 font-label-md text-label-sm uppercase tracking-wider">Event</th>
      <th className="px-6 py-4 font-label-md text-label-sm uppercase tracking-wider">Actor</th>
      <th className="px-6 py-4 font-label-md text-label-sm uppercase tracking-wider">Consent ID</th>
      <th className="px-6 py-4 font-label-md text-label-sm uppercase tracking-wider">Hash Ref</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-surface-container text-on-surface">
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group active-row" onClick={() => { openDetail('EVT-9921') }}>
      <td className="px-8 py-5">
      <div className="font-bold text-body-sm">Oct 24, 2023</div>
      <div className="text-[12px] opacity-60">14:22:10 UTC</div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-secondary"></span>
      <span className="font-medium text-body-sm">Payoneer Connected</span>
      </div>
      </td>
      <td className="px-6 py-5 text-body-sm">System Auth</td>
      <td className="px-6 py-5 text-body-sm font-mono text-secondary">#CNST-88122</td>
      <td className="px-6 py-5">
      <span className="text-[12px] font-mono bg-surface-container px-2 py-1 rounded opacity-70">8a3f...d29e</span>
      </td>
      </tr>
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group" onClick={() => { openDetail('EVT-9922') }}>
      <td className="px-8 py-5">
      <div className="font-bold text-body-sm">Oct 24, 2023</div>
      <div className="text-[12px] opacity-60">11:05:44 UTC</div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-primary-container"></span>
      <span className="font-medium text-body-sm">Consent Granted</span>
      </div>
      </td>
      <td className="px-6 py-5 text-body-sm">Alex Rivera</td>
      <td className="px-6 py-5 text-body-sm font-mono text-secondary">#CNST-88123</td>
      <td className="px-6 py-5">
      <span className="text-[12px] font-mono bg-surface-container px-2 py-1 rounded opacity-70">991c...bb31</span>
      </td>
      </tr>
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group" onClick={() => { openDetail('EVT-9923') }}>
      <td className="px-8 py-5">
      <div className="font-bold text-body-sm">Oct 23, 2023</div>
      <div className="text-[12px] opacity-60">09:12:01 UTC</div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
      <span className="font-medium text-body-sm">Profile Metadata Updated</span>
      </div>
      </td>
      <td className="px-6 py-5 text-body-sm">Alex Rivera</td>
      <td className="px-6 py-5 text-body-sm font-mono text-secondary">---</td>
      <td className="px-6 py-5">
      <span className="text-[12px] font-mono bg-surface-container px-2 py-1 rounded opacity-70">4f22...aa10</span>
      </td>
      </tr>
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group" onClick={() => { openDetail('EVT-9924') }}>
      <td className="px-8 py-5">
      <div className="font-bold text-body-sm">Oct 22, 2023</div>
      <div className="text-[12px] opacity-60">18:45:12 UTC</div>
      </td>
      <td className="px-6 py-5">
      <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-error"></span>
      <span className="font-medium text-body-sm">Consent Revoked</span>
      </div>
      </td>
      <td className="px-6 py-5 text-body-sm">Alex Rivera</td>
      <td className="px-6 py-5 text-body-sm font-mono text-secondary">#CNST-77001</td>
      <td className="px-6 py-5">
      <span className="text-[12px] font-mono bg-surface-container px-2 py-1 rounded opacity-70">cd88...ff42</span>
      </td>
      </tr>
      </tbody>
      </table>
      </div>
      </div>
      <footer className="flex items-center gap-4 p-6 bg-surface-container-low rounded-[20px] border border-outline-variant/30">
      <div className="p-3 bg-white rounded-xl shadow-sm">
      <span className="material-symbols-outlined text-secondary" data-icon="lock" style={{"fontVariationSettings":"'FILL' 1"}}>lock</span>
      </div>
      <p className="text-body-sm text-on-surface-variant font-medium">
                          Cryptographically linked events for tamper-evident security. Every entry in this ledger is hashed and chained to the previous block, ensuring total historical integrity.
                      </p>
      </footer>
      </div>
      {/*  Detail Drawer (Static Layout Representation)  */}
      <aside className="w-96 flex-shrink-0">
      <div className="glass-card rounded-[24px] shadow-[0px_12px_32px_rgba(0,74,59,0.08)] sticky top-24 overflow-hidden border border-primary/10">
      <div className="bg-primary-container p-6 text-white">
      <div className="flex items-center justify-between mb-4">
      <span className="text-label-sm uppercase tracking-widest opacity-80">Block Detail</span>
      <span className="material-symbols-outlined text-[20px] cursor-pointer hover:rotate-90 transition-transform" data-icon="close">close</span>
      </div>
      <h3 className="text-headline-sm font-headline-sm">Event #EVT-9921</h3>
      <p className="text-body-sm opacity-90 mt-1">Payoneer Connected</p>
      </div>
      <div className="p-6 space-y-6">
      <div>
      <label className="text-label-sm font-label-md text-on-surface-variant block mb-2">Cryptographic Proof</label>
      <div className="space-y-3">
      <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Previous Hash</span>
      <p className="text-[12px] font-mono break-all text-secondary">0000x8a3f92b11e2d29e771c4b8e1f0a32d</p>
      </div>
      <div className="bg-surface-container-low p-3 rounded-xl border border-secondary/20">
      <span className="text-[10px] font-bold text-secondary uppercase block mb-1">Current Hash</span>
      <p className="text-[12px] font-mono break-all text-primary font-bold">0000x991c42f0b7a81c11bb31d9e2a22f31</p>
      </div>
      </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
      <div>
      <label className="text-label-sm font-label-md text-on-surface-variant block mb-1">Timestamp</label>
      <p className="text-body-sm font-bold">2023-10-24 14:22:10</p>
      </div>
      <div>
      <label className="text-label-sm font-label-md text-on-surface-variant block mb-1">Node ID</label>
      <p className="text-body-sm font-bold">VAULT-NODE-04</p>
      </div>
      </div>
      <div>
      <label className="text-label-sm font-label-md text-on-surface-variant block mb-2">Payload Summary</label>
      <div className="bg-inverse-surface text-white/90 p-4 rounded-xl text-[12px] font-mono leading-relaxed">
                                  {"{"}<br/>
                                    "action": "OAUTH_LINK",<br/>
                                    "provider": "Payoneer",<br/>
                                    "scopes": ["balance.read", "trans.list"],<br/>
                                    "security_level": "TLS_1.3",<br/>
                                    "id_verified": true<br/>
                                  {"}"}
                              </div>
      </div>
      <button className="w-full py-4 border-2 border-primary text-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
      <span className="material-symbols-outlined" data-icon="description">description</span>
                              Verify Chain Integrity
                          </button>
      </div>
      </div>
      {/*  Atmosphere Element: Visual confirmation of security  */}
      <div className="mt-6 glass-card p-6 rounded-[24px] border border-outline-variant/30 relative overflow-hidden">
      
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
      <span className="material-symbols-outlined text-on-tertiary-container" data-icon="security" style={{"fontVariationSettings":"'FILL' 1"}}>security</span>
      </div>
      <h4 className="font-bold text-body-md">Audit Score: 100/100</h4>
      </div>
      <p className="text-[13px] text-on-surface-variant leading-relaxed">
                              No unauthorized modifications detected in the last 365 days. All events match the global consensus hash.
                          </p>
      </div>
      </div>
      </aside>
      </main>
    </>
  );
}
