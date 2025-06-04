
"use client";

import Link from "next/link";
import Image from "next/image";
import { mockLawyerProfiles, HAKI_CONVERSION_RATE } from "@/lib/data";
import { PageTitle } from "@/components/shared/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Linkedin, CalendarDays, Award, UserCheck, Wallet, Edit3, Building, MessageCircle, ShieldQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LawyerProfilePage() {
  const lawyer = mockLawyerProfiles[0]; // Assuming the first lawyer is the logged-in user
  const { toast } = useToast();

  if (!lawyer) {
    return (
      <PageTitle title="Lawyer Profile Not Found" description="The requested lawyer profile could not be loaded." />
    );
  }
  
  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality is not yet implemented.",
    });
  };

  const hakiBalance = lawyer.walletBalanceHaki || 0;
  const usdEquivalent = (hakiBalance / HAKI_CONVERSION_RATE).toLocaleString('en-US', { style: 'currency', currency: 'USD' });


  return (
    <>
      <PageTitle title="My Profile" description="View and manage your professional details on HakiChain.">
        <Button onClick={handleEditProfile} variant="outline">
          <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Main Info & About */}
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
                    {/* Placeholder for future Chat Button if needed */}
                    {/* <Button variant="default" className="w-full mt-2">
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat on HakiChain (Coming Soon)
                    </Button> */}
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-headline"><MessageCircle className="mr-2 h-5 w-5 text-primary" />About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{lawyer.bio}</p>
              </CardContent>
            </Card>
        </div>

        {/* Right Column: Details & Expertise */}
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
              <CardTitle className="flex items-center font-headline"><ShieldQuestion className="mr-2 h-5 w-5 text-primary" />Areas of Expertise</CardTitle>
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
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-headline"><Wallet className="mr-2 h-5 w-5 text-primary" />HakiChain Wallet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-primary">{hakiBalance.toLocaleString()} HAKI</p>
                <p className="text-sm text-muted-foreground">Approx. {usdEquivalent}</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/lawyer/wallet"> {/* Placeholder, create /lawyer/wallet later if needed */}
                        View Wallet Details
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
