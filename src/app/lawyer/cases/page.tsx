
"use client";

import { useState, useEffect, type MouseEvent } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mockBounties, mockLawyerProfiles } from "@/lib/data";
import type { Bounty } from "@/lib/types";
import { Search, Filter, Briefcase, DollarSign, Users, MapPin, FileText, CalendarDays, Tag, CheckCircle, ExternalLink } from "lucide-react";
import Link from 'next/link';

export default function BrowseCasesPage() {
  const [allBounties, setAllBounties] = useState<Bounty[]>([]);
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const [selectedBountyForModal, setSelectedBountyForModal] = useState<Bounty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const openBounties = mockBounties.filter(b => b.status === 'Open');
    setAllBounties(openBounties);
  }, []);

  useEffect(() => {
    let tempBounties = allBounties;

    if (searchTerm) {
      tempBounties = tempBounties.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.tags && b.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (categoryFilter !== "all") {
      tempBounties = tempBounties.filter(b => b.category === categoryFilter);
    }
    
    if (locationFilter !== "all") {
      tempBounties = tempBounties.filter(b => b.location && b.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    setFilteredBounties(tempBounties);
  }, [searchTerm, categoryFilter, locationFilter, allBounties]);

  const uniqueCategories = ["all", ...new Set(mockBounties.map(b => b.category)).add("Employment Law").add("Housing Law").add("Intellectual Property Law")];
  const uniqueLocations = ["all", ...new Set(mockBounties.map(b => b.location).filter(Boolean) as string[])];

  const handleViewAndApplyClick = (bounty: Bounty) => {
    setSelectedBountyForModal(bounty);
    setIsModalOpen(true);
  };

  const handleApplyForBounty = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any default form submission if it's somehow in a form
    if (!selectedBountyForModal) return;

    const currentLawyer = mockLawyerProfiles[0]; // Placeholder for logged-in lawyer

    // Find the bounty in the main mockBounties array and update it
    const bountyIndex = mockBounties.findIndex(b => b.id === selectedBountyForModal.id);
    if (bountyIndex !== -1 && mockBounties[bountyIndex].status === 'Open') {
      mockBounties[bountyIndex].status = 'Awaiting Review';
      mockBounties[bountyIndex].lawyerId = currentLawyer.id;
      mockBounties[bountyIndex].lawyerName = currentLawyer.name;
      mockBounties[bountyIndex].updatedAt = new Date().toISOString();

      toast({
        title: "Application Submitted!",
        description: `Your application for "${selectedBountyForModal.title}" has been sent to the NGO for review.`,
        variant: "default",
      });

      // Refresh the list of open bounties
      setAllBounties(prev => prev.filter(b => b.id !== selectedBountyForModal.id));
      setIsModalOpen(false);
      setSelectedBountyForModal(null);
    } else {
      toast({
        title: "Error",
        description: "This bounty is no longer available or an error occurred.",
        variant: "destructive",
      });
    }
  };


  return (
    <>
      <PageTitle
        title="Browse Available Cases"
        description="Find pro-bono opportunities that match your expertise and passion. This page lists all currently open and available bounties on the HakiChain platform. Claim a bounty and make a difference."
      />

      <Card className="mb-8 p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="search" className="font-semibold">Search Cases</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Keywords, title, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category" className="font-semibold">Filter by Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location" className="font-semibold">Filter by Location</Label>
             <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger id="location" className="mt-1">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc === "all" ? "All Locations" : loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredBounties.length === 0 ? (
         <div className="text-center py-12">
            <Search className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No Cases Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t find any cases matching your current filters. Try adjusting your search.
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setLocationFilter("all");}}>
              Clear Filters
            </Button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map(bounty => (
            <Card key={bounty.id} className="flex flex-col hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{bounty.category}</span>
                    <span className="text-xs text-muted-foreground">{new Date(bounty.createdAt).toLocaleDateString()}</span>
                </div>
                <CardTitle className="font-headline text-xl">{bounty.title}</CardTitle>
                <CardDescription className="h-20 overflow-hidden text-ellipsis leading-relaxed">
                  {bounty.description.substring(0, 120)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" /> NGO: {bounty.ngoName}
                </div>
                {bounty.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> Location: {bounty.location}
                  </div>
                )}
                {bounty.requiredExperience && (
                  <div className="flex items-center text-sm text-muted-foreground">
                     <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" /> Experience: {bounty.requiredExperience}
                  </div>
                )}
                <div className="flex items-center text-lg font-semibold text-primary pt-2">
                  <DollarSign className="h-5 w-5 mr-1" /> {bounty.amount.toLocaleString()} {bounty.currency} Bounty
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full bg-primary hover:bg-primary/80" onClick={() => handleViewAndApplyClick(bounty)}>
                  View Details & Apply
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedBountyForModal && (
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setSelectedBountyForModal(null); }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{selectedBountyForModal.title}</DialogTitle>
              <DialogDescription>
                <span className="text-sm px-2 py-1 rounded-full bg-secondary text-secondary-foreground mr-2">{selectedBountyForModal.category}</span>
                Posted by: {selectedBountyForModal.ngoName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <p className="text-muted-foreground leading-relaxed">{selectedBountyForModal.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  <strong>Bounty:</strong><span className="ml-2">{selectedBountyForModal.amount.toLocaleString()} {selectedBountyForModal.currency}</span>
                </div>
                 <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  <strong>Category:</strong><span className="ml-2">{selectedBountyForModal.category}</span>
                </div>
                {selectedBountyForModal.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <strong>Location:</strong><span className="ml-2">{selectedBountyForModal.location}</span>
                  </div>
                )}
                {selectedBountyForModal.deadline && (
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                    <strong>Deadline:</strong><span className="ml-2">{new Date(selectedBountyForModal.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedBountyForModal.requiredExperience && (
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    <strong>Required Experience:</strong><span className="ml-2">{selectedBountyForModal.requiredExperience}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-md">Milestones:</h4>
                <ul className="space-y-2 list-disc list-inside pl-1 text-sm">
                  {selectedBountyForModal.milestones.map(milestone => (
                    <li key={milestone.id}>
                      <strong>{milestone.name}</strong> ({milestone.unlocksTokens} {selectedBountyForModal.currency}): {milestone.description}
                      {milestone.dueDate && <span className="text-xs text-muted-foreground"> (Due: {new Date(milestone.dueDate).toLocaleDateString()})</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedBountyForModal.caseFiles && selectedBountyForModal.caseFiles.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-md">Initial Case Files:</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedBountyForModal.caseFiles.map((file, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                        {file.name}
                        {/* <Button variant="link" size="sm" asChild className="ml-auto"><Link href={file.url} target="_blank">Download</Link></Button> */}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between items-center gap-2 pt-4 border-t">
              <Button variant="outline" asChild>
                <Link href={`/lawyer/cases/${selectedBountyForModal.id}`} onClick={() => setIsModalOpen(false)}>
                  <ExternalLink className="mr-2 h-4 w-4"/> Open Full Details Page
                </Link>
              </Button>
              {selectedBountyForModal.status === 'Open' ? (
                <Button onClick={handleApplyForBounty} className="bg-primary hover:bg-primary/90">
                  <CheckCircle className="mr-2 h-4 w-4" /> Apply for this Bounty
                </Button>
              ) : (
                <Button disabled>
                  {selectedBountyForModal.status === 'Awaiting Review' ? 'Application Submitted' : 'Not Available'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}


    
