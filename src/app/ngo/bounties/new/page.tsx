
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PlusCircle, Trash2, CalendarIcon, DollarSign, Coins, UploadCloud, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Bounty, Milestone } from "@/lib/types";
import { mockBounties, mockNgoProfiles } from "@/lib/data";


const HAKI_PER_USD = 10; // Conversion rate for display

const milestoneSchema = z.object({
  name: z.string().min(3, "Milestone name must be at least 3 characters."),
  description: z.string().min(10, "Milestone description must be at least 10 characters."),
  unlocksTokens: z.coerce.number().positive("Token amount must be positive."),
  dueDate: z.date().optional(),
});

const createBountyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  category: z.string().min(1, "Please select a category."),
  location: z.string().optional(),
  requiredExperience: z.string().optional(),
  overallDeadline: z.date().optional(),
  milestones: z.array(milestoneSchema).min(1, "At least one milestone is required."),
});

type CreateBountyFormData = z.infer<typeof createBountyFormSchema>;

const legalCategories = [
  "Human Rights Law",
  "Environmental Law",
  "Family Law",
  "Corporate Law",
  "Criminal Law",
  "Immigration Law",
  "Intellectual Property Law",
  "Other",
];

export default function CreateBountyPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [usdToConvert, setUsdToConvert] = useState<number | string>("");
  const [hakiEquivalent, setHakiEquivalent] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<CreateBountyFormData>({
    resolver: zodResolver(createBountyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      requiredExperience: "",
      milestones: [{ name: "", description: "", unlocksTokens: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  const milestonesWatch = watch("milestones");
  const totalBountyHaki = milestonesWatch.reduce((sum, ms) => sum + (Number(ms.unlocksTokens) || 0), 0);

  useEffect(() => {
    const numericUsd = parseFloat(String(usdToConvert));
    if (!isNaN(numericUsd) && numericUsd > 0) {
      setHakiEquivalent(numericUsd * HAKI_PER_USD);
    } else {
      setHakiEquivalent(0);
    }
  }, [usdToConvert]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(Array.from(event.target.files));
    }
  };

  const onSubmit = async (data: CreateBountyFormData) => {
    const currentNgo = mockNgoProfiles[0]; // Placeholder for current logged-in NGO
    if (!currentNgo) {
        toast({
            title: "Error Creating Bounty",
            description: "NGO profile not found. Please ensure you are logged in.",
            variant: "destructive",
        });
        return;
    }

    const newBounty: Bounty = {
      id: `bounty-${Date.now()}`,
      title: data.title,
      description: data.description,
      ngoId: currentNgo.id,
      ngoName: currentNgo.name,
      amount: totalBountyHaki,
      currency: 'HAKI',
      status: 'Open',
      category: data.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: data.overallDeadline?.toISOString(),
      milestones: data.milestones.map((ms, index) => ({
        id: `m-${Date.now()}-${index}`,
        name: ms.name,
        description: ms.description,
        status: 'Pending',
        unlocksTokens: Number(ms.unlocksTokens),
        dueDate: ms.dueDate?.toISOString(),
      })),
      location: data.location || undefined,
      requiredExperience: data.requiredExperience || undefined,
      caseFiles: uploadedFiles.map(f => ({ 
        name: f.name, 
        // In a real app, upload the file and get a URL. For now, using a placeholder.
        url: `/uploads/placeholder-${f.name.replace(/\s+/g, '_')}.pdf`, 
        uploadedAt: new Date().toISOString() 
      })),
      tags: data.category ? [data.category] : [], // Simple tagging based on category for now
    };
    
    mockBounties.unshift(newBounty); // Add to the beginning of the array for visibility

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Bounty Created Successfully!",
      description: (
        <>
          Your bounty <span className="font-semibold">&quot;{data.title}&quot;</span> has been posted.
        </>
      ),
      variant: "default",
    });
    reset();
    setUploadedFiles([]);
    setUsdToConvert("");
    router.push("/ngo/bounties");
  };

  return (
    <>
      <PageTitle
        title="Create New Bounty"
        description="Define the details of your pro-bono case and the milestones for lawyers to achieve."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Conceptual Fund Information */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Coins className="mr-2 h-6 w-6 text-primary" />Conceptual Fund Information</CardTitle>
            <CardDescription>Understand token equivalents and total bounty value. Note: Actual HAKI amount is determined by milestones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="usdToConvert">USD Amount to Conceptualize</Label>
                <Input
                  id="usdToConvert"
                  type="number"
                  placeholder="e.g., 500"
                  value={usdToConvert}
                  onChange={(e) => setUsdToConvert(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="text-lg">
                <p className="text-muted-foreground">Is roughly <span className="font-bold text-primary">{hakiEquivalent.toLocaleString()} HAKI</span></p>
                <p className="text-xs text-muted-foreground">(Rate: 1 USD = {HAKI_PER_USD} HAKI)</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Label className="text-base font-semibold">Total Bounty Value (from Milestones)</Label>
              <p className="text-3xl font-bold text-primary mt-1">{totalBountyHaki.toLocaleString()} HAKI</p>
              <p className="text-sm text-muted-foreground">~ {(totalBountyHaki / HAKI_PER_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USD</p>
            </div>
          </CardContent>
        </Card>

        {/* Bounty Details */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" />Bounty Details</CardTitle>
            <CardDescription>Provide core information about the case or legal work needed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title" className="font-semibold">Bounty Title</Label>
              <Input id="title" {...register("title")} placeholder="e.g., Legal Aid for Eviction Case" className="mt-1" />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="font-semibold">Detailed Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Describe the case, objectives, and expected outcomes..." rows={5} className="mt-1" />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="font-semibold">Legal Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="overallDeadline" className="font-semibold">Overall Bounty Deadline (Optional)</Label>
                <Controller
                    name="overallDeadline"
                    control={control}
                    render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    )}
                />
                {errors.overallDeadline && <p className="text-sm text-destructive mt-1">{errors.overallDeadline.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="font-semibold">Location (Optional)</Label>
              <Input id="location" {...register("location")} placeholder="e.g., Nairobi, Kenya or Remote" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="requiredExperience" className="font-semibold">Required Experience/Skills (Optional)</Label>
              <Textarea id="requiredExperience" {...register("requiredExperience")} placeholder="e.g., 5+ years in human rights law, fluency in Swahili..." rows={3} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Milestones</CardTitle>
                <CardDescription>Define specific tasks and token rewards for each. At least one milestone is required.</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={() => append({ name: "", description: "", unlocksTokens: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Milestone
              </Button>
            </div>
             {errors.milestones && typeof errors.milestones.message === 'string' && (
                <p className="text-sm text-destructive mt-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.milestones.message}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((item, index) => (
              <Card key={item.id} className="p-4 bg-background/50 border">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg">Milestone {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`milestones.${index}.name`}>Milestone Name</Label>
                    <Input id={`milestones.${index}.name`} {...register(`milestones.${index}.name`)} placeholder="e.g., Initial Case Filing" className="mt-1" />
                    {errors.milestones?.[index]?.name && <p className="text-sm text-destructive mt-1">{errors.milestones[index]?.name?.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor={`milestones.${index}.description`}>Description</Label>
                    <Textarea id={`milestones.${index}.description`} {...register(`milestones.${index}.description`)} placeholder="Describe the specific deliverable for this milestone" rows={3} className="mt-1" />
                    {errors.milestones?.[index]?.description && <p className="text-sm text-destructive mt-1">{errors.milestones[index]?.description?.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`milestones.${index}.unlocksTokens`}>HAKI Tokens to Unlock</Label>
                        <Input id={`milestones.${index}.unlocksTokens`} type="number" {...register(`milestones.${index}.unlocksTokens`)} placeholder="e.g., 1000" className="mt-1" />
                        {watch(`milestones.${index}.unlocksTokens`) > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                            ~ {(watch(`milestones.${index}.unlocksTokens`) / HAKI_PER_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                        )}
                        {errors.milestones?.[index]?.unlocksTokens && <p className="text-sm text-destructive mt-1">{errors.milestones[index]?.unlocksTokens?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`milestones.${index}.dueDate`}>Due Date (Optional)</Label>
                      <Controller
                        name={`milestones.${index}.dueDate`}
                        control={control}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-1",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                       {errors.milestones?.[index]?.dueDate && <p className="text-sm text-destructive mt-1">{errors.milestones[index]?.dueDate?.message}</p>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Case Files Upload */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><UploadCloud className="mr-2 h-6 w-6 text-primary" />Upload Case Files (Optional)</CardTitle>
            <CardDescription>Attach relevant documents for lawyers to review.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input id="caseFiles" type="file" multiple onChange={handleFileChange} 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium">Selected files:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {uploadedFiles.map(file => <li key={file.name}>{file.name} ({ (file.size / 1024).toFixed(2) } KB)</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <CardFooter className="flex flex-col md:flex-row justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
                Reset Form
            </Button>
            <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Creating Bounty..." : "Create Bounty"}
            </Button>
        </CardFooter>
      </form>
    </>
  );
}

    