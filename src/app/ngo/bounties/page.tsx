
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { mockBounties, mockNgoProfiles } from "@/lib/data";
import type { Bounty } from "@/lib/types";
import { PlusCircle, Edit3, Trash2, Eye, Users } from "lucide-react";

// Helper to determine badge variant based on status
const getStatusBadgeVariant = (status: Bounty['status']) => {
  switch (status) {
    case 'Open': return 'default'; // bg-primary
    case 'In Progress': return 'secondary'; 
    case 'Completed': return 'default'; // Should be a success variant, using default for now
    case 'Awaiting Review': return 'default'; // Could be 'outline' or a specific color
    case 'Closed': return 'destructive';
    default: return 'default';
  }
};

const getStatusBadgeClass = (status: Bounty['status']) => {
  switch (status) {
    case 'Open': return 'bg-primary hover:bg-primary/90';
    case 'In Progress': return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'Completed': return 'bg-green-600 hover:bg-green-700 text-white';
    case 'Awaiting Review': return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'Closed': return 'bg-slate-500 hover:bg-slate-600 text-white';
    default: return 'bg-primary hover:bg-primary/90';
  }
}


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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ngoBounties.map((bounty) => (
                  <TableRow key={bounty.id}>
                    <TableCell className="font-medium">{bounty.title}</TableCell>
                    <TableCell>{bounty.category}</TableCell>
                    <TableCell>{bounty.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(bounty.status)}>{bounty.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {bounty.lawyerName ? (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {bounty.lawyerName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                       <Button variant="outline" size="sm" asChild title="View Details">
                        <Link href={`/ngo/bounties/${bounty.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Edit Bounty (Placeholder)">
                        {/* Link should eventually go to an edit page e.g. /ngo/bounties/edit/${bounty.id} */}
                        <Link href="#"><Edit3 className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete Bounty (Placeholder)">
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
