import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { PageTitle } from "@/components/shared/PageTitle";
import { mockLawyerProfiles, mockBounties, mockSuggestedCases } from "@/lib/data";
import { Search, Briefcase, Bot, CheckCircle } from "lucide-react";

export default function LawyerDashboardPage() {
  const lawyer = mockLawyerProfiles[0]; // Assuming current lawyer
  const claimedBounties = mockBounties.filter(b => b.lawyerId === lawyer.id);
  const completedMilestones = claimedBounties.reduce((acc, bounty) => 
    acc + bounty.milestones.filter(m => m.status === 'Approved').length, 0
  );

  const stats = [
    { title: "Claimed Cases", value: claimedBounties.length, icon: <Briefcase className="h-6 w-6 text-muted-foreground" />, link: "/lawyer/my-cases" },
    { title: "Completed Milestones", value: completedMilestones, icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />, link: "/lawyer/my-cases" },
    { title: "Suggested Cases", value: mockSuggestedCases.length, icon: <Bot className="h-6 w-6 text-muted-foreground" />, link: "/lawyer/match" },
  ];

  return (
    <>
      <PageTitle title={`Welcome back, ${lawyer.name}!`} description="Manage your pro-bono work and find new opportunities.">
        <Button asChild>
          <Link href="/lawyer/cases">
            <Search className="mr-2 h-4 w-4" /> Browse Available Cases
          </Link>
        </Button>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link href={stat.link} className="text-xs text-muted-foreground hover:text-primary">
                View Details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Cases ({claimedBounties.filter(c => c.status === 'In Progress').length})</CardTitle>
            <CardDescription>Your currently active pro-bono cases.</CardDescription>
          </CardHeader>
          <CardContent>
            {claimedBounties.filter(c => c.status === 'In Progress').length > 0 ? (
              <ul className="space-y-3">
                {claimedBounties.filter(c => c.status === 'In Progress').slice(0, 3).map(bounty => (
                  <li key={bounty.id} className="flex justify-between items-center">
                    <div>
                      <Link href={`/lawyer/my-cases/${bounty.id}`} className="font-medium hover:underline">{bounty.title}</Link>
                      <p className="text-sm text-muted-foreground">Next Milestone: {bounty.milestones.find(m => m.status === 'Pending')?.name || 'All completed'}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/lawyer/my-cases/${bounty.id}`}>Manage</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No active cases. <Link href="/lawyer/cases" className="text-primary hover:underline">Find a case</Link> to get started.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Suggested Matches</CardTitle>
            <CardDescription>Cases recommended for you by our AI.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockSuggestedCases.length > 0 ? (
               <ul className="space-y-3">
                {mockSuggestedCases.slice(0, 3).map(suggestion => (
                  <li key={suggestion.caseId} className="flex justify-between items-center">
                    <div>
                      <Link href={`/lawyer/cases/${suggestion.caseId}`} className="font-medium hover:underline">{suggestion.caseName}</Link>
                      <p className="text-sm text-muted-foreground truncate max-w-xs" title={suggestion.matchReason}>{suggestion.matchReason}</p>
                    </div>
                     <Button variant="outline" size="sm" asChild>
                      <Link href={`/lawyer/cases/${suggestion.caseId}`}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No AI suggestions at the moment. Ensure your profile is up-to-date.</p>
            )}
            <Button variant="link" asChild className="mt-4 p-0">
              <Link href="/lawyer/match">See all AI Matches <Bot className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
