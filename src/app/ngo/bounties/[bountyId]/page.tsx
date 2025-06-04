
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { mockBounties, mockLawyerProfiles } from "@/lib/data";
import type { Bounty, Milestone } from "@/lib/types";
import { ArrowLeft, CheckCircle, XCircle, FileText, Users, CalendarDays, Tag, ThumbsUp, ThumbsDown, AlertTriangle, Loader2, UserCheck, UserX } from "lucide-react";

// Helper for milestone status badge
const getMilestoneStatusBadge = (status: Milestone['status']) => {
  switch (status) {
    case 'Pending': return <Badge variant="outline">Pending</Badge>;
    case 'Submitted': return <Badge className="bg-blue-500 hover:bg-blue-600">Submitted for Review</Badge>;
    case 'Approved': return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export default function NgoBountyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bountyId = params.bountyId as string;

  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [milestoneActionLoading, setMilestoneActionLoading] = useState<Record<string, boolean>>({}); // { milestoneId: true/false }
  const [applicationActionLoading, setApplicationActionLoading] = useState<string | null>(null); // 'approve' | 'reject' | null

  useEffect(() => {
    const foundBounty = mockBounties.find(b => b.id === bountyId);
    if (foundBounty) {
      setBounty(foundBounty);
    } else {
      toast({ title: "Error", description: "Bounty not found.", variant: "destructive" });
      router.push('/ngo/bounties'); 
    }
    setIsLoading(false);
  }, [bountyId, router, toast]);

  const handleMilestoneAction = (milestoneId: string, action: 'approve' | 'reject') => {
    if (!bounty) return;
    setMilestoneActionLoading(prev => ({ ...prev, [milestoneId]: true }));

    setTimeout(() => {
      const updatedBounties = mockBounties.map(b => {
        if (b.id === bounty.id) {
          return {
            ...b,
            milestones: b.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  status: action === 'approve' ? 'Approved' : 'Rejected' as Milestone['status'],
                  approvedAt: action === 'approve' ? new Date().toISOString() : undefined,
                };
              }
              return m;
            }),
          };
        }
        return b;
      });

      const bountyIndex = mockBounties.findIndex(b => b.id === bounty.id);
      if (bountyIndex !== -1) {
        mockBounties[bountyIndex] = updatedBounties.find(b => b.id === bounty.id)!;
        setBounty(mockBounties[bountyIndex]); 
      }
      
      setMilestoneActionLoading(prev => ({ ...prev, [milestoneId]: false }));
      toast({
        title: `Milestone ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Milestone "${bounty.milestones.find(m => m.id === milestoneId)?.name}" has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
        variant: "default",
      });
    }, 1000);
  };

  const handleApplicationAction = (action: 'approve' | 'reject') => {
    if (!bounty || bounty.status !== 'Awaiting Review') return;
    setApplicationActionLoading(action);

    setTimeout(() => {
      const bountyIndex = mockBounties.findIndex(b => b.id === bounty.id);
      if (bountyIndex !== -1) {
        if (action === 'approve') {
          mockBounties[bountyIndex].status = 'In Progress';
          mockBounties[bountyIndex].updatedAt = new Date().toISOString();
          setBounty(mockBounties[bountyIndex]);
          toast({
            title: "Application Approved",
            description: `Application from ${bounty.lawyerName} for "${bounty.title}" approved. Case is now In Progress.`,
            variant: "default",
          });
        } else { // Reject
          mockBounties[bountyIndex].status = 'Open';
          mockBounties[bountyIndex].lawyerId = undefined;
          mockBounties[bountyIndex].lawyerName = undefined;
          mockBounties[bountyIndex].updatedAt = new Date().toISOString();
          setBounty(mockBounties[bountyIndex]);
           toast({
            title: "Application Rejected",
            description: `Application from ${bounty.lawyerName} for "${bounty.title}" rejected. Bounty is open again.`,
            variant: "default",
          });
        }
      }
      setApplicationActionLoading(null);
    }, 1000);
  };
  
  const calculateOverallProgress = (currentBounty: Bounty | null) => {
    if (!currentBounty || currentBounty.milestones.length === 0) return 0;
    const approvedMilestones = currentBounty.milestones.filter(m => m.status === 'Approved').length;
    return (approvedMilestones / currentBounty.milestones.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Bounty Not Found</h2>
        <p className="text-muted-foreground mb-4">The bounty you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/ngo/bounties"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Bounties</Link>
        </Button>
      </div>
    );
  }
  
  const overallProgress = calculateOverallProgress(bounty);

  return (
    <>
      <PageTitle title={bounty.title}>
        <Button variant="outline" asChild>
          <Link href="/ngo/bounties"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Bounties</Link>
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Bounty Details</CardTitle>
              <CardDescription>{bounty.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center">
                <Badge className={bounty.status === 'Open' ? 'bg-primary' : bounty.status === 'In Progress' ? 'bg-amber-500' : bounty.status === 'Awaiting Review' ? 'bg-blue-500' : bounty.status === 'Completed' ? 'bg-green-600' : 'bg-slate-500' + ' text-white'}>{bounty.status}</Badge>
              </div>
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary" />
                <strong>Category:</strong><span className="ml-2">{bounty.category}</span>
              </div>
              {bounty.location && (
                <div className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <strong>Location:</strong><span className="ml-2">{bounty.location}</span>
                </div>
              )}
              {bounty.deadline && (
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                  <strong>Deadline:</strong><span className="ml-2">{new Date(bounty.deadline).toLocaleDateString()}</span>
                </div>
              )}
               {bounty.requiredExperience && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg> {/* Briefcase icon */}
                  <strong>Required Experience:</strong><span className="ml-2">{bounty.requiredExperience}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {bounty.status === 'Awaiting Review' && bounty.lawyerName && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><UserCheck className="mr-2 text-blue-500"/>Lawyer Application Review</CardTitle>
                <CardDescription>
                  <span className="font-semibold">{bounty.lawyerName}</span> has applied for this bounty.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {/* Placeholder for lawyer's application details/profile link if needed */}
                <p className="text-sm text-muted-foreground mb-4">Review the lawyer's profile and decide whether to assign them to this case.</p>
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => handleApplicationAction('approve')} 
                    disabled={applicationActionLoading === 'approve'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {applicationActionLoading === 'approve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserCheck className="mr-2 h-4 w-4"/>}
                    Approve Application
                  </Button>
                  <Button 
                    onClick={() => handleApplicationAction('reject')} 
                    disabled={applicationActionLoading === 'reject'}
                    variant="destructive"
                  >
                     {applicationActionLoading === 'reject' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserX className="mr-2 h-4 w-4"/>}
                    Reject Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(bounty.status === 'In Progress' || bounty.status === 'Completed') && (
            <Card>
              <CardHeader>
                <CardTitle>Milestones & Progress</CardTitle>
                <div className="mt-2">
                  <Progress value={overallProgress} className="w-full h-3" />
                  <p className="text-sm text-muted-foreground mt-1">{overallProgress.toFixed(0)}% Complete ({bounty.milestones.filter(m => m.status === 'Approved').length} of {bounty.milestones.length} milestones approved)</p>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {bounty.milestones.map((milestone, index) => (
                    <AccordionItem value={`milestone-${index}`} key={milestone.id}>
                      <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold">{index + 1}. {milestone.name}</span>
                          {getMilestoneStatusBadge(milestone.status)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1 space-y-3">
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        <p className="text-sm"><strong>Tokens on Approval:</strong> {milestone.unlocksTokens} HAKI</p>
                        {milestone.dueDate && <p className="text-sm"><strong>Due Date:</strong> {new Date(milestone.dueDate).toLocaleDateString()}</p>}
                        
                        {milestone.proof && (typeof milestone.proof === 'string' || milestone.proof instanceof File) && (
                          <div className="mt-2 p-3 border rounded-md bg-accent/50">
                            <p className="text-sm font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              Proof Submitted:
                            </p>
                            <p className="text-sm text-muted-foreground ml-6">
                              {typeof milestone.proof === 'string' ? milestone.proof : milestone.proof.name}
                              {/* In a real app, this would be a download link */}
                            </p>
                          </div>
                        )}

                        {milestone.status === 'Submitted' && bounty.status === 'In Progress' && (
                          <div className="mt-4 flex space-x-3">
                            <Button 
                              onClick={() => handleMilestoneAction(milestone.id, 'approve')}
                              disabled={milestoneActionLoading[milestone.id]}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {milestoneActionLoading[milestone.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleMilestoneAction(milestone.id, 'reject')}
                              disabled={milestoneActionLoading[milestone.id]}
                              variant="destructive"
                            >
                               {milestoneActionLoading[milestone.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                              Reject
                            </Button>
                          </div>
                        )}
                        {milestone.status === 'Approved' && milestone.approvedAt && (
                          <p className="text-xs text-green-600 mt-1">Approved on: {new Date(milestone.approvedAt).toLocaleDateString()}</p>
                        )}
                        {milestone.status === 'Rejected' && (
                          <p className="text-xs text-destructive mt-1">Milestone was rejected. Lawyer may need to resubmit.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Users className="mr-2 text-primary"/>
                {bounty.status === 'Awaiting Review' ? 'Applicant Lawyer' : 'Assigned Lawyer'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bounty.lawyerName ? (
                <>
                  <p className="font-semibold text-lg">{bounty.lawyerName}</p>
                  <Button variant="link" size="sm" className="p-0 mt-1" asChild>
                    <Link href={`/lawyer/profile/${bounty.lawyerId || ''}`}>View Profile (Placeholder)</Link>
                  </Button>
                </>
              ) : (
                 <p className="text-muted-foreground">{bounty.status === 'Open' ? 'Awaiting applications from lawyers.' : 'No lawyer assigned yet.'}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><FileText className="mr-2 text-primary"/>Initial Case Files</CardTitle>
            </CardHeader>
            <CardContent>
              {bounty.caseFiles && bounty.caseFiles.length > 0 ? (
                <ul className="space-y-2">
                  {bounty.caseFiles.map((file, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                      <span className="truncate" title={file.name}>{file.name}</span>
                      {/* <Button variant="link" size="sm" asChild className="ml-auto"><Link href={file.url}>Download</Link></Button> */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No initial case files uploaded.</p>
              )}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-primary">{bounty.amount.toLocaleString()} HAKI</p>
                <p className="text-sm text-muted-foreground">Total Bounty Amount</p>
                {bounty.totalRaised && bounty.totalRaised > bounty.amount && (
                    <>
                        <p className="text-lg font-semibold text-green-500 mt-2">{bounty.totalRaised.toLocaleString()} HAKI</p>
                        <p className="text-sm text-muted-foreground">Total Raised (incl. donations)</p>
                    </>
                )}
            </CardContent>
           </Card>
        </div>
      </div>
    </>
  );
}
