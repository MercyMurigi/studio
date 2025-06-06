
"use client"

import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, PieChartIcon as LucidePieChartIcon, BarChartIcon as LucideBarChartIcon, DollarSignIcon } from "lucide-react"; // Using icons for cards
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell, PieChart, LineChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { getAnalyticsData, mockNgoProfiles } from "@/lib/data"; // Import getAnalyticsData
import type { AnalyticsData } from "@/lib/types";
import { useEffect, useState } from "react";

export default function NgoAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [categoryChartConfig, setCategoryChartConfig] = useState<ChartConfig | null>(null);
  const [statusChartConfig, setStatusChartConfig] = useState<ChartConfig | null>(null);


  useEffect(() => {
    const currentNgo = mockNgoProfiles[0]; // Placeholder for logged-in NGO
    if (currentNgo) {
      const data = getAnalyticsData(currentNgo.id);
      setAnalyticsData(data);

      const catConfig: ChartConfig = {
        value: {
          label: "Bounties",
        },
        ...data.categoryDistribution.reduce((acc, entry, index) => {
          const key = entry.name.toLowerCase().replace(/\s+/g, "");
          acc[key] = {
            label: entry.name,
            color: `hsl(var(--chart-${index + 1}))`,
          };
          return acc;
        }, {} as Record<string, { label: string; color: string }>),
      };
      setCategoryChartConfig(catConfig);

      const statConfig: ChartConfig = {
        open: { label: "Open Bounties", color: "hsl(var(--chart-1))" },
        completed: { label: "Completed Bounties", color: "hsl(var(--chart-2))" },
      };
      setStatusChartConfig(statConfig);
    }
  }, []);

  if (!analyticsData || !categoryChartConfig || !statusChartConfig) {
    return (
      <>
        <PageTitle
          title="Bounty Performance Analytics"
          description="Track the success and impact of your pro-bono case bounties."
        />
        <div>Loading analytics data...</div>
      </>
    );
  }

  const categoryChartData = analyticsData.categoryDistribution;
  const statusChartData = analyticsData.bountyStatusOverTime;


  return (
    <>
      <PageTitle
        title="Bounty Performance Analytics"
        description="Track the success and impact of your pro-bono case bounties."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
            <LucideBarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalBounties}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Bounties</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.openBounties}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <LucidePieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.successRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
         <Card className="border-l-4 border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds Distributed</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalFundsDistributed.toLocaleString()} HAKI</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bounty Categories</CardTitle>
            <CardDescription>Distribution of bounties by legal category.</CardDescription>
          </CardHeader>
          <CardContent className="aspect-[4/3] lg:aspect-[16/9]">
            <ChartContainer config={categoryChartConfig} className="mx-auto aspect-square max-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip 
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="name" />} 
                  />
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={135}
                    innerRadius={60}
                    labelLine={false} 
                  >
                    {categoryChartData.map((entry) => (
                      <Cell key={entry.name} fill={`var(--color-${entry.name.toLowerCase().replace(/\s+/g, "")})`} />
                    ))}
                  </Pie>
                   <ChartLegend content={<ChartLegendContent nameKey="name" />} />
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
          <CardContent className="aspect-[4/3] lg:aspect-[16/9]">
             <ChartContainer config={statusChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statusChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            allowDecimals={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line 
                            type="monotone" 
                            dataKey="open" 
                            stroke="var(--color-open)" 
                            strokeWidth={2} 
                            dot={{r: 4, fill: "var(--color-open)", strokeWidth:0}} 
                            activeDot={{r: 6, strokeWidth: 0, style: { boxShadow: "0 0 5px 2px var(--color-open)"}}}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="completed" 
                            stroke="var(--color-completed)" 
                            strokeWidth={2} 
                            dot={{r: 4, fill: "var(--color-completed)", strokeWidth:0}}
                            activeDot={{r: 6, strokeWidth: 0, style: { boxShadow: "0 0 5px 2px var(--color-completed)"}}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

