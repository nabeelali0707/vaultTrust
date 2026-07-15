"use client";

import React, { useState } from "react";
import Link from "next/link";
import FreelancerSidebar from "@/components/FreelancerSidebar";

export default function Page() {
  // TODO: Fetch details of the currently active consent policy and platform connection status.

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
      {/*  Success Confetti Canvas  */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" id="confetti-container"></div>
      {/*  Layout Shell  */}
      <div className="flex h-screen overflow-hidden">
      {/*  Sidebar Navigation (SideNavBar)  */}
      
      <FreelancerSidebar />

      {/*  Main Content Canvas  */}
      <main className="ml-64 flex-1 overflow-y-auto bg-surface relative">
      {/*  TopAppBar  */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-16 bg-surface-container-lowest shadow-sm sticky top-0 z-30">
      <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Success Status</h2>
      <div className="flex items-center gap-4">
      <button className="hover:bg-surface-container-high rounded-full p-2 transition-colors">
      <span className="material-symbols-outlined text-primary">notifications</span>
      </button>
      <button className="hover:bg-surface-container-high rounded-full p-2 transition-colors">
      <span className="material-symbols-outlined text-primary">verified</span>
      </button>
      <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
      <img className="w-full h-full object-cover" data-alt="A professional headshot of a smiling freelancer in their mid-30s, looking confidently at the camera against a clean, softly lit office background. The lighting is bright and modern, adhering to an institutional modernism aesthetic with high clarity and cool neutral tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm4iLZ61u5ClwnXmFmZ1A-ndG5f7-7WkCKyv9sqKxcvQGDGn2DvNYI27YNP7tSN0isplD_PxYgZu7pK5ekqLYS2nWJhl4bt5li8GgJo1px1rhQusL1kZKlbPfdNMI4Ymk9H_xqk5zgJ2bUPJCttad8tzYPgNtgOl6SaTpDZgoAct3Sa8gnrgjhWehx9v8QiHPZfSkCG1QXU_iQaL5AoGw8uoZ3vxQ09r7hgxKoyIZNSrwtvZ0jhTBJlA"/>
      </div>
      </div>
      </header>
      <div className="max-w-4xl mx-auto py-16 px-gutter flex flex-col items-center text-center">
      {/*  Success Header  */}
      <div className="relative mb-10">
      <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center shadow-lg relative z-10 animate-bounce-slow">
      <span className="material-symbols-outlined text-white text-5xl" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
      </div>
      {/*  Decorative Rings  */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary-container/20 rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-primary-container/10 rounded-full"></div>
      </div>
      <h3 className="text-headline-lg font-headline-lg text-primary mb-2">Your consent is active.</h3>
      <p className="text-body-lg text-on-surface-variant max-w-lg mb-12">Data access has been successfully established and recorded on the secure ledger.</p>
      {/*  Bento-style Details Grid  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-12">
      {/*  Consent ID  */}
      <div className="md:col-span-1 bg-surface-container-lowest p-6 rounded-card shadow-sm border border-outline-variant/30 flex flex-col items-start justify-between">
      <span className="text-label-sm font-label-sm text-on-surface-variant mb-2">Consent ID</span>
      <span className="text-headline-sm font-headline-sm text-primary">VT-7721</span>
      </div>
      {/*  Purpose  */}
      <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-card shadow-sm border border-outline-variant/30 flex flex-col items-start">
      <span className="text-label-sm font-label-sm text-on-surface-variant mb-2">Purpose</span>
      <div className="flex items-center">
      <span className="material-symbols-outlined text-secondary mr-2">analytics</span>
      <span className="text-headline-sm font-headline-sm text-on-surface">Credit Assessment</span>
      </div>
      </div>
      {/*  Valid Until  */}
      <div className="md:col-span-1 bg-surface-container-lowest p-6 rounded-card shadow-sm border border-outline-variant/30 flex flex-col items-start justify-between">
      <span className="text-label-sm font-label-sm text-on-surface-variant mb-2">Valid Until</span>
      <span className="text-headline-sm font-headline-sm text-secondary">14 Jan 2027</span>
      </div>
      {/*  Recipient  */}
      <div className="md:col-span-4 bg-primary-container/5 p-8 rounded-card border border-primary/10 flex items-center justify-between">
      <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
      <img className="w-8 h-8 object-contain" data-alt="A minimalist logo for UBL Bank, featuring professional geometric letterforms in deep emerald green and restrained gold. The logo is centered on a clean white background, conveying trust, legacy, and digital-first banking reliability." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtTNDoKPR7whO0U49HcD2m43kSTdLYRsbN4Peu6JI_pdfi6mvhoETUkM2AQGrJb0s_6jBuieu3hwk1K_Yd88jGaOQbrxbIGa7kRLluTb3EzY2bm23LIQNUlPa659hbt6FzbuPYFhqNoaU21hI9CASY3jGhUbKKc8hF6PIGyqcak8-gg6H8tvrnbVtMaW2GqcOXgoIn_yCH2H2D6plF3KBlu0NG4aW8QpFWkO2Zd0O3Oudjg3nPLIgJyA"/>
      </div>
      <div className="text-left">
      <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Recipient Organization</span>
      <h4 className="text-headline-sm font-headline-sm text-primary">UBL Bank</h4>
      </div>
      </div>
      <div className="px-4 py-1 bg-primary-container/10 text-primary-container rounded-full text-label-md font-label-md flex items-center">
      <span className="material-symbols-outlined text-sm mr-1" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span> Verified Entity
                              </div>
      </div>
      </div>
      {/*  Audit Section  */}
      <div className="w-full bg-surface-container p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
      <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-on-surface-variant">history_edu</span>
      <span className="text-body-md text-on-surface">Audit Reference: <code className="bg-surface-container-highest px-2 py-0.5 rounded text-primary">8f3a…91c2</code></span>
      </div>
      <button className="flex items-center gap-2 text-primary font-label-md hover:underline">
      <span className="material-symbols-outlined text-sm">download</span> Download Receipt
                          </button>
      </div>
      {/*  Primary Actions  */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <button className="px-8 py-4 bg-primary-container text-white rounded-lg font-label-md text-label-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                              View income profile
                          </button>
      <button className="px-8 py-4 border-2 border-secondary text-secondary rounded-lg font-label-md text-label-md hover:bg-secondary/5 transition-all">
                              Manage consent
                          </button>
      </div>
      {/*  Revoke Notice  */}
      <div className="flex items-center gap-2 text-on-surface-variant/70 italic text-body-sm">
      <span className="material-symbols-outlined text-sm">info</span>
      <span>You can revoke this access at any time from your Consent Center.</span>
      </div>
      </div>
      </main>
      </div>
    </>
  );
}
