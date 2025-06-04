
"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockLawyerProfiles } from "@/lib/data";
import type { LawyerProfile } from "@/lib/types";
import { PageTitle } from "@/components/shared/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Linkedin, CalendarDays, Award, UserCheck, Edit3, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DynamicLawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [lawyer, setLawyer] = useState<LawyerProfile | null | undefined>(undefined); // undefined for loading, null for not found

  const lawyerId = params.lawyerId as string;

  useEffect(() => {
    if (lawyerId) {
      const foundLawyer = mockLawyerProfiles.find(p => p.id === lawyerId);
      setLawyer(foundLawyer || null);
    } else {
      // If no lawyerId, it might be an invalid route or could redirect to a generic lawyer list
      setLawyer(null); 
    }
  }, [lawyerId]);

  const handleEditProfile = () => {
    // In a real app, this would only be available if the logged-in user is this lawyer
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality is for demonstration and would typically be restricted.",
    });
  };

  if (lawyer === undefined) { // Loading state
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <>
        <PageTitle title="Lawyer Profile Not Found">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </PageTitle>
        <Card className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardHeader>
                <CardTitle>Profile Not Found</CardTitle>
                <CardDescription>The lawyer profile you are looking for could not be loaded or does not exist.</CardDescription>
            </CardHeader>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${lawyer.name}'s Profile`} description={`Professional details for ${lawyer.name} on HakiChain.`}>
        {/* Conditionally show Edit Profile if it's their own profile - for now, always show for demo */}
        <Button onClick={handleEditProfile} variant="outline">
          <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Demo)
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-xl">
                <CardHeader className="items-center text-center p-6">
                    <Avatar className="h-32 w-32 mb-4 border-4 border-primary shadow-md">
                        <AvatarImage src={lawyer.profilePictureUrl} alt={lawyer.name} data-ai-hint="professional headshot" />
                        <AvatarFallback className="text-4xl">{lawyer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl font-headline">{lawyer.name}</CardTitle>
                    <CardDescription className="text-md text-muted-foreground">{lawyer.specialization[0]}</CardDescription>
                </CardHeader>
                <CardContent className="text-center px-6 pb-6">
                    {lawyer.linkedInProfile && (
                        <Button variant="outline" asChild className="w-full">
                            <Link href={lawyer.linkedInProfile} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn Profile
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-headline"><UserCheck className="mr-2 h-5 w-5 text-primary" />About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{lawyer.bio}</p>
              </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-headline"><Briefcase className="mr-2 h-5 w-5 text-primary" />Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <span className="font-medium">LSK/Bar ID:</span> {lawyer.barAssociationId || "Not specified"}
                </div>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <span className="font-medium">Experience:</span> {lawyer.experienceYears} years
                </div>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <span className="font-medium">Availability:</span> {lawyer.availability || "Not specified"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-headline"><Award className="mr-2 h-5 w-5 text-primary" />Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2 text-md">Specializations:</h4>
                <div className="flex flex-wrap gap-2">
                  {lawyer.specialization.map(spec => (
                    <Badge key={spec} variant="secondary" className="text-sm">{spec}</Badge>
                  ))}
                </div>
              </div>
              {lawyer.preferredCaseTypes && lawyer.preferredCaseTypes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-md">Preferred Case Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.preferredCaseTypes.map(type => (
                      <Badge key={type} variant="outline" className="text-sm">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
