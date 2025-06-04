
"use client";

import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockBounties, mockDonorProfiles } from "@/lib/data";
import Image from "next/image";
import { HeartHandshake, Users, Briefcase, DollarSign, Award, Medal, Shield, HelpingHand } from "lucide-react";
import type { DonorProfile } from "@/lib/types";

export default function DonorPortalPage() {
  // Simulate a logged-in donor context. In a real app, this would come from auth.
  const currentDonor: DonorProfile | undefined = mockDonorProfiles[0]; 
  const openBounties = mockBounties.filter(b => b.status === 'Open' || b.status === 'In Progress');

  return (
    <>
      <PageTitle 
        title="Support Pro-Bono Cases"
        description="Browse active bounties and contribute to causes you care about. Your support helps lawyers provide essential legal services."
      />

      {currentDonor && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold font-headline mb-4">Your Impact Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-l-4 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-6 w-6 mr-2 text-primary" />
                  Total Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{currentDonor.totalContributionsHaki?.toLocaleString() || 0} HAKI</p>
                <p className="text-sm text-muted-foreground">Thank you for your generosity!</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-l-4 border-secondary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-secondary" />
                  Champion Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentDonor.championBadges && currentDonor.championBadges.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {currentDonor.championBadges.map(badge => (
                      <div key={badge.badgeName} className="flex flex-col items-center text-center p-2 rounded-md bg-muted/50 w-28">
                        <Image 
                          src={badge.badgeImageUrl} 
                          alt={badge.badgeName} 
                          width={48} 
                          height={48} 
                          className="mb-1 rounded-full"
                          data-ai-hint={`${badge.category.toLowerCase().replace(/\s+/g, "-")} badge icon`}
                        />
                        <p className="text-xs font-semibold">{badge.badgeName}</p>
                        <p className="text-xs text-muted-foreground">{badge.category}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Support causes to earn champion badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <h2 className="text-2xl font-semibold font-headline mb-6 mt-8 border-t pt-8">Fund a Cause</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openBounties.map(bounty => (
          <Card key={bounty.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{bounty.category}</span>
                <span className="text-xs text-muted-foreground">{new Date(bounty.createdAt).toLocaleDateString()}</span>
              </div>
              <CardTitle className="font-headline text-xl h-14 overflow-hidden">{bounty.title}</CardTitle>
              <CardDescription className="h-16 overflow-hidden text-ellipsis">{bounty.description.substring(0, 100)}...</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Shield className="h-4 w-4 mr-2" /> NGO: {bounty.ngoName}
              </div>
              {bounty.lawyerName && (
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Briefcase className="h-4 w-4 mr-2" /> Lawyer: {bounty.lawyerName}
                </div>
              )}
              <div className="flex items-center text-lg font-semibold text-primary mt-2">
                <DollarSign className="h-5 w-5 mr-1" /> {bounty.amount.toLocaleString()} {bounty.currency}
                {bounty.totalRaised && bounty.totalRaised > bounty.amount && (
                  <span className="text-sm text-green-500 ml-2">(Goal: {bounty.totalRaised.toLocaleString()} {bounty.currency})</span>
                )}
              </div>
               {/* Placeholder for progress bar if needed, e.g. funded amount vs goal */}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full bg-primary hover:bg-primary/80 text-lg py-3" asChild>
                <Link href={`/donor/bounties/${bounty.id}`}> {/* Placeholder link */}
                  <HeartHandshake className="mr-2 h-5 w-5" /> Fund This Case
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {openBounties.length === 0 && (
        <div className="text-center py-12">
          <Image src="https://placehold.co/300x200.png" alt="No open bounties" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="empty illustration" />
          <p className="text-xl text-muted-foreground">There are currently no open bounties seeking funding.</p>
          <p className="text-muted-foreground">Please check back later or consider supporting HakiChain directly.</p>
          <Button className="mt-6" asChild>
            <Link href="/">Learn More About Our Mission</Link>
          </Button>
        </div>
      )}
    </>
  );
}
