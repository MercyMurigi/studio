
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { mockBounties } from "@/lib/data";
import type { Bounty } from "@/lib/types";
import { Search, Filter, Briefcase, DollarSign, Users, MapPin } from "lucide-react";

export default function BrowseCasesPage() {
  const [allBounties, setAllBounties] = useState<Bounty[]>([]);
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    const openBounties = mockBounties.filter(b => b.status === 'Open');
    setAllBounties(openBounties);
    setFilteredBounties(openBounties);
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

  const uniqueCategories = ["all", ...new Set(allBounties.map(b => b.category))];
  const uniqueLocations = ["all", ...new Set(allBounties.map(b => b.location).filter(Boolean) as string[])];


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
                <Button className="w-full bg-primary hover:bg-primary/80" asChild>
                  {/* This link should eventually go to a specific case detail page */}
                  <Link href={`/lawyer/cases/${bounty.id}`}> 
                    View Details & Claim
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
