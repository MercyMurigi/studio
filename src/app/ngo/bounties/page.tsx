import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { mockBounties, mockNgoProfiles } from "@/lib/data";
import type { Bounty } from "@/lib/types";
import { PlusCircle, Edit3, Trash2, Eye } from "lucide-react";

// Helper to determine badge variant based on status
const getStatusBadgeVariant = (status: Bounty['status']) => {
  switch (status) {
    case 'Open': return 'default'; // bg-primary
    case 'In Progress': return 'secondary'; // bg-secondary (gold)
    case 'Completed': return 'outline'; // Needs a success variant, using outline for now
    case 'Awaiting Review': return 'default'; // Should be a distinct color
    case 'Closed': return 'destructive';
    default: return 'default';
  }
};


export default function ManageBountiesPage() {
  const ngo = mockNgoProfiles[0]; // Assuming current NGO
  const ngoBounties = mockBounties.filter(b => b.ngoId === ngo.id);

  return (
    <>
      <PageTitle title="Manage Your Bounties" description={`View, edit, or create new pro-bono case bounties for ${ngo.name}.`}>
        <Button asChild>
          <Link href="/ngo/bounties/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Bounty
          </Link>
        </Button>
      </PageTitle>

      {ngoBounties.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No Bounties Yet</CardTitle>
            <CardDescription>You haven&apos;t created any bounties. Get started by creating one!</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/ngo/bounties/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Bounty
                </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Bounties ({ngoBounties.length})</CardTitle>
            <CardDescription>A list of all bounties you have created.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount (HAKI)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lawyer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ngoBounties.map((bounty) => (
                  <TableRow key={bounty.id}>
                    <TableCell className="font-medium">{bounty.title}</TableCell>
                    <TableCell>{bounty.category}</TableCell>
                    <TableCell>{bounty.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bounty.status)}>{bounty.status}</Badge>
                    </TableCell>
                    <TableCell>{bounty.lawyerName || 'Unassigned'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="ghost" size="icon" asChild title="View Details">
                        <Link href={`/ngo/bounties/${bounty.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Edit Bounty">
                        <Link href={`/ngo/bounties/edit/${bounty.id}`}><Edit3 className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete Bounty">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
