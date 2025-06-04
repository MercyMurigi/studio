
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
import { UploadCloud, CheckCircle, AlertCircle, FileText, Loader2, ExternalLink, Search } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

// Helper for milestone status badge
const getMilestoneStatusBadge = (status: Milestone['status']) => {
  switch (status) {
    case 'Pending': return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
    case 'Submitted': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Submitted</Badge>;
    case 'Approved': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export default function MyCasesPage() {
  const lawyer = mockLawyerProfiles[0]; // Assuming current lawyer
  const { toast } = useToast();
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
                m.id === milestoneId ? { ...m, status: 'Submitted' as Milestone['status'], proof: file.name, submittedAt: new Date().toISOString() } : m
              )
            };
          }
          return b;
        })
      );
      setUploadingStates(prev => ({ ...prev, [milestoneId]: false }));
      toast({
        title: "Proof Uploaded",
        description: `"${file.name}" has been submitted for milestone "${myBounties.find(b => b.id === bountyId)?.milestones.find(m=>m.id === milestoneId)?.name}". Awaiting NGO review.`,
        variant: "default"
      });
    }, 2000);
  };

  const calculateProgress = (bounty: Bounty) => {
    if (bounty.milestones.length === 0) return 0;
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
        <Card className="text-center py-12 shadow-md">
           <CardHeader>
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline">No Active Cases</CardTitle>
            <CardDescription>You haven&apos;t claimed any cases yet, or your claimed cases are not currently active.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild className="mt-2">
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
                    <Badge 
                      className={`mt-2 md:mt-0 text-sm py-1 px-3
                        ${bounty.status === "Completed" ? "bg-green-600 text-white" : 
                          bounty.status === "In Progress" ? "bg-amber-500 text-white" :
                          bounty.status === "Awaiting Review" ? "bg-blue-500 text-white" : 
                          "bg-slate-400 text-white"}`}
                    >
                        {bounty.status}
                    </Badge>
                </div>
                {bounty.status !== 'Awaiting Review' && (
                    <div className="mt-3">
                    <Label className="text-sm font-medium">Overall Progress ({bounty.milestones.filter(m => m.status === 'Approved').length}/{bounty.milestones.length} Milestones)</Label>
                    <Progress value={calculateProgress(bounty)} className="w-full h-3 mt-1" aria-label={`${calculateProgress(bounty).toFixed(0)}% complete`}/>
                    </div>
                )}
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {bounty.milestones.map((milestone, index) => (
                    <AccordionItem value={milestone.id} key={milestone.id}>
                      <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-semibold">{index + 1}. {milestone.name}</span>
                          {getMilestoneStatusBadge(milestone.status)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1 space-y-3">
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        <p className="text-sm"><strong>Tokens on Approval:</strong> {milestone.unlocksTokens} HAKI</p>
                        {milestone.dueDate && <p className="text-sm"><strong>Due Date:</strong> {new Date(milestone.dueDate).toLocaleDateString()}</p>}
                        
                        {milestone.status === 'Pending' && bounty.status === 'In Progress' && (
                          <div className="mt-4 p-4 border rounded-md bg-card shadow-sm">
                            <Label htmlFor={`file-upload-${milestone.id}`} className="font-medium text-base flex items-center">
                                <UploadCloud className="h-5 w-5 mr-2 text-primary" />
                                Upload Proof of Work
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">Submit documents to verify completion (e.g., court filings, attendance records).</p>
                            <Input 
                              id={`file-upload-${milestone.id}`} 
                              type="file" 
                              onChange={(e) => handleFileUpload(e, bounty.id, milestone.id)}
                              disabled={uploadingStates[milestone.id]}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                            {uploadingStates[milestone.id] && (
                              <div className="flex items-center text-sm text-primary mt-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...
                              </div>
                            )}
                          </div>
                        )}
                        {milestone.status === 'Submitted' && (
                          <div className="mt-4 p-3 border rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-start">
                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                Document <span className="font-semibold">{typeof milestone.proof === 'string' ? milestone.proof : (milestone.proof as File)?.name || 'proof'}</span> submitted on {milestone.submittedAt ? new Date(milestone.submittedAt).toLocaleDateString() : 'N/A'}. Awaiting NGO review.
                            </div>
                          </div>
                        )}
                        {milestone.status === 'Approved' && (
                          <div className="mt-4 p-3 border rounded-md bg-green-500/10 text-green-700 dark:text-green-400 flex items-start">
                            <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                Milestone approved! {milestone.unlocksTokens} HAKI tokens unlocked.
                                {milestone.proof && <span className="block text-xs mt-1">Proof: {typeof milestone.proof === 'string' ? milestone.proof : (milestone.proof as File)?.name || 'N/A'}</span>}
                                {milestone.approvedAt && <span className="block text-xs">Approved on: {new Date(milestone.approvedAt).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        )}
                        {milestone.status === 'Rejected' && (
                           <div className="mt-4 p-3 border rounded-md bg-destructive/10 text-destructive flex items-start">
                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                Milestone rejected. Check NGO feedback and resubmit if necessary.
                                {milestone.proof && <span className="block text-xs mt-1">Submitted Proof: {typeof milestone.proof === 'string' ? milestone.proof : (milestone.proof as File)?.name || 'N/A'}</span>}
                            </div>
                          </div>
                        )}
                        {bounty.status === 'Awaiting Review' && (
                             <div className="mt-4 p-3 border rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 flex items-start">
                                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                <div>This case is awaiting review by the NGO. Milestone actions will be available once approved.</div>
                            </div>
                        )}
                         {bounty.status === 'Completed' && milestone.status !== 'Approved' && (
                             <div className="mt-4 p-3 border rounded-md bg-slate-500/10 text-slate-700 dark:text-slate-400 flex items-start">
                                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                <div>This case has been marked as completed. This milestone was not approved.</div>
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

