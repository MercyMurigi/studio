

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scale, ShieldCheck, ClipboardCheck, Network } from "lucide-react";
import { JusticeAnimationBackground } from "@/components/shared/JusticeAnimationBackground";

export default function HomePage() {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Blockchain for Transparency",
      description: "Leveraging blockchain for secure and auditable tracking of funds and case progress.",
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
      title: "Milestone Tracking",
      description: "Clear progress monitoring with automated rewards as case milestones are achieved.",
    },
    {
      icon: <Network className="h-10 w-10 text-primary" />,
      title: "Unified Pro-Bono Ecosystem",
      description: "Connecting NGOs, lawyers, and donors to streamline access to justice for all.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-background to-primary/10 overflow-hidden">
          <JusticeAnimationBackground />
          <div className="container mx-auto px-4 text-center relative z-10">
            <Scale className="h-24 w-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              <span className="text-primary">HakiChain</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Incentivizing pro-bono legal work with AI-powered matching and transparent bounties.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/ngo">NGO Portal</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/lawyer">Lawyer Portal</Link>
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
                  data-ai-hint="justice collaboration"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
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

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Ready to Join?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Help us build a more just world. Register or learn more.
            </p>
            <div className="space-x-0 md:space-x-4 space-y-4 md:space-y-0 flex flex-col md:flex-row justify-center items-center">
              <Button size="lg" asChild className="w-full md:w-auto">
                <Link href="/auth/signup?role=ngo">Register as NGO</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="w-full md:w-auto">
                <Link href="/auth/signup?role=lawyer">Join as Lawyer</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full md:w-auto">
                <Link href="/donor">Support as Donor</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
