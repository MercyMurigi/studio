
import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutDashboard, FileText, BarChart3, Settings, PlusCircle, Wallet } from 'lucide-react';

const navItems = [
  { href: '/ngo', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, matchExact: true },
  { href: '/ngo/bounties', label: 'Manage Bounties', icon: <FileText className="h-5 w-5" /> },
  { href: '/ngo/bounties/new', label: 'Create Bounty', icon: <PlusCircle className="h-5 w-5" /> },
  { href: '/ngo/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { href: '/ngo/wallet', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
  { href: '/ngo/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export default function NGODashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout navItems={navItems} portalName="NGO Portal">
      {children}
    </DashboardLayout>
  );
}
