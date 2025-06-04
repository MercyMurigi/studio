"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for signup logic
    alert("Signup functionality not implemented yet.");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
            <CardDescription>Join HakiChain Advocate to make a difference.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngo">NGO Representative</SelectItem>
                    <SelectItem value="lawyer">Lawyer</SelectItem>
                    <SelectItem value="donor">Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign Up
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" asChild className="p-0 text-primary">
                <Link href="/auth/login">Login</Link>
              </Button>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
