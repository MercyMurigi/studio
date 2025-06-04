
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PageTitle } from "@/components/shared/PageTitle";
import { mockBounties, mockNgoProfiles } from "@/lib/data";
import { PlusCircle, BarChart3, FileText, DollarSign, Users } from "lucide-react";

export default function NgoDashboardPage() {
  const ngo = mockNgoProfiles[0]; // Assuming current NGO is the first one
  const ngoBounties = mockBounties.filter(b => b.ngoId === ngo.id);
  const openBounties = ngoBounties.filter(b => b.status === 'Open').length;
  const inProgressBounties = ngoBounties.filter(b => b.status === 'In Progress').length;
  const totalFundsPosted = ngoBounties.reduce((sum, b) => sum + b.amount, 0);

  const stats = [
    { title: "Total Bounties", value: ngoBounties.length, icon: <FileText className="h-6 w-6 text-primary" /> },
    { title: "Open Bounties", value: openBounties, icon: <PlusCircle className="h-6 w-6 text-primary" /> },
    { title: "Bounties In Progress", value: inProgressBounties, icon: <Users className="h-6 w-6 text-primary" /> },
    { title: "Total Funds Posted", value: `${totalFundsPosted.toLocaleString()} HAKI`, icon: <DollarSign className="h-6 w-6 text-primary" /> },
  ];

  return (
    <>
      <PageTitle title={`Welcome, ${ngo.name}!`} description="Here's an overview of your activities on HakiChain.">
        <Button asChild>
          <Link href="/ngo/bounties/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Bounty
          </Link>
        </Button>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/ngo/bounties"><FileText className="mr-2 h-4 w-4" /> View All Bounties</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/ngo/analytics"><BarChart3 className="mr-2 h-4 w-4" /> View Detailed Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bounties ({ngoBounties.slice(0,3).length})</CardTitle>
            <CardDescription>A quick look at your latest bounties.</CardDescription>
          </CardHeader>
          <CardContent>
            {ngoBounties.length === 0 ? (
              <p className="text-muted-foreground">No bounties created yet.</p>
            ) : (
              <ul className="space-y-3">
                {ngoBounties.slice(0, 3).map(bounty => (
                  <li key={bounty.id} className="flex justify-between items-center">
                    <div>
                      <Link href={`/ngo/bounties/${bounty.id}`} className="font-medium hover:underline">{bounty.title}</Link>
                      <p className="text-sm text-muted-foreground">{bounty.status} - {bounty.amount} {bounty.currency}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/ngo/bounties/${bounty.id}`}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

