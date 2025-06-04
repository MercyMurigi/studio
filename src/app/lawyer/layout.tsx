
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Search, Briefcase, UserCog, Bot, Wallet } from 'lucide-react';

const navItems = [
  { href: '/lawyer', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, matchExact: true },
  { href: '/lawyer/cases', label: 'Browse Cases', icon: <Search className="h-5 w-5" /> },
  { href: '/lawyer/my-cases', label: 'My Cases', icon: <Briefcase className="h-5 w-5" /> },
  { href: '/lawyer/match', label: 'AI Case Match', icon: <Bot className="h-5 w-5" /> },
  { href: '/lawyer/profile', label: 'Profile', icon: <UserCog className="h-5 w-5" /> },
  { href: '/lawyer/wallet', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
];

export default function LawyerDashboardLayout({ children }: { children: ReactNode }) {
  const [portalDisplayName, setPortalDisplayName] = useState("Lawyer Portal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLawyerName = localStorage.getItem("currentLawyerSessionName");
      if (storedLawyerName) {
        setPortalDisplayName(`${storedLawyerName}'s Portal`);
      } else {
        setPortalDisplayName("Lawyer Portal");
      }
    }
  }, []);

  return (
    <DashboardLayout navItems={navItems} portalName={portalDisplayName}>
      {children}
    </DashboardLayout>
  );
}
