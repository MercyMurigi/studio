
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    console.log("Login data:", data);

    toast({
      title: "Login Successful!",
      description: "Welcome back! Redirecting you to your dashboard...",
      variant: "default",
    });

    let userRole: string | null = null;
    if (typeof window !== "undefined") {
      userRole = localStorage.getItem("userRoleForLogin");
      localStorage.removeItem("userRoleForLogin"); // Clear it after use
    }

    if (userRole === "ngo") {
      router.push('/ngo');
    } else if (userRole === "lawyer") {
      router.push('/lawyer');
    } else if (userRole === "donor") {
      router.push('/donor');
    } else {
      // Fallback if role not found in localStorage or doesn't match
      // For safety, or if direct login, could still use email heuristic as a secondary check or just go to home
      if (data.email.toLowerCase().includes("ngo@")) {
        router.push('/ngo');
      } else if (data.email.toLowerCase().includes("lawyer@")) {
        router.push('/lawyer');
      } else if (data.email.toLowerCase().includes("donor@")) {
        router.push('/donor');
      } else {
        router.push('/');
      }
    }
    form.reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-headline">Login to HakiChain</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button variant="link" asChild className="p-0 text-primary">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </p>
             <p className="mt-4 text-center text-xs text-muted-foreground">
              (Login is simulated. Redirection preference is based on role selected during last signup, then email content as fallback: e.g., 'ngo@...', 'lawyer@...', 'donor@...')
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
