"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { Home, LogOut } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  matchExact?: boolean;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
  portalName: string;
}

export function DashboardLayout({ navItems, children, portalName }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="p-2 flex justify-between items-center">
              <Logo />
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={item.matchExact ? pathname === item.href : pathname.startsWith(item.href)}
                      tooltip={item.label}
                      className="justify-start"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter className="p-2">
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton className="justify-start">
                    <Home className="h-4 w-4" />
                    <span>Back to Home</span>
                </SidebarMenuButton>
              </Link>
            {/* Placeholder for logout - actual logic would be in UserNav or auth context */}
            <SidebarMenuButton className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col bg-muted/40">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-6 shadow-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold font-headline">{portalName}</h2>
            </div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
