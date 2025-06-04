
import type { Bounty, LawyerProfile, NgoProfile, DonorProfile, AnalyticsData, AISuggestedCase } from './types';

export const mockNgoProfiles: NgoProfile[] = [
  {
    id: 'ngo-1',
    name: 'Justice First Initiative',
    email: 'contact@justicefirst.org',
    description: 'Dedicated to providing legal aid for human rights violations.',
    website: 'https://justicefirst.org',
    focusAreas: ['Human Rights', 'Civil Liberties'],
    logoUrl: 'https://placehold.co/100x100.png?text=JFI',
  },
  {
    id: 'ngo-2',
    name: 'EcoLegal Defenders',
    email: 'info@ecolegal.org',
    description: 'Protecting environmental rights through legal advocacy.',
    website: 'https://ecolegal.org',
    focusAreas: ['Environmental Law', 'Climate Justice'],
    logoUrl: 'https://placehold.co/100x100.png?text=ELD',
  },
];

export const mockLawyerProfiles: LawyerProfile[] = [
  {
    id: 'lawyer-1',
    name: 'Aisha Khan',
    email: 'aisha.khan@email.com',
    specialization: ['Human Rights Law', 'Refugee Law'],
    experienceYears: 7,
    bio: 'Passionate human rights lawyer with extensive experience in international courts.',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=AK',
    availability: 'Part-time',
  },
  {
    id: 'lawyer-2',
    name: 'Ben Carter',
    email: 'ben.carter@email.com',
    specialization: ['Environmental Law', 'Corporate Accountability'],
    experienceYears: 5,
    bio: 'Environmental lawyer focused on holding corporations accountable for ecological damage.',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=BC',
    availability: 'Flexible',
  },
  {
    id: 'lawyer-3',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    specialization: ['Family Law', 'Child Protection'],
    experienceYears: 10,
    bio: 'Experienced family lawyer dedicated to protecting the rights of children and vulnerable families.',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=MR',
    availability: 'Full-time',
  },
];

export const mockBounties: Bounty[] = [
  {
    id: 'bounty-1',
    title: 'Defend Right to Protest - City Square Case',
    description: 'Seeking legal representation for individuals arrested during a peaceful protest concerning housing rights. Key tasks include bail applications and challenging the legality of arrests.',
    ngoId: 'ngo-1',
    ngoName: 'Justice First Initiative',
    amount: 5000,
    currency: 'HAKI',
    status: 'Open',
    category: 'Human Rights Law',
    createdAt: '2024-07-15T10:00:00Z',
    updatedAt: '2024-07-15T10:00:00Z',
    deadline: '2024-09-30T10:00:00Z',
    milestones: [
      { id: 'm1-1', name: 'Initial Case Review & Client Intake', description: 'Review case files, interview clients.', status: 'Pending', unlocksTokens: 500, dueDate: '2024-07-30T10:00:00Z' },
      { id: 'm1-2', name: 'Bail Application Filed', description: 'Prepare and file bail applications.', status: 'Pending', unlocksTokens: 1500, dueDate: '2024-08-15T10:00:00Z' },
      { id: 'm1-3', name: 'Court Appearance for Bail Hearing', description: 'Attend hearing and argue for bail.', status: 'Pending', unlocksTokens: 1500, proof: undefined, dueDate: '2024-08-30T10:00:00Z'},
      { id: 'm1-4', name: 'Challenge Legality of Arrest', description: 'File motion challenging arrest legality.', status: 'Pending', unlocksTokens: 1500, proof: undefined, dueDate: '2024-09-15T10:00:00Z'}
    ],
    tags: ['Protest Rights', 'Civil Liberties', 'Freedom of Assembly'],
    location: 'Capital City',
    requiredExperience: '3+ years in human rights litigation',
    totalRaised: 5000,
    caseFiles: [{name: "Initial Police Report.pdf", url: "/placeholder-doc.pdf", uploadedAt: "2024-07-15T10:00:00Z"}]
  },
  {
    id: 'bounty-2',
    title: 'Stop Illegal Deforestation - Green Valley Project',
    description: 'Legal action needed to halt illegal logging activities in the protected Green Valley area. Requires filing for an injunction and potentially pursuing damages.',
    ngoId: 'ngo-2',
    ngoName: 'EcoLegal Defenders',
    amount: 7500,
    currency: 'HAKI',
    status: 'Open',
    category: 'Environmental Law',
    createdAt: '2024-07-20T14:30:00Z',
    updatedAt: '2024-07-20T14:30:00Z',
    deadline: '2024-10-31T14:30:00Z',
    milestones: [
      { id: 'm2-1', name: 'Gather Evidence & Witness Statements', description: 'Collect photographic evidence, expert reports, and witness testimonies.', status: 'Pending', unlocksTokens: 1000, dueDate: '2024-08-10T14:30:00Z' },
      { id: 'm2-2', name: 'File for Injunction', description: 'Draft and file court documents for an immediate injunction.', status: 'Pending', unlocksTokens: 2500, dueDate: '2024-08-30T14:30:00Z' },
      { id: 'm2-3', name: 'Injunction Hearing Appearance', description: 'Represent the case at the injunction hearing.', status: 'Pending', unlocksTokens: 2000, proof: undefined, dueDate: '2024-09-15T14:30:00Z'},
      { id: 'm2-4', name: 'Prepare for Full Trial (if needed)', description: 'Develop case strategy and prepare for full trial proceedings.', status: 'Pending', unlocksTokens: 2000, proof: undefined, dueDate: '2024-10-15T14:30:00Z'}
    ],
    tags: ['Deforestation', 'Conservation', 'Environmental Litigation'],
    location: 'Green Valley Region',
    requiredExperience: '5+ years in environmental law, experience with injunctions',
    totalRaised: 7500,
  },
   {
    id: 'bounty-3',
    title: 'Child Custody Dispute for Refugee Family',
    description: 'A refugee family requires legal assistance in a complex child custody case. The lawyer will need to navigate international family law and refugee protection issues.',
    ngoId: 'ngo-1',
    ngoName: 'Justice First Initiative',
    amount: 6000,
    currency: 'HAKI',
    status: 'In Progress',
    lawyerId: 'lawyer-3',
    lawyerName: 'Maria Rodriguez',
    category: 'Family Law',
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-07-22T11:00:00Z',
    deadline: '2024-12-31T09:00:00Z',
    milestones: [
      { id: 'm3-1', name: 'Client Consultation and Case Assessment', description: 'Detailed consultation with the family and assessment of legal options.', status: 'Approved', unlocksTokens: 1000, submittedAt: "2024-06-15T10:00:00Z", approvedAt: "2024-06-18T10:00:00Z", proof: "Client_Intake_Form.pdf" },
      { id: 'm3-2', name: 'Drafting and Filing Custody Application', description: 'Prepare and submit all necessary court documents for the custody application.', status: 'Submitted', unlocksTokens: 2000, submittedAt: "2024-07-20T10:00:00Z", proof: "Custody_Application_Submitted.pdf" },
      { id: 'm3-3', name: 'Mediation Session Attendance', description: 'Represent the family in mediation sessions.', status: 'Pending', unlocksTokens: 1500, proof: undefined },
      { id: 'm3-4', name: 'Court Hearing Representation', description: 'Represent the family in all court hearings related to the custody dispute.', status: 'Pending', unlocksTokens: 1500, proof: undefined }
    ],
    tags: ['Child Custody', 'Refugee Rights', 'International Family Law'],
    location: 'Capital City',
    requiredExperience: 'Specialization in family law, experience with refugee cases preferred',
    totalRaised: 6500,
    donorContributions: [
      { donorId: 'donor-1', donorName: 'Anonymous Donor', amount: 500, currency: 'HAKI', timestamp: '2024-06-10T12:00:00Z' }
    ]
  }
];

export const mockDonorProfiles: DonorProfile[] = [
  {
    id: 'donor-1',
    name: 'Anonymous Philanthropist',
  },
  {
    id: 'donor-2',
    name: 'Community Support Fund',
    email: 'csf@support.org',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=CSF',
  },
];

export const mockAnalyticsData: AnalyticsData = {
  totalBounties: mockBounties.length, // Dynamically calculate based on current bounties
  openBounties: mockBounties.filter(b => b.status === 'Open').length,
  completedBounties: mockBounties.filter(b => b.status === 'Completed').length,
  totalFundsDistributed: mockBounties.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.amount, 0), // in HAKI
  averageCompletionTime: "45 days", // This would need more complex calculation
  successRate: mockBounties.length > 0 ? (mockBounties.filter(b => b.status === 'Completed').length / mockBounties.length) * 100 : 0, // percentage
  categoryDistribution: [
    { name: "Human Rights", value: mockBounties.filter(b => b.category === "Human Rights Law").length },
    { name: "Environmental", value: mockBounties.filter(b => b.category === "Environmental Law").length },
    { name: "Family Law", value: mockBounties.filter(b => b.category === "Family Law").length },
    { name: "Other", value: mockBounties.filter(b => !["Human Rights Law", "Environmental Law", "Family Law"].includes(b.category)).length },
  ],
  bountyStatusOverTime: [ // This mock data would need to be generated dynamically in a real app
    { date: "Jan", open: 5, completed: 2 },
    { date: "Feb", open: 7, completed: 3 },
    { date: "Mar", open: 8, completed: 5 },
    { date: "Apr", open: 10, completed: 7 },
    { date: "May", open: 12, completed: 9 },
    { date: "Jun", open: mockBounties.filter(b => b.status === 'Open').length, completed: mockBounties.filter(b => b.status === 'Completed').length },
  ],
};

export const mockSuggestedCases: AISuggestedCase[] = [
    {
        caseId: 'bounty-1',
        caseName: 'Defend Right to Protest - City Square Case',
        caseDescription: 'Seeking legal representation for individuals arrested during a peaceful protest concerning housing rights.',
        matchReason: 'Matches your expertise in Human Rights Law and experience with civil liberties cases. The required 3+ years experience aligns with your profile.',
        ngoName: 'Justice First Initiative',
        bountyAmount: 5000,
        currency: 'HAKI',
    },
    {
        caseId: 'bounty-x', // Assume another bounty exists
        caseName: 'Indigenous Land Rights Claim',
        caseDescription: 'Legal support needed for an indigenous community to file a land rights claim against encroachment by a large agricultural firm.',
        matchReason: 'Your background in Human Rights Law and reported interest in indigenous rights makes this a strong potential match.',
        ngoName: 'Global Rights Watch',
        bountyAmount: 8000,
        currency: 'HAKI',
    }
];

    