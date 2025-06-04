
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutDashboard, FileText, BarChart3, Settings, PlusCircle, Wallet } from 'lucide-react';
// import { mockNgoProfiles } from '@/lib/data'; // We will get name from localStorage

const navItems = [
  { href: '/ngo', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, matchExact: true },
  { href: '/ngo/bounties', label: 'Manage Bounties', icon: <FileText className="h-5 w-5" /> },
  { href: '/ngo/bounties/new', label: 'Create Bounty', icon: <PlusCircle className="h-5 w-5" /> },
  { href: '/ngo/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { href: '/ngo/wallet', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
  { href: '/ngo/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export default function NGODashboardLayout({ children }: { children: ReactNode }) {
  const [portalDisplayName, setPortalDisplayName] = useState("NGO Portal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNgoName = localStorage.getItem("currentNgoSessionName");
      if (storedNgoName) {
        setPortalDisplayName(`${storedNgoName} Portal`);
      } else {
        // Fallback if no specific NGO name is in session,
        // could also try to get from mockNgoProfiles if an ID was stored.
        // For now, simple fallback.
        setPortalDisplayName("NGO Portal");
      }
    }
  }, []);

  return (
    <DashboardLayout navItems={navItems} portalName={portalDisplayName}>
      {children}
    </DashboardLayout>
  );
}
