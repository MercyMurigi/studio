"use client"

import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react"; // Using icons as placeholders for charts
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { mockAnalyticsData } from "@/lib/data";

const categoryChartConfig = {
  value: { label: "Bounties" },
  ...mockAnalyticsData.categoryDistribution.reduce((acc, cur) => {
    acc[cur.name.toLowerCase().replace(/\s+/g, '')] = {label: cur.name, color: `hsl(var(--chart-${Object.keys(acc).length + 1}))`};
    return acc;
  }, {} as Record<string, {label:string, color:string}>)
} satisfies ChartConfig;

const statusChartConfig = {
  open: { label: "Open Bounties", color: "hsl(var(--chart-1))" },
  completed: { label: "Completed Bounties", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


export default function NgoAnalyticsPage() {
  return (
    <>
      <PageTitle
        title="Bounty Performance Analytics"
        description="Track the success and impact of your pro-bono case bounties."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.totalBounties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Bounties</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.openBounties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.successRate}%</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds Distributed</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.totalFundsDistributed.toLocaleString()} HAKI</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bounty Categories</CardTitle>
            <CardDescription>Distribution of bounties by legal category.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="mx-auto aspect-square max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltipContent nameKey="value" hideLabel />
                  <Pie
                    data={mockAnalyticsData.categoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ percent, name }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {mockAnalyticsData.categoryDistribution.map((entry, index) => (
                       <YAxis key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                    ))}
                  </Pie>
                   <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounty Status Over Time</CardTitle>
            <CardDescription>Trends in open vs. completed bounties.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={statusChartConfig} className="aspect-auto h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockAnalyticsData.bountyStatusOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltipContent />
                        <Legend />
                        <Line type="monotone" dataKey="open" stroke="var(--color-open)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
