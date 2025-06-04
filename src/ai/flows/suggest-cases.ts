'use server';

/**
 * @fileOverview Suggests cases matching a lawyer's expertise.
 *
 * - suggestCases - A function that suggests cases based on a lawyer's expertise.
 * - SuggestCasesInput - The input type for the suggestCases function.
 * - SuggestCasesOutput - The return type for the suggestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCasesInputSchema = z.object({
  lawyerProfile: z
    .string()
    .describe('A description of the lawyer profile, including areas of specialization.'),
  caseDetails: z.string().describe('Details of available pro-bono cases.'),
});
export type SuggestCasesInput = z.infer<typeof SuggestCasesInputSchema>;

const SuggestedCaseSchema = z.object({
  caseName: z.string().describe('The name or title of the suggested case.'),
  caseDescription: z.string().describe('A brief description of the suggested case.'),
  matchReason: z
    .string()
    .describe('The reason why this case is a good match for the lawyer.'),
});

const SuggestCasesOutputSchema = z.array(SuggestedCaseSchema).describe('List of suggested cases for the lawyer.');
export type SuggestCasesOutput = z.infer<typeof SuggestCasesOutputSchema>;

export async function suggestCases(input: SuggestCasesInput): Promise<SuggestCasesOutput> {
  return suggestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCasesPrompt',
  input: {schema: SuggestCasesInputSchema},
  output: {schema: SuggestCasesOutputSchema},
  prompt: `You are an AI assistant helping to match lawyers with pro-bono cases that fit their expertise.

Given the following lawyer profile:
{{{lawyerProfile}}}

And the following case details:
{{{caseDetails}}}

Suggest cases that would be a good fit for the lawyer. Explain why each case is a good match.  The caseName and caseDescription should come directly from the caseDetails, do not invent new ones.  Ensure that caseName and caseDescription are not truncated.`,
});

const suggestCasesFlow = ai.defineFlow(
  {
    name: 'suggestCasesFlow',
    inputSchema: SuggestCasesInputSchema,
    outputSchema: SuggestCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
