
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { mockBounties, mockNgoProfiles, HAKI_CONVERSION_RATE } from "@/lib/data";
import type { Bounty, Milestone } from "@/lib/types";
import { ArrowLeft, DollarSign, CheckCircle, Users, Tag, CalendarDays, Info, Briefcase, CreditCard, Smartphone, Banknote, Bitcoin, HeartHandshake, Loader2, User, LogIn } from "lucide-react";
import { Separator } from '@/components/ui/separator';

export default function FundBountyPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bountyId = params.bountyId as string;

  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmountHaki, setDonationAmountHaki] = useState<string>("");
  const [donationAmountUsd, setDonationAmountUsd] = useState<string>("");
  const [mpesaPhone, setMpesaPhone] = useState<string>("");
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("USDC"); 
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [contributionMode, setContributionMode] = useState<'guest' | 'loggedIn'>('guest'); 

  useEffect(() => {
    const foundBounty = mockBounties.find(b => b.id === bountyId);
    if (foundBounty) {
      setBounty(foundBounty);
    } else {
      toast({ title: "Error", description: "Bounty not found.", variant: "destructive" });
      router.push('/donor');
    }
    setIsLoading(false);
  }, [bountyId, router, toast]);

  const handleHakiAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const haki = e.target.value;
    setDonationAmountHaki(haki);
    if (haki && !isNaN(parseFloat(haki))) {
      setDonationAmountUsd((parseFloat(haki) / HAKI_CONVERSION_RATE).toFixed(2));
    } else {
      setDonationAmountUsd("");
    }
  };

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usd = e.target.value;
    setDonationAmountUsd(usd);
    if (usd && !isNaN(parseFloat(usd))) {
      setDonationAmountHaki((parseFloat(usd) * HAKI_CONVERSION_RATE).toFixed(0));
    } else {
      setDonationAmountHaki("");
    }
  };
  
  const handlePayment = async (method: string) => {
    if (!donationAmountHaki || parseFloat(donationAmountHaki) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);

    toast({
      title: "Donation Submitted!",
      description: `Thank you for your generous ${contributionMode === 'guest' ? 'anonymous ' : ''}donation of ${donationAmountHaki} HAKI via ${method} to "${bounty?.title}". Your contribution is being processed.`,
      variant: "default",
    });
    setDonationAmountHaki("");
    setDonationAmountUsd("");
    setMpesaPhone("");
    setCryptoAmount("");
  };
  
  const handleContinueAsGuest = () => {
    setContributionMode('guest');
    toast({
      title: "Contributing as Guest",
      description: "Your contribution will be anonymous. You can log in to track impact and earn badges.",
    });
  };

  const handleLoginClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("loginRedirectTarget", "donor");
    }
    router.push('/auth/login');
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Info className="h-12 w-12 mx-auto text-destructive mb-4" />
        <PageTitle title="Bounty Not Found" description="The bounty you are looking for could not be loaded." />
        <Button asChild variant="outline">
          <Link href="/donor"><ArrowLeft className="mr-2 h-4 w-4" />Back to Bounties</Link>
        </Button>
      </div>
    );
  }

  const fundingGoal = bounty.totalRaised && bounty.totalRaised > bounty.amount ? bounty.totalRaised : bounty.amount;
  const currentRaised = bounty.amount; 
  const progressPercentage = fundingGoal > 0 ? (currentRaised / fundingGoal) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title={bounty.title}>
        <Button variant="outline" asChild>
          <Link href="/donor"><ArrowLeft className="mr-2 h-4 w-4" />Back to All Bounties</Link>
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{bounty.title}</CardTitle>
              <CardDescription className="text-md leading-relaxed">{bounty.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <Users className="h-5 w-5 mr-2 text-primary" /> NGO: {bounty.ngoName}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Tag className="h-5 w-5 mr-2 text-primary" /> Category: {bounty.category}
              </div>
              {bounty.location && (
                <div className="flex items-center text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Location: {bounty.location}
                </div>
              )}
              {bounty.deadline && (
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="h-5 w-5 mr-2 text-primary" /> Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                </div>
              )}
              {bounty.requiredExperience && (
                <div className="flex items-center text-muted-foreground">
                   <Briefcase className="h-5 w-5 mr-2 text-primary" /> Required Experience: {bounty.requiredExperience}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Milestones</CardTitle>
              <CardDescription>Key objectives for this case.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {bounty.milestones.map(milestone => (
                  <li key={milestone.id} className="p-3 border rounded-md bg-muted/30">
                    <p className="font-semibold">{milestone.name} ({milestone.unlocksTokens} HAKI)</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center"><HeartHandshake className="mr-2 text-primary h-7 w-7"/> Fund This Case</CardTitle>
              <CardDescription>Your contribution makes a real difference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contributionMode === 'guest' && (
                <div className="pb-4 border-b">
                  <h3 className="text-md font-semibold mb-1 text-center">Contribute Your Way</h3>
                  <p className="text-xs text-muted-foreground mb-3 text-center">
                    You&apos;re contributing as a guest. Log in to track impact and earn badges.
                  </p>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={handleContinueAsGuest}
                      disabled={isProcessingPayment}
                    >
                      <User className="mr-2 h-4 w-4" /> Continue as Guest
                    </Button>
                    <Button 
                        className="flex-1 bg-primary hover:bg-primary/90" 
                        onClick={handleLoginClick}
                        disabled={isProcessingPayment}
                    >
                        <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
                    </Button>
                  </div>
                </div>
              )}
            
              <div>
                <Label className="font-semibold">Funding Goal</Label>
                <div className="text-2xl font-bold text-primary">{fundingGoal.toLocaleString()} HAKI</div>
                <Progress value={progressPercentage} className="w-full h-2.5 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentRaised.toLocaleString()} HAKI raised so far ({progressPercentage.toFixed(1)}%)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donationAmountHaki" className="font-semibold">Your Contribution</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="donationAmountHaki"
                    type="number"
                    placeholder="HAKI Amount"
                    value={donationAmountHaki}
                    onChange={handleHakiAmountChange}
                    min="1"
                    disabled={isProcessingPayment}
                  />
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="donationAmountUsd"
                    type="number"
                    placeholder="USD (approx)"
                    value={donationAmountUsd}
                    onChange={handleUsdAmountChange}
                    min="0.1"
                    disabled={isProcessingPayment}
                  />
                </div>
                <p className="text-xs text-muted-foreground">1 USD = {HAKI_CONVERSION_RATE} HAKI (approx.)</p>
              </div>

              <Tabs defaultValue="mpesa" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="mpesa" disabled={isProcessingPayment}><Smartphone className="h-4 w-4 mr-1 md:mr-2"/>M-Pesa</TabsTrigger>
                  <TabsTrigger value="bank" disabled={isProcessingPayment}><Banknote className="h-4 w-4 mr-1 md:mr-2"/>Bank</TabsTrigger>
                  <TabsTrigger value="crypto" disabled={isProcessingPayment}><Bitcoin className="h-4 w-4 mr-1 md:mr-2"/>Crypto</TabsTrigger>
                </TabsList>
                <TabsContent value="mpesa" className="pt-4 space-y-4">
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <Input 
                    id="mpesaPhone" 
                    type="tel" 
                    placeholder="e.g., 0712345678" 
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    disabled={isProcessingPayment}
                  />
                  <Button onClick={() => handlePayment('M-Pesa')} className="w-full" disabled={!donationAmountHaki || parseFloat(donationAmountHaki) <=0 || isProcessingPayment}>
                    {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                    Donate with M-Pesa
                  </Button>
                </TabsContent>
                <TabsContent value="bank" className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">To donate via bank transfer, please use the following details:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside pl-2 bg-muted/50 p-3 rounded-md">
                    <li><strong>Bank Name:</strong> Equity Bank Kenya</li>
                    <li><strong>Account Name:</strong> HakiChain Donations</li>
                    <li><strong>Account Number:</strong> 0123456789012</li>
                    <li><strong>Swift Code:</strong> EQBLKENA</li>
                    <li><strong>Reference:</strong> Fund-{bounty.id.slice(-6)}</li>
                  </ul>
                   <Button onClick={() => handlePayment('Bank Transfer')} className="w-full" disabled={!donationAmountHaki || parseFloat(donationAmountHaki) <=0 || isProcessingPayment}>
                     {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                    Confirm Bank Donation
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Bank transfer processing times may vary.</p>
                </TabsContent>
                <TabsContent value="crypto" className="pt-4 space-y-4">
                  <Button variant="outline" className="w-full" disabled={isProcessingPayment}>
                    <Bitcoin className="mr-2 h-4 w-4"/>Connect Metamask (Coming Soon)
                  </Button>
                  <div>
                    <Label htmlFor="cryptoAmount">Amount in {selectedCrypto}</Label>
                    <Input 
                        id="cryptoAmount" 
                        type="number" 
                        placeholder={`e.g., 50 ${selectedCrypto}`} 
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        disabled={isProcessingPayment}
                    />
                  </div>
                   <Button onClick={() => handlePayment(`Crypto (${selectedCrypto})`)} className="w-full" disabled={!donationAmountHaki || parseFloat(donationAmountHaki) <=0 || isProcessingPayment || !cryptoAmount}>
                    {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                    Donate with Crypto
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
    

    
