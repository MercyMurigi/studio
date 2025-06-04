import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Gavel, Users, Briefcase, HeartHandshake, TrendingUp, FileText, Bot } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "NGO Management",
      description: "Onboard, fund bounties for pro-bono cases, and view analytics on bounty success rates.",
      link: "/ngo",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: "Lawyer Portal",
      description: "Browse available cases, claim bounties, and upload documents to prove milestones are met.",
      link: "/lawyer",
    },
    {
      icon: <HeartHandshake className="h-10 w-10 text-primary" />,
      title: "Donor Contributions",
      description: "Independent donors can view existing bounties and contribute funds to specific cases.",
      link: "/donor",
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: "Intelligent Matching",
      description: "AI tool analyzes lawyer profiles and case details to suggest suitable matches.",
      link: "/lawyer/match",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Milestone Tracking",
      description: "Tokens unlocked as lawyers upload proof of work for each milestone.",
      link: "/lawyer/my-cases",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: "Performance Analytics",
      description: "NGOs get visual data on bounty performance, lawyer success rates, and case outcomes.",
      link: "/ngo/analytics",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-background to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <Gavel className="h-24 w-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              Welcome to <span className="text-primary">HakiChain Advocate</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              A revolutionary platform incentivizing lawyers for pro-bono cases, funded by NGOs and donors, powered by AI and transparency.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/ngo">For NGOs</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/lawyer">For Lawyers</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Bridging Justice and Opportunity</h2>
                <p className="text-muted-foreground mb-4">
                  HakiChain Advocate connects NGOs seeking legal support for critical pro-bono cases with skilled lawyers ready to make a difference. We leverage technology to create a transparent, efficient, and rewarding ecosystem for all participants.
                </p>
                <p className="text-muted-foreground mb-6">
                  Our platform facilitates bounty funding, AI-driven case matching, milestone-based rewards, and insightful analytics, fostering a community dedicated to expanding access to justice.
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
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Platform Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                  {/* 
                  <CardFooter className="justify-center">
                    <Button variant="link" asChild>
                      <Link href={feature.link}>Explore</Link>
                    </Button>
                  </CardFooter>
                  */}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Ready to Make an Impact?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join HakiChain Advocate today. Whether you're an NGO, a lawyer, or a donor, your participation helps build a more just world.
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
