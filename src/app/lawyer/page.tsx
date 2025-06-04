
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { PageTitle } from "@/components/shared/PageTitle";
import { mockLawyerProfiles, mockBounties, mockSuggestedCases } from "@/lib/data";
import type { LawyerProfile } from '@/lib/types';
import { Search, Briefcase, Bot, CheckCircle, ArrowRight } from "lucide-react";

export default function LawyerDashboardPage() {
  const [currentLawyer, setCurrentLawyer] = useState<LawyerProfile | null>(null);
  const [lawyerDisplayName, setLawyerDisplayName] = useState("Advocate");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLawyerName = localStorage.getItem("currentLawyerSessionName");
      const storedLawyerEmail = localStorage.getItem("currentLawyerSessionEmail");
      
      if (storedLawyerName) {
        setLawyerDisplayName(storedLawyerName);
      }

      if (storedLawyerEmail) {
        const foundLawyer = mockLawyerProfiles.find(p => p.email === storedLawyerEmail);
        if (foundLawyer) {
          setCurrentLawyer(foundLawyer);
          if (!storedLawyerName) setLawyerDisplayName(foundLawyer.name);
        } else if (storedLawyerName) {
          // If profile not in mock, but name was in session, create a temporary profile
          setCurrentLawyer({ id: 'temp-lawyer', name: storedLawyerName, email: storedLawyerEmail, specialization: [], experienceYears: 0, bio: '' });
        }
      }
      
      if (!currentLawyer && !storedLawyerEmail && !storedLawyerName) {
        // Fallback to the first mock lawyer if no session data at all
        const defaultLawyer = mockLawyerProfiles[0];
        setCurrentLawyer(defaultLawyer);
        setLawyerDisplayName(defaultLawyer.name);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // currentLawyer dependency removed to avoid re-triggering from its own update

  const claimedBounties = currentLawyer ? mockBounties.filter(b => b.lawyerId === currentLawyer.id) : [];
  const completedMilestones = claimedBounties.reduce((acc, bounty) => 
    acc + bounty.milestones.filter(m => m.status === 'Approved').length, 0
  );
  const activeCases = claimedBounties.filter(c => c.status === 'In Progress');

  const stats = [
    { title: "Claimed Cases", value: claimedBounties.length, icon: <Briefcase className="h-6 w-6 text-secondary" />, link: "/lawyer/my-cases", linkText: "View My Cases" },
    { title: "Completed Milestones", value: completedMilestones, icon: <CheckCircle className="h-6 w-6 text-secondary" />, link: "/lawyer/my-cases", linkText: "Track Milestones" },
    { title: "Suggested Cases", value: mockSuggestedCases.length, icon: <Bot className="h-6 w-6 text-secondary" />, link: "/lawyer/match", linkText: "Find Matches" },
  ];

  return (
    <>
      <PageTitle title={`Welcome back, ${lawyerDisplayName}!`} description="Manage your pro-bono work and find new opportunities.">
        <Button asChild>
          <Link href="/lawyer/cases">
            <Search className="mr-2 h-4 w-4" /> Browse Available Cases
          </Link>
        </Button>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow border-l-4 border-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link href={stat.link} className="text-xs text-muted-foreground hover:text-secondary">
                {stat.linkText} <ArrowRight className="inline h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-secondary" /> Active Cases ({activeCases.length})</CardTitle>
            <CardDescription>Your currently active pro-bono cases.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCases.length > 0 ? (
              <ul className="space-y-4">
                {activeCases.slice(0, 3).map(bounty => (
                  <li key={bounty.id} className="p-3 rounded-md border bg-background/50">
                    <div className="flex justify-between items-start">
                        <Link href={`/lawyer/cases/${bounty.id}`} className="font-semibold text-primary hover:underline">{bounty.title}</Link>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/lawyer/my-cases`}>Manage</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Next Milestone: {bounty.milestones.find(m => m.status === 'Pending')?.name || 'All completed'}
                    </p>
                  </li>
                ))}
                {activeCases.length > 3 && (
                    <Button variant="link" asChild className="p-0 mt-2 text-sm">
                        <Link href="/lawyer/my-cases">View all active cases <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                )}
              </ul>
            ) : (
              <p className="text-muted-foreground">No active cases. <Link href="/lawyer/cases" className="text-secondary hover:underline">Find a case</Link> to get started.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Bot className="mr-2 h-5 w-5 text-secondary" /> AI Suggested Matches</CardTitle>
            <CardDescription>Cases recommended for you by our AI.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockSuggestedCases.length > 0 ? (
               <ul className="space-y-4">
                {mockSuggestedCases.slice(0, 3).map(suggestion => (
                  <li key={suggestion.caseId} className="p-3 rounded-md border bg-background/50">
                    <div className="flex justify-between items-center">
                        <Link href={`/lawyer/cases/${suggestion.caseId}`} className="font-semibold text-primary hover:underline">{suggestion.caseName}</Link>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/lawyer/cases/${suggestion.caseId}`}>View</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate" title={suggestion.matchReason}>{suggestion.matchReason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No AI suggestions at the moment. Ensure your profile is up-to-date or <Link href="/lawyer/match" className="text-secondary hover:underline">run a new match</Link>.</p>
            )}
            {mockSuggestedCases.length > 0 && (
                 <Button variant="link" asChild className="p-0 mt-4 text-sm">
                    <Link href="/lawyer/match">See all AI Matches <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
