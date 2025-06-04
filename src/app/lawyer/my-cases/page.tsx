"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockBounties, mockLawyerProfiles } from "@/lib/data";
import type { Bounty, Milestone } from "@/lib/types";
import { UploadCloud, CheckCircle, AlertCircle, FileText, Loader2, ExternalLink } from "lucide-react";
import Link from 'next/link';

// Helper for milestone status badge
const getMilestoneStatusBadge = (status: Milestone['status']) => {
  switch (status) {
    case 'Pending': return <Badge variant="outline">Pending</Badge>;
    case 'Submitted': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Submitted</Badge>;
    case 'Approved': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export default function MyCasesPage() {
  const lawyer = mockLawyerProfiles[0]; // Assuming current lawyer
  const [myBounties, setMyBounties] = useState<Bounty[]>([]);
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({}); // { milestoneId: isLoading }

  useEffect(() => {
    // Filter bounties claimed by the current lawyer
    const claimed = mockBounties.filter(b => b.lawyerId === lawyer.id && (b.status === 'In Progress' || b.status === 'Awaiting Review' || b.status === 'Completed'));
    setMyBounties(claimed);
  }, [lawyer.id]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>, bountyId: string, milestoneId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingStates(prev => ({ ...prev, [milestoneId]: true }));

    // Simulate upload and update
    setTimeout(() => {
      setMyBounties(prevBounties => 
        prevBounties.map(b => {
          if (b.id === bountyId) {
            return {
              ...b,
              milestones: b.milestones.map(m => 
                m.id === milestoneId ? { ...m, status: 'Submitted' as Milestone['status'], proof: file.name } : m
              )
            };
          }
          return b;
        })
      );
      setUploadingStates(prev => ({ ...prev, [milestoneId]: false }));
      // Here you would actually upload the file to a server/storage
      alert(`Uploaded ${file.name} for milestone ${milestoneId}. Awaiting NGO review.`);
    }, 2000);
  };

  const calculateProgress = (bounty: Bounty) => {
    const approvedMilestones = bounty.milestones.filter(m => m.status === 'Approved').length;
    return (approvedMilestones / bounty.milestones.length) * 100;
  };

  return (
    <>
      <PageTitle
        title="My Active Cases"
        description={`Track your progress, manage milestones, and upload necessary documents for your claimed pro-bono cases, ${lawyer.name}.`}
      />

      {myBounties.length === 0 ? (
        <Card className="text-center py-12">
           <CardHeader>
            <CardTitle>No Active Cases</CardTitle>
            <CardDescription>You haven&apos;t claimed any cases yet, or your claimed cases are not currently active.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/lawyer/cases">Browse and Claim Cases</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {myBounties.map(bounty => (
            <Card key={bounty.id} className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl mb-1">{bounty.title}</CardTitle>
                        <CardDescription>NGO: {bounty.ngoName} | Category: {bounty.category}</CardDescription>
                    </div>
                    <Badge variant={bounty.status === "Completed" ? "default" : "secondary"} className={`mt-2 md:mt-0 text-sm ${bounty.status === "Completed" ? "bg-green-600" : ""}`}>
                        {bounty.status}
                    </Badge>
                </div>
                <div className="mt-3">
                  <Label>Overall Progress</Label>
                  <Progress value={calculateProgress(bounty)} className="w-full h-3 mt-1" />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {bounty.milestones.map(milestone => (
                    <AccordionItem value={milestone.id} key={milestone.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-semibold">{milestone.name}</span>
                          {getMilestoneStatusBadge(milestone.status)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1">
                        <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                        <p className="text-sm mb-1"><strong>Tokens on Approval:</strong> {milestone.unlocksTokens} HAKI</p>
                        {milestone.dueDate && <p className="text-sm mb-3"><strong>Due Date:</strong> {new Date(milestone.dueDate).toLocaleDateString()}</p>}
                        
                        {milestone.status === 'Pending' && (
                          <div className="mt-4 p-4 border rounded-md bg-background">
                            <Label htmlFor={`file-upload-${milestone.id}`} className="font-medium text-base">Upload Proof of Work</Label>
                            <p className="text-xs text-muted-foreground mb-2">Submit documents to verify completion (e.g., court filings, attendance records).</p>
                            <Input 
                              id={`file-upload-${milestone.id}`} 
                              type="file" 
                              onChange={(e) => handleFileUpload(e, bounty.id, milestone.id)}
                              disabled={uploadingStates[milestone.id]}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {uploadingStates[milestone.id] && (
                              <div className="flex items-center text-sm text-primary mt-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...
                              </div>
                            )}
                          </div>
                        )}
                        {milestone.status === 'Submitted' && (
                          <div className="mt-4 p-3 border rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <div>
                                Document <span className="font-semibold">{typeof milestone.proof === 'string' ? milestone.proof : (milestone.proof as File)?.name || 'proof'}</span> submitted. Awaiting NGO review.
                            </div>
                          </div>
                        )}
                        {milestone.status === 'Approved' && (
                          <div className="mt-4 p-3 border rounded-md bg-green-500/10 text-green-700 dark:text-green-400 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <div>
                                Milestone approved! {milestone.unlocksTokens} HAKI tokens unlocked.
                                {milestone.proof && <span className="block text-xs">Proof: {typeof milestone.proof === 'string' ? milestone.proof : (milestone.proof as File)?.name || 'N/A'}</span>}
                            </div>
                          </div>
                        )}
                        {milestone.status === 'Rejected' && (
                           <div className="mt-4 p-3 border rounded-md bg-destructive/10 text-destructive flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <div>
                                Milestone rejected. Check NGO feedback and resubmit if necessary.
                                {milestone.proof && <span className="block text-xs">Submitted Proof: {typeof milestone.proof === 'string' ? milestone.proof : (milestone.proof as File)?.name || 'N/A'}</span>}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
               <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={`/lawyer/cases/${bounty.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" /> View Full Case Details
                    </Link>
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
