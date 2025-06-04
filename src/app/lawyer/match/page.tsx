"use client";

import { useState, type FormEvent } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { suggestCases, type SuggestCasesInput, type SuggestCasesOutput } from "@/ai/flows/suggest-cases";
import { mockLawyerProfiles, mockBounties } from "@/lib/data"; // For populating default values
import { Loader2, Wand2, AlertTriangle, Search } from "lucide-react";
import Link from 'next/link';

export default function AiCaseMatchPage() {
  const currentLawyer = mockLawyerProfiles[0]; // Placeholder for logged-in lawyer

  const [lawyerProfile, setLawyerProfile] = useState<string>(
    `Name: ${currentLawyer.name}\nSpecializations: ${currentLawyer.specialization.join(', ')}\nExperience: ${currentLawyer.experienceYears} years\nBio: ${currentLawyer.bio}`
  );
  const [caseDetails, setCaseDetails] = useState<string>(
    mockBounties
      .filter(b => b.status === 'Open')
      .map(b => `Case ID: ${b.id}\nCase Name: ${b.title}\nDescription: ${b.description}\nCategory: ${b.category}\nRequired Experience: ${b.requiredExperience || 'Not specified'}\nLocation: ${b.location || 'Any'}\n---`)
      .join('\n\n')
  );
  
  const [suggestedCasesResult, setSuggestedCasesResult] = useState<SuggestCasesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestedCasesResult(null);

    const input: SuggestCasesInput = {
      lawyerProfile,
      caseDetails,
    };

    try {
      const result = await suggestCases(input);
      setSuggestedCasesResult(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching case suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title="AI Powered Case Matching"
        description="Describe your expertise and preferences, or use your saved profile. We'll match you with suitable pro-bono cases."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Your Profile & Preferences</CardTitle>
            <CardDescription>Provide details about your legal expertise and what you're looking for. You can also provide a general description of available cases for matching.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="lawyerProfile" className="text-lg font-semibold">Your Lawyer Profile</Label>
                <Textarea
                  id="lawyerProfile"
                  value={lawyerProfile}
                  onChange={(e) => setLawyerProfile(e.target.value)}
                  rows={8}
                  className="mt-2"
                  placeholder="e.g., Specializing in human rights law, 5 years experience, interested in cases involving freedom of speech..."
                />
                 <p className="text-xs text-muted-foreground mt-1">This can be your detailed resume, areas of focus, or specific case types you are interested in.</p>
              </div>
              <div>
                <Label htmlFor="caseDetails" className="text-lg font-semibold">Available Case Details (Optional)</Label>
                 <Textarea
                  id="caseDetails"
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  rows={10}
                  className="mt-2"
                  placeholder="Paste details of available pro-bono cases here. One case per entry, separated by '---' or new lines. Include case name, description, area of law, etc."
                />
                <p className="text-xs text-muted-foreground mt-1">If left blank, we'll match against all open cases on the platform. Providing specific case data here can refine results if you have a list of cases to consider.</p>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-6 w-6" />
                )}
                Find Matching Cases
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {isLoading && (
            <Card className="flex flex-col items-center justify-center p-10 min-h-[300px]">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-xl text-muted-foreground">Matching cases based on your profile...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </Card>
          )}

          {error && (
            <Card className="border-destructive bg-destructive/10 p-6">
              <div className="flex items-center text-destructive">
                <AlertTriangle className="h-8 w-8 mr-3" />
                <div>
                  <CardTitle className="text-destructive">Matching Failed</CardTitle>
                  <p>{error}</p>
                </div>
              </div>
            </Card>
          )}

          {suggestedCasesResult && !isLoading && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Suggested Cases ({suggestedCasesResult.length})</CardTitle>
                <CardDescription>
                  Based on your profile, here are some cases that might be a good fit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suggestedCasesResult.length === 0 ? (
                  <div className="text-center py-8">
                     <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-xl text-muted-foreground">No specific matches found with the current criteria.</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your profile details or case descriptions.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {suggestedCasesResult.map((suggestion, index) => (
                      <Card key={index} className="bg-card/50">
                        <CardHeader>
                          <CardTitle className="font-headline">{suggestion.caseName}</CardTitle>
                          <CardDescription className="line-clamp-3">{suggestion.caseDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-semibold mb-1 text-primary">Why it's a match:</p>
                          <p className="text-sm text-muted-foreground">{suggestion.matchReason}</p>
                        </CardContent>
                        <CardFooter>
                          {/* Link to the actual case page if bounty ID is available and route exists */}
                          <Button variant="outline" asChild>
                            <Link href={`/lawyer/cases/${suggestion.caseId || suggestion.caseName.toLowerCase().replace(/\s+/g, '-')}`}>View Case Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
