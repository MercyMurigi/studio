import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockBounties } from "@/lib/data";
import Image from "next/image";
import { HeartHandshake, Users, Briefcase, DollarSign } from "lucide-react";

export default function DonorPortalPage() {
  const openBounties = mockBounties.filter(b => b.status === 'Open' || b.status === 'In Progress');

  return (
    <>
      <PageTitle 
        title="Support Pro-Bono Cases"
        description="Browse active bounties and contribute to causes you care about. Your support helps lawyers provide essential legal services."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openBounties.map(bounty => (
          <Card key={bounty.id} className="flex flex-col hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{bounty.category}</span>
                <span className="text-xs text-muted-foreground">{new Date(bounty.createdAt).toLocaleDateString()}</span>
              </div>
              <CardTitle className="font-headline text-xl">{bounty.title}</CardTitle>
              <CardDescription className="h-16 overflow-hidden text-ellipsis">{bounty.description.substring(0, 100)}...</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Users className="h-4 w-4 mr-2" /> NGO: {bounty.ngoName}
              </div>
              {bounty.lawyerName && (
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Briefcase className="h-4 w-4 mr-2" /> Lawyer: {bounty.lawyerName}
                </div>
              )}
              <div className="flex items-center text-lg font-semibold text-primary mt-2">
                <DollarSign className="h-5 w-5 mr-1" /> {bounty.amount.toLocaleString()} {bounty.currency}
                {bounty.totalRaised && bounty.totalRaised > bounty.amount && (
                  <span className="text-sm text-green-400 ml-2">(Total: {bounty.totalRaised.toLocaleString()} {bounty.currency})</span>
                )}
              </div>
               {/* Placeholder for progress bar if needed */}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full bg-primary hover:bg-primary/80" asChild>
                <Link href={`/donor/bounties/${bounty.id}`}>
                  <HeartHandshake className="mr-2 h-4 w-4" /> Fund This Case
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {openBounties.length === 0 && (
        <div className="text-center py-12">
          <Image src="https://placehold.co/300x200.png?text=No+Open+Bounties" alt="No open bounties" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="empty state illustration" />
          <p className="text-xl text-muted-foreground">There are currently no open bounties seeking funding.</p>
          <p className="text-muted-foreground">Please check back later or consider supporting HakiChain directly.</p>
          <Button className="mt-6" asChild>
            <Link href="/">Learn More About Our Mission</Link>
          </Button>
        </div>
      )}
    </>
  );
}
