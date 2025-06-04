
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
  },
  {
    id: 'bounty-4',
    title: 'Legal Aid for Unfair Dismissal',
    description: 'Provide legal counsel and representation for an individual claiming unfair dismissal from their employer. Involves negotiation and potential tribunal hearing.',
    ngoId: 'ngo-1',
    ngoName: 'Justice First Initiative',
    amount: 4000,
    currency: 'HAKI',
    status: 'Completed', 
    lawyerId: 'lawyer-1',
    lawyerName: 'Aisha Khan',
    category: 'Employment Law',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-05-15T11:00:00Z',
    deadline: '2024-05-30T09:00:00Z',
    milestones: [
      { id: 'm4-1', name: 'Case Review and Advice', description: 'Review documents, advise client on merits.', status: 'Approved', unlocksTokens: 800, approvedAt: "2024-03-10T10:00:00Z" },
      { id: 'm4-2', name: 'Negotiation with Employer', description: 'Attempt to negotiate a settlement.', status: 'Approved', unlocksTokens: 1200, approvedAt: "2024-04-05T10:00:00Z" },
      { id: 'm4-3', name: 'Prepare Tribunal Documents', description: 'Draft and file documents for employment tribunal.', status: 'Approved', unlocksTokens: 1000, approvedAt: "2024-04-25T10:00:00Z"},
      { id: 'm4-4', name: 'Tribunal Hearing & Resolution', description: 'Represent client at hearing or finalize settlement.', status: 'Approved', unlocksTokens: 1000, approvedAt: "2024-05-15T10:00:00Z"}
    ],
    tags: ['Employment Law', 'Unfair Dismissal', 'Worker Rights'],
    location: 'Remote',
    requiredExperience: 'Experience in employment law and tribunal advocacy',
    totalRaised: 4000,
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

// Function to get dynamic analytics data based on current mockBounties
export const getAnalyticsData = (ngoId?: string): AnalyticsData => {
  const relevantBounties = ngoId
    ? mockBounties.filter(b => b.ngoId === ngoId)
    : mockBounties;

  const totalBounties = relevantBounties.length;
  const openBounties = relevantBounties.filter(b => b.status === 'Open').length;
  const completedBounties = relevantBounties.filter(b => b.status === 'Completed').length;
  const totalFundsDistributed = relevantBounties
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + b.amount, 0);
  
  const successfulBounties = relevantBounties.filter(b => b.status === 'Completed');
  const successRate = totalBounties > 0 ? (successfulBounties.length / totalBounties) * 100 : 0;


  const categories = [...new Set(relevantBounties.map(b => b.category))];
  const categoryDistribution = categories.map(cat => ({
    name: cat,
    value: relevantBounties.filter(b => b.category === cat).length,
  })).filter(cd => cd.value > 0); // Ensure no zero-value categories if NGO has none in a global category

  // Simplified mock data for bounty status over time
  // In a real app, this would come from historical data related to the specific NGO
  const bountyStatusOverTime = [
    { date: "Jan '24", open: ngoId ? Math.floor(Math.random() * 3) + 1 : 5, completed: ngoId ? Math.floor(Math.random() * 2) : 2 },
    { date: "Feb '24", open: ngoId ? Math.floor(Math.random() * 4) + 1 : 7, completed: ngoId ? Math.floor(Math.random() * 2) + 1 : 3 },
    { date: "Mar '24", open: ngoId ? Math.floor(Math.random() * 5) + 2 : 8, completed: ngoId ? Math.floor(Math.random() * 3) + 1 : 5 },
    { date: "Apr '24", open: ngoId ? Math.floor(Math.random() * 6) + 2 : 10, completed: ngoId ? Math.floor(Math.random() * 4) + 2 : 7 },
    { date: "May '24", open: ngoId ? Math.floor(Math.random() * 5) + 3 : 12, completed: ngoId ? Math.floor(Math.random() * 4) + 3 : 9 },
    { date: "Jun '24", open: openBounties, completed: completedBounties},
  ];


  return {
    totalBounties,
    openBounties,
    completedBounties,
    totalFundsDistributed,
    averageCompletionTime: "45 days", // Static for now, could be calculated from relevantBounties
    successRate,
    categoryDistribution,
    bountyStatusOverTime,
  };
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
        caseId: 'bounty-x', 
        caseName: 'Indigenous Land Rights Claim',
        caseDescription: 'Legal support needed for an indigenous community to file a land rights claim against encroachment by a large agricultural firm.',
        matchReason: 'Your background in Human Rights Law and reported interest in indigenous rights makes this a strong potential match.',
        ngoName: 'Global Rights Watch', // Different NGO for variety
        bountyAmount: 8000,
        currency: 'HAKI',
    }
];
