
"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockNgoProfiles, mockWalletTransactions, HAKI_CONVERSION_RATE } from "@/lib/data";
import type { WalletTransaction, NgoProfile } from "@/lib/types";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, Repeat, DollarSign, Coins } from "lucide-react";

export default function NgoWalletPage() {
  const { toast } = useToast();
  const [currentNgo, setCurrentNgo] = useState<NgoProfile | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    // Simulate fetching current NGO profile and their transactions
    const ngo = mockNgoProfiles[0]; // Assuming the first NGO is the logged-in one
    setCurrentNgo(ngo);
    // In a real app, transactions would be filtered by ngo.id
    setTransactions(mockWalletTransactions.slice(0, 5)); // Displaying a subset for brevity
  }, []);

  const handleActionPlaceholder = (actionName: string) => {
    toast({
      title: `${actionName} Action`,
      description: `The "${actionName.toLowerCase()}" functionality is coming soon!`,
      variant: "default",
    });
  };

  const getTransactionStatusBadge = (status: WalletTransaction['status']) => {
    switch (status) {
      case 'Completed': return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Completed</Badge>;
      case 'Pending': return <Badge variant="secondary">Pending</Badge>;
      case 'Failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatHakiAmount = (amount: number) => {
    const prefix = amount > 0 ? "+" : "";
    return `${prefix}${amount.toLocaleString()} HAKI`;
  };

  if (!currentNgo) {
    return (
      <PageTitle title="Loading Wallet..." />
    );
  }

  const balanceHaki = currentNgo.walletBalanceHaki || 0;
  const balanceUsdEquivalent = balanceHaki / HAKI_CONVERSION_RATE;

  return (
    <>
      <PageTitle
        title={`${currentNgo.name} Wallet`}
        description="Manage your HAKI token balance, view transactions, and perform wallet operations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <WalletIcon className="mr-3 h-8 w-8 text-primary" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-4xl font-bold text-primary">{balanceHaki.toLocaleString()} HAKI</p>
            <p className="text-md text-muted-foreground flex items-center">
              <DollarSign className="mr-1 h-4 w-4" /> 
              Approximately ${balanceUsdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </p>
            <p className="text-xs text-muted-foreground">(1 USD = {HAKI_CONVERSION_RATE} HAKI)</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Coins className="mr-3 h-8 w-8 text-primary" />
              Wallet Actions
            </CardTitle>
            <CardDescription>Perform common wallet operations. Full functionality coming soon.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleActionPlaceholder("Deposit Funds")} 
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
            >
              <ArrowDownToLine className="mr-2 h-5 w-5" /> Deposit
            </Button>
            <Button 
              onClick={() => handleActionPlaceholder("Withdraw Funds")} 
              variant="outline" 
              className="w-full py-6 text-lg"
            >
              <ArrowUpFromLine className="mr-2 h-5 w-5" /> Withdraw
            </Button>
            <Button 
              onClick={() => handleActionPlaceholder("Swap Tokens")} 
              variant="secondary" 
              className="w-full py-6 text-lg"
            >
              <Repeat className="mr-2 h-5 w-5" /> Swap
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Recent Transactions</CardTitle>
          <CardDescription>Showing your last {transactions.length} transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={tx.amountHaki < 0 ? "destructive" : "default"} className={tx.amountHaki < 0 ? "" : "bg-green-100 text-green-800 border-green-300"}>
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={tx.description}>{tx.description}</TableCell>
                      <TableCell className={`text-right font-medium ${tx.amountHaki < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {formatHakiAmount(tx.amountHaki)}
                      </TableCell>
                      <TableCell className="text-center">{getTransactionStatusBadge(tx.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
