

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scale, ShieldCheck, ClipboardCheck, Network } from "lucide-react";
import { JusticeAnimationBackground } from "@/components/shared/JusticeAnimationBackground";
import React from "react";

export default function HomePage() {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-secondary" />,
      title: "Blockchain for Transparency",
      description: "Leveraging blockchain for secure and auditable tracking of funds and case progress.",
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-secondary" />,
      title: "Milestone Tracking",
      description: "Clear progress monitoring with automated rewards as case milestones are achieved.",
    },
    {
      icon: <Network className="h-10 w-10 text-secondary" />,
      title: "Unified Pro-Bono Ecosystem",
      description: "Connecting NGOs, lawyers, and donors to streamline access to justice for all.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-background to-primary/20 overflow-hidden">
          <JusticeAnimationBackground />
          <div className="container mx-auto px-4 text-center relative z-10">
            <Scale className="h-24 w-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              <span className="text-primary">Haki</span><span className="text-secondary">Chain</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-10">
              Incentivizing pro-bono legal work with AI-powered matching and transparent bounties.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="w-full md:w-auto">
                <Link href="/auth/signup?role=ngo">Access NGO Portal</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="w-full md:w-auto">
                <Link href="/auth/signup?role=lawyer">Access Lawyer Portal</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full md:w-auto">
                <Link href="/donor">Support as Donor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Justice, Connected.</h2>
                <p className="text-muted-foreground mb-4">
                  HakiChain connects NGOs, lawyers, and donors for impactful pro-bono work.
                </p>
                <p className="text-muted-foreground mb-6">
                  We use technology to create a transparent, efficient, and rewarding system for expanding access to justice.
                </p>
                <Button asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
              <div>
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Lawyers collaborating"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="legal collaboration"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
