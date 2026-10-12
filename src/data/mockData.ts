import { Customer, TimelineEvent, CallRecord, QueueItem, Task, FollowUp, KBArticle, AppNotification } from '../types';

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-10492',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@nexuscloud.io',
    phone: '+1 (555) 018-2930',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tier: 'Premium',
    status: 'VIP',
    customerSince: '2022',
    currentIssue: 'Subscription double charge on invoice #INV-8821',
    lastInteraction: 'Today at 09:14 AM (Inbound Queue)',
    openCommitments: 'Needs refund approval confirmation before 4:00 PM EST',
    notes: [
      'Long-time premium subscriber. Very cordial but tight on fiscal compliance deadlines.',
      'Prefers SMS confirmation once invoice receipts are adjusted.'
    ],
    tags: ['SaaS Pro', 'High Value', 'Quarterly Billing'],
    company: 'NexusCloud Systems',
    location: 'Austin, TX'
  },
  {
    id: 'CUST-10493',
    name: 'Daniel Brown',
    email: 'd.brown@apexlogistics.com',
    phone: '+1 (555) 234-9182',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tier: 'Enterprise',
    status: 'Active',
    customerSince: '2021',
    currentIssue: 'SAML 2.0 Single Sign-On certificate renewal failure',
    lastInteraction: 'Yesterday at 3:15 PM (Email Ticket)',
    openCommitments: 'Escalated to Tier 3 Identity Engineering team',
    notes: [
      'Primary IT admin for 450 corporate seats.',
      'Requested technical callback with an identity specialist.'
    ],
    tags: ['Enterprise Admin', 'SSO', 'Priority 1'],
    company: 'Apex Logistics Global',
    location: 'Chicago, IL'
  },
  {
    id: 'CUST-10494',
    name: 'Elena Rostova',
    email: 'elena.rostova@auroradesign.co',
    phone: '+1 (555) 781-4490',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tier: 'Premium',
    status: 'Active',
    customerSince: '2023',
    currentIssue: 'Asset sync failure on cloud storage connector',
    lastInteraction: '3 days ago (Live Chat)',
    openCommitments: 'Verify CDN cache invalidation',
    notes: [
      'Creative Director managing distributed team assets.',
      'Likes brief actionable steps.'
    ],
    tags: ['Design Team', 'Cloud Storage'],
    company: 'Aurora Design Studio',
    location: 'Seattle, WA'
  },
  {
    id: 'CUST-10495',
    name: 'Marcus Vance',
    email: 'marcus.v@hyperiontech.net',
    phone: '+1 (555) 492-3110',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'Enterprise',
    status: 'VIP',
    customerSince: '2020',
    currentIssue: 'API rate limit expansion for Black Friday testing',
    lastInteraction: 'Oct 10 at 11:30 AM (Phone Call)',
    openCommitments: 'Temporary burst quota increase approved through end of month',
    notes: [
      'Senior VP of Engineering. High strategic business value account.',
      'Always loop in account manager Rachel M.'
    ],
    tags: ['VIP Enterprise', 'API Infrastructure', 'High Volume'],
    company: 'Hyperion Technologies',
    location: 'San Francisco, CA'
  },
  {
    id: 'CUST-10496',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@solarisenergy.org',
    phone: '+1 (555) 673-8821',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    status: 'At Risk',
    customerSince: '2024',
    currentIssue: 'Cancellation request regarding onboarding delay',
    lastInteraction: 'Oct 11 at 2:00 PM (Inbound Phone)',
    openCommitments: 'Schedule 1-on-1 customer success walkthrough session',
    notes: [
      'Customer expressed frustration about documentation complexity.',
      'Offered 30-day onboarding credit if retained.'
    ],
    tags: ['At Risk', 'Retention', 'New Account'],
    company: 'Solaris Energy Labs',
    location: 'Denver, CO'
  },
  {
    id: 'CUST-10497',
    name: 'Javier Morales',
    email: 'j.morales@cantinafoods.com',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    status: 'Active',
    customerSince: '2023',
    currentIssue: 'Hardware POS terminal connection intermittent drops',
    lastInteraction: 'Oct 9 at 4:45 PM (Chat)',
    openCommitments: 'Replacement terminal unit dispatched via express shipping',
    notes: [
      'Restaurant chain operator with 8 active locations.',
      'Terminal tracking number: #1Z999999999999'
    ],
    tags: ['Retail POS', 'Hardware'],
    company: 'Cantina Foods Group',
    location: 'Miami, FL'
  },
  {
    id: 'CUST-10498',
    name: 'Priya Patel',
    email: 'priya.patel@biovista.health',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tier: 'Enterprise',
    status: 'Active',
    customerSince: '2022',
    currentIssue: 'HIPAA BAA documentation audit signature request',
    lastInteraction: 'Oct 8 at 10:15 AM (Email)',
    openCommitments: 'Legal compliance bundle delivered',
    notes: [
      'Healthcare compliance officer. Requires verified audit logs.',
      'All data requests require signed NDA reference.'
    ],
    tags: ['Healthcare', 'HIPAA', 'Enterprise Compliance'],
    company: 'BioVista Health',
    location: 'Boston, MA'
  },
  {
    id: 'CUST-10499',
    name: 'Liam Gallagher',
    email: 'liam@gallaghermedia.co.uk',
    phone: '+1 (555) 432-8765',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    tier: 'Premium',
    status: 'Active',
    customerSince: '2021',
    currentIssue: 'Video rendering queue delay on 4K multi-stream export',
    lastInteraction: 'Today at 8:50 AM (Inbound Queue)',
    openCommitments: 'Investigating GPU rendering node cluster workload',
    notes: [
      'Media production company with strict broadcast deadlines.',
      'Very pleasant when given clear technical status.'
    ],
    tags: ['Media/Video', 'High Bandwidth'],
    company: 'Gallagher Media Ltd',
    location: 'New York, NY'
  },
  {
    id: 'CUST-10500',
    name: 'Samantha Wu',
    email: 'swu@quantedge.capital',
    phone: '+1 (555) 912-4455',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tier: 'Enterprise',
    status: 'VIP',
    customerSince: '2019',
    currentIssue: 'Websocket latency spikes in London colocation region',
    lastInteraction: 'Sep 29 at 1:30 PM (Phone Call)',
    openCommitments: 'Colocation peering agreement update pending Q4',
    notes: [
      'Fintech trading desk CTO.',
      'SLA guarantee tier 1 with 99.999% uptime mandate.'
    ],
    tags: ['FinTech', 'Low Latency', 'VIP Enterprise'],
    company: 'QuantEdge Capital',
    location: 'Jersey City, NJ'
  },
  {
    id: 'CUST-10501',
    name: 'David Kalu',
    email: 'david.kalu@kaluarchitects.com',
    phone: '+1 (555) 765-2109',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    status: 'New',
    customerSince: '2024',
    currentIssue: 'License activation key transfer between workstations',
    lastInteraction: 'Oct 11 at 11:10 AM (Portal Ticket)',
    openCommitments: 'Transfer token generated and verified',
    notes: [
      'Newly migrated architectural firm.',
      'Provided step-by-step PDF manual.'
    ],
    tags: ['Architecture', 'CAD Licensing'],
    company: 'Kalu & Partners Architects',
    location: 'Atlanta, GA'
  },
  {
    id: 'CUST-10502',
    name: 'Grace Hopper-Lee',
    email: 'grace@quantumleap.ai',
    phone: '+1 (555) 887-3321',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    tier: 'Enterprise',
    status: 'VIP',
    customerSince: '2021',
    currentIssue: 'Model fine-tuning endpoint authentication timeout',
    lastInteraction: 'Oct 10 at 4:20 PM (Phone Call)',
    openCommitments: 'Follow-up regarding token lifetime settings',
    notes: [
      'AI Research Institute Lead. Dedicated support pod member.',
      'High priority customer.'
    ],
    tags: ['AI/ML', 'VIP Enterprise'],
    company: 'QuantumLeap AI Labs',
    location: 'Palo Alto, CA'
  }
];

export const initialQueueItems: QueueItem[] = [
  {
    id: 'Q-901',
    customerId: 'CUST-10492',
    customerName: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    issue: 'Billing discrepancy - duplicate invoice charge #INV-8821',
    category: 'Billing',
    priority: 'High',
    waitTime: '02:14',
    waitSeconds: 134,
    channel: 'Phone',
    status: 'Waiting'
  },
  {
    id: 'Q-902',
    customerId: 'CUST-10493',
    customerName: 'Daniel Brown',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    issue: 'Account access & SAML 2.0 Single Sign-on locked out',
    category: 'Account',
    priority: 'Medium',
    waitTime: '01:03',
    waitSeconds: 63,
    channel: 'Phone',
    status: 'Waiting'
  },
  {
    id: 'Q-903',
    customerId: 'CUST-10499',
    customerName: 'Liam Gallagher',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    issue: '4K video rendering cluster pipeline blocked',
    category: 'Technical Support',
    priority: 'Critical',
    waitTime: '03:45',
    waitSeconds: 225,
    channel: 'VIP Inbound',
    status: 'Waiting'
  },
  {
    id: 'Q-904',
    customerId: 'CUST-10496',
    customerName: 'Chloe Bennett',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    issue: 'Retention risk: onboarding guidance requested',
    category: 'Account',
    priority: 'High',
    waitTime: '00:48',
    waitSeconds: 48,
    channel: 'Web Callback',
    status: 'Waiting'
  },
  {
    id: 'Q-905',
    customerId: 'CUST-10494',
    customerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    issue: 'Asset sync failure on cloud storage connector',
    category: 'Technical Support',
    priority: 'Medium',
    waitTime: '01:22',
    waitSeconds: 82,
    channel: 'Phone',
    status: 'Waiting'
  }
];

export const initialTimelineEvents: Record<string, TimelineEvent[]> = {
  'CUST-10492': [
    {
      id: 'TL-101',
      customerId: 'CUST-10492',
      timestamp: 'Today, 10:32 AM',
      relativeDate: 'Today',
      type: 'Phone Call',
      summary: 'Billing issue discussed regarding #INV-8821',
      details: 'Customer explained automatic charge occurred twice after renewal failure. Verified charge ID in Stripe gateway. Initiated refund workflow.',
      staffMember: 'Alex Mercer',
      sentiment: 'Frustrated',
      duration: '06:12'
    },
    {
      id: 'TL-102',
      customerId: 'CUST-10492',
      timestamp: 'Yesterday, 3:15 PM',
      relativeDate: 'Yesterday',
      type: 'Email',
      summary: 'Automated receipt and tax invoice sent',
      details: 'System dispatched monthly subscription statement for 25 seats. Triggered billing webhook.',
      staffMember: 'Billing Bot',
      sentiment: 'Neutral'
    },
    {
      id: 'TL-103',
      customerId: 'CUST-10492',
      timestamp: 'Sep 21, 11:42 AM',
      relativeDate: '3 weeks ago',
      type: 'Phone Call',
      summary: 'Plan upgrade requested: Standard to Premium tier',
      details: 'Customer finalized expansion for Q4. Walked through premium SLA benefits and dedicated onboarding session.',
      staffMember: 'Jordan Hayes',
      sentiment: 'Positive',
      duration: '11:20'
    },
    {
      id: 'TL-104',
      customerId: 'CUST-10492',
      timestamp: 'Aug 14, 2:10 PM',
      relativeDate: '2 months ago',
      type: 'Chat',
      summary: 'Inquired about multi-currency payment options',
      details: 'Explained SEPA and wire transfer support for European branches. Shared KB guide KB-402.',
      staffMember: 'Samira Khan',
      sentiment: 'Neutral'
    }
  ],
  'CUST-10493': [
    {
      id: 'TL-201',
      customerId: 'CUST-10493',
      timestamp: 'Yesterday, 4:20 PM',
      relativeDate: 'Yesterday',
      type: 'Email',
      summary: 'SAML IdP metadata certificate renewed',
      details: 'Customer sent public x509 cert. Checked SHA-256 fingerprint. Provided validation instructions.',
      staffMember: 'Alex Mercer',
      sentiment: 'Neutral'
    },
    {
      id: 'TL-202',
      customerId: 'CUST-10493',
      timestamp: 'Oct 04, 9:15 AM',
      relativeDate: '8 days ago',
      type: 'Phone Call',
      summary: 'Quarterly account review and security check',
      details: 'Reviewed 2FA enforcement policy across 450 active users. All compliance requirements met.',
      staffMember: 'Marcus Vance',
      sentiment: 'Positive',
      duration: '18:45'
    }
  ],
  'CUST-10495': [
    {
      id: 'TL-301',
      customerId: 'CUST-10495',
      timestamp: 'Oct 10, 11:30 AM',
      relativeDate: '2 days ago',
      type: 'Phone Call',
      summary: 'API Rate limit expansion approved for Black Friday',
      details: 'Adjusted tier from 5,000 req/min to 25,000 req/min for load testing. Coordinated with DevOps.',
      staffMember: 'Alex Mercer',
      sentiment: 'Positive',
      duration: '09:15'
    }
  ]
};

export const initialCallRecords: CallRecord[] = [
  {
    id: 'CALL-8841',
    customerId: 'CUST-10492',
    customerName: 'Sarah Wilson',
    phone: '+1 (555) 018-2930',
    category: 'Billing',
    priority: 'High',
    timestamp: 'Today, 09:14 AM',
    duration: '06:12',
    outcome: 'Resolved',
    notes: 'Investigated duplicate charge. Issued credit voucher #VCH-4491 for $240. Customer satisfied with expedited resolution.',
    sentiment: 'Positive',
    agent: 'Alex Mercer',
    smartActionTaken: 'Sent confirmation email with adjusted invoice'
  },
  {
    id: 'CALL-8840',
    customerId: 'CUST-10495',
    customerName: 'Marcus Vance',
    phone: '+1 (555) 492-3110',
    category: 'Technical Support',
    priority: 'High',
    timestamp: 'Today, 08:35 AM',
    duration: '08:44',
    outcome: 'Resolved',
    notes: 'Configured API rate limits for staging environments. Verified token authorization via OAuth2.',
    sentiment: 'Positive',
    agent: 'Alex Mercer',
    smartActionTaken: 'Logged quota upgrade ticket in Jira'
  },
  {
    id: 'CALL-8839',
    customerId: 'CUST-10496',
    customerName: 'Chloe Bennett',
    phone: '+1 (555) 673-8821',
    category: 'Account',
    priority: 'High',
    timestamp: 'Yesterday, 04:45 PM',
    duration: '05:20',
    outcome: 'Follow-up required',
    notes: 'Discussed onboarding concerns. Offered complimentary success manager session next Tuesday.',
    sentiment: 'Frustrated',
    agent: 'Alex Mercer',
    smartActionTaken: 'Scheduled follow-up call for Oct 15'
  },
  {
    id: 'CALL-8838',
    customerId: 'CUST-10497',
    customerName: 'Javier Morales',
    phone: '+1 (555) 890-1234',
    category: 'Hardware',
    priority: 'Medium',
    timestamp: 'Yesterday, 02:18 PM',
    duration: '04:10',
    outcome: 'Resolved',
    notes: 'Guided reset of POS terminal Bluetooth bridge. Confirmed heartbeat ping was back to normal.',
    sentiment: 'Positive',
    agent: 'Jordan Hayes',
    smartActionTaken: 'Closed hardware RMA request'
  },
  {
    id: 'CALL-8837',
    customerId: 'CUST-10498',
    customerName: 'Priya Patel',
    phone: '+1 (555) 345-6789',
    category: 'Policies',
    priority: 'Medium',
    timestamp: 'Yesterday, 11:05 AM',
    duration: '07:30',
    outcome: 'Resolved',
    notes: 'Delivered updated HIPAA Business Associate Agreement via DocuSign portal. Noted enterprise tier compliance verified.',
    sentiment: 'Neutral',
    agent: 'Alex Mercer',
    smartActionTaken: 'Archived BAA countersignature'
  },
  {
    id: 'CALL-8836',
    customerId: 'CUST-10499',
    customerName: 'Liam Gallagher',
    phone: '+1 (555) 432-8765',
    category: 'Technical Support',
    priority: 'Critical',
    timestamp: 'Oct 10, 03:22 PM',
    duration: '12:15',
    outcome: 'Escalated',
    notes: 'Render node 14 threw timeout kernel panics during ProRes export. Escalated to Infrastructure Ops.',
    sentiment: 'Frustrated',
    agent: 'Alex Mercer',
    smartActionTaken: 'Escalated ticket #INC-9902 to Tier 3 Ops'
  },
  {
    id: 'CALL-8835',
    customerId: 'CUST-10500',
    customerName: 'Samantha Wu',
    phone: '+1 (555) 912-4455',
    category: 'Account',
    priority: 'High',
    timestamp: 'Oct 10, 01:10 PM',
    duration: '03:45',
    outcome: 'Resolved',
    notes: 'Confirmed addition of 10 Bloomberg terminal integration licenses to institutional seat allotment.',
    sentiment: 'Positive',
    agent: 'Samira Khan',
    smartActionTaken: 'Updated billing profile'
  },
  {
    id: 'CALL-8834',
    customerId: 'CUST-10501',
    customerName: 'David Kalu',
    phone: '+1 (555) 765-2109',
    category: 'Account',
    priority: 'Low',
    timestamp: 'Oct 09, 04:30 PM',
    duration: '02:55',
    outcome: 'Resolved',
    notes: 'Assisted with floating license manager setup. Tested check-out and check-in licenses.',
    sentiment: 'Neutral',
    agent: 'Alex Mercer',
    smartActionTaken: 'Sent setup PDF guide'
  },
  {
    id: 'CALL-8833',
    customerId: 'CUST-10502',
    customerName: 'Grace Hopper-Lee',
    phone: '+1 (555) 887-3321',
    category: 'Technical Support',
    priority: 'Critical',
    timestamp: 'Oct 09, 10:45 AM',
    duration: '09:20',
    outcome: 'Follow-up required',
    notes: 'Reviewed PyTorch custom container deployment environment variables. Needs cluster ingress cert debug.',
    sentiment: 'Neutral',
    agent: 'Alex Mercer',
    smartActionTaken: 'Scheduled follow-up with ML specialist'
  },
  {
    id: 'CALL-8832',
    customerId: 'CUST-10493',
    customerName: 'Daniel Brown',
    phone: '+1 (555) 234-9182',
    category: 'Account',
    priority: 'Medium',
    timestamp: 'Oct 08, 02:00 PM',
    duration: '01:50',
    outcome: 'Customer unavailable',
    notes: 'Called back Daniel to follow up on Okta SCIM sync questions. Left voicemail and follow-up email.',
    sentiment: 'Neutral',
    agent: 'Alex Mercer',
    smartActionTaken: 'Left voicemail and logged reminder'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'TSK-301',
    title: 'Process credit refund #INV-8821 with Finance Dept',
    customerName: 'Sarah Wilson',
    customerId: 'CUST-10492',
    dueDate: 'Today, 4:00 PM',
    priority: 'High',
    status: 'Pending',
    category: 'Billing'
  },
  {
    id: 'TSK-302',
    title: 'Review SAML SSO claim attributes for Apex Logistics',
    customerName: 'Daniel Brown',
    customerId: 'CUST-10493',
    dueDate: 'Today, 5:30 PM',
    priority: 'Critical',
    status: 'Pending',
    category: 'Technical'
  },
  {
    id: 'TSK-303',
    title: 'Send tailored retention bundle & onboarding checklist',
    customerName: 'Chloe Bennett',
    customerId: 'CUST-10496',
    dueDate: 'Tomorrow, 11:00 AM',
    priority: 'High',
    status: 'Pending',
    category: 'Success'
  },
  {
    id: 'TSK-304',
    title: 'Validate GPU rendering queue health with SRE team',
    customerName: 'Liam Gallagher',
    customerId: 'CUST-10499',
    dueDate: 'Today, 2:00 PM',
    priority: 'Critical',
    status: 'Pending',
    category: 'Infrastructure'
  },
  {
    id: 'TSK-305',
    title: 'Archive HIPAA annual audit trail for BioVista Health',
    customerName: 'Priya Patel',
    customerId: 'CUST-10498',
    dueDate: 'Oct 14, 2026',
    priority: 'Medium',
    status: 'Pending',
    category: 'Compliance'
  },
  {
    id: 'TSK-306',
    title: 'Confirm replacement POS terminal tracking delivery status',
    customerName: 'Javier Morales',
    customerId: 'CUST-10497',
    dueDate: 'Oct 13, 2026',
    priority: 'Low',
    status: 'Pending',
    category: 'Hardware'
  },
  {
    id: 'TSK-307',
    title: 'Update Q4 Black Friday burst quota in billing table',
    customerName: 'Marcus Vance',
    customerId: 'CUST-10495',
    dueDate: 'Yesterday',
    priority: 'High',
    status: 'Completed',
    category: 'Operations'
  },
  {
    id: 'TSK-308',
    title: 'Publish updated SSO troubleshooting article to internal KB',
    customerName: 'Internal Team',
    customerId: 'CUST-10493',
    dueDate: 'Oct 09, 2026',
    priority: 'Medium',
    status: 'Completed',
    category: 'Documentation'
  }
];

export const initialFollowUps: FollowUp[] = [
  {
    id: 'FU-501',
    customerName: 'Sarah Wilson',
    customerId: 'CUST-10492',
    phone: '+1 (555) 018-2930',
    reason: 'Verify refund receipt arrived & confirm satisfaction',
    date: 'Today',
    time: '03:30 PM',
    priority: 'High',
    status: 'Scheduled'
  },
  {
    id: 'FU-502',
    customerName: 'Daniel Brown',
    customerId: 'CUST-10493',
    phone: '+1 (555) 234-9182',
    reason: 'Confirm SAML SSO IdP certificate handshake complete',
    date: 'Today',
    time: '04:45 PM',
    priority: 'Critical',
    status: 'Scheduled'
  },
  {
    id: 'FU-503',
    customerName: 'Grace Hopper-Lee',
    customerId: 'CUST-10502',
    phone: '+1 (555) 887-3321',
    reason: 'Check cluster inference latency after patch 4.2 applied',
    date: 'Tomorrow',
    time: '10:00 AM',
    priority: 'High',
    status: 'Scheduled'
  },
  {
    id: 'FU-504',
    customerName: 'Chloe Bennett',
    customerId: 'CUST-10496',
    phone: '+1 (555) 673-8821',
    reason: 'Walkthrough onboarding dashboard and answer workflow questions',
    date: 'Tomorrow',
    time: '02:00 PM',
    priority: 'Medium',
    status: 'Scheduled'
  },
  {
    id: 'FU-505',
    customerName: 'Samantha Wu',
    customerId: 'CUST-10500',
    phone: '+1 (555) 912-4455',
    reason: 'Colocation London latency follow-up check-in',
    date: 'Oct 15, 2026',
    time: '11:15 AM',
    priority: 'Medium',
    status: 'Scheduled'
  },
  {
    id: 'FU-506',
    customerName: 'David Kalu',
    customerId: 'CUST-10501',
    phone: '+1 (555) 765-2109',
    reason: 'Confirm secondary CAD licenses verified on studio machines',
    date: 'Oct 16, 2026',
    time: '01:30 PM',
    priority: 'Low',
    status: 'Scheduled'
  }
];

export const initialKBArticles: KBArticle[] = [
  {
    id: 'KB-101',
    title: 'Resolving Duplicate Invoicing and Stripe Authorization Holds',
    category: 'Billing',
    summary: 'Step-by-step troubleshooting guide for handling duplicate transaction alerts, card holds, and issuing direct merchant refunds.',
    content: `When a customer reports a duplicate transaction:
1. Navigate to Stripe Dashboard or CallFlow Billing Module.
2. Search customer by email or customer ID (e.g., CUST-10492).
3. Distinguish between an Authorization Hold (temporary pending bank hold that auto-drops in 3-5 business days) vs a Settled Charge.
4. If settled: Click 'Issue Refund' > Select 'Duplicate Payment' as the reason.
5. Provide refund voucher reference (VCH-XXXX) to the customer and assure them of credit within 3-5 business days.
6. Trigger automated email receipt via Customer 360 profile.`,
    readTime: '3 min read',
    helpfulCount: 142,
    unhelpfulCount: 4,
    tags: ['refunds', 'invoices', 'stripe', 'billing'],
    updatedAt: '2 days ago'
  },
  {
    id: 'KB-102',
    title: 'SAML 2.0 Identity Provider & SSO Configuration Troubleshooting',
    category: 'Account',
    summary: 'Fixing common XML signature mismatches, expired x509 certs, and attribute mapping issues with Okta, Azure AD, and Google Workspace.',
    content: `Common SAML 2.0 Failure Codes:
- Error 4001 (Certificate Expired): Customer uploaded old public cert. Request fresh PEM/CRT string.
- Error 4003 (Audience URI Mismatch): Verify Entity ID equals 'https://auth.callflow.internal/saml/sp'.
- NameID Format: Ensure IdP is set to 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'.

Resolution steps:
1. Have admin log into IdP settings.
2. In CallFlow Enterprise Settings > SSO, upload raw metadata XML.
3. Use 'Test Handshake' diagnostic button.
4. If successful, clear user session cache and test in Incognito window.`,
    readTime: '5 min read',
    helpfulCount: 98,
    unhelpfulCount: 2,
    tags: ['sso', 'saml', 'security', 'okta', 'azure-ad'],
    updatedAt: 'Oct 08, 2026'
  },
  {
    id: 'KB-103',
    title: 'GPU Rendering Queue Bottlenecks and Cloud Node Scaling',
    category: 'Technical Support',
    summary: 'Protocol for diagnosing ProRes, H.265 export stalls, and requesting autoscaling node allocations for high-tier accounts.',
    content: `When media streaming jobs stall at 99%:
- Inspect worker thread health on Grafana node dashboard.
- If worker pod status is 'CrashLoopBackOff', restart render daemon with:
  'callflow-ctl render restart --node-pool=gpu-west-1'
- For Enterprise accounts with SLA guarantees, trigger priority overflow routing:
  Route overflow jobs to GPU AWS us-east-2 резерв pool.
- Escalate to #infra-ops on Slack if queue latency exceeds 15 minutes.`,
    readTime: '4 min read',
    helpfulCount: 64,
    unhelpfulCount: 1,
    tags: ['gpu', 'render', 'cluster', 'sla', 'infra'],
    updatedAt: 'Oct 04, 2026'
  },
  {
    id: 'KB-104',
    title: 'Hardware POS Terminal Disconnects and Bluetooth Pairing Protocol',
    category: 'Technical Support',
    summary: 'Standard operating procedure for hard-resetting Model T-90 terminals, clearing Bluetooth stacks, and flashing firmware over USB-C.',
    content: `POS Terminal Quick Diagnostic:
1. Hold Power + Cancel button for 10 seconds until device beeps twice.
2. Select 'Diagnostics' > 'Network Test'.
3. If RSSI is worse than -75dBm, advise moving terminal closer to Wi-Fi access point or docking station.
4. For persistent hardware errors, issue express RMA replacement via Logistics portal. Terminal dispatch code: RMA-POS-EXP.`,
    readTime: '4 min read',
    helpfulCount: 88,
    unhelpfulCount: 6,
    tags: ['hardware', 'pos', 'bluetooth', 'firmware'],
    updatedAt: 'Sep 29, 2026'
  },
  {
    id: 'KB-105',
    title: 'Customer Retention & Churn Prevention Playbook',
    category: 'Policies',
    summary: 'Best practices for handling dissatisfied or at-risk customers, cancellation deflection offers, and complimentary credit approvals.',
    content: `Retention Strategy Guidelines:
1. Listen actively: Acknowledge customer frustration without becoming defensive.
2. Diagnose root cause: Is it cost, product complexity, lack of training, or a technical bug?
3. Tiered Deflection Options:
   - Level 1: Complimentary 1-on-1 Customer Success onboarding session.
   - Level 2: 25% discount for 3 months on current tier.
   - Level 3: Grace period with temporary pause instead of hard cancellation.
4. Staff can approve up to $150 credit without supervisory sign-off.`,
    readTime: '6 min read',
    helpfulCount: 175,
    unhelpfulCount: 8,
    tags: ['retention', 'churn', 'credits', 'support-policy'],
    updatedAt: 'Oct 01, 2026'
  },
  {
    id: 'KB-106',
    title: 'HIPAA and SOC2 Compliance Data Access Protocols',
    category: 'Policies',
    summary: 'Mandatory verification procedures before inspecting customer databases, PII logging policies, and audit retention rules.',
    content: `Compliance Mandates:
- Never ask customers for unmasked credit card numbers or passwords over the phone.
- When viewing account databases with protected health information (PHI), agent must provide a verified Support Ticket ID into the access gate.
- All remote screen sharing sessions must be explicitly consented to via customer confirmation prompt.
- Retain all call recording transcripts for 7 years in cold storage.`,
    readTime: '3 min read',
    helpfulCount: 52,
    unhelpfulCount: 0,
    tags: ['hipaa', 'soc2', 'compliance', 'security', 'pii'],
    updatedAt: 'Sep 15, 2026'
  },
  {
    id: 'KB-107',
    title: 'API Rate Limits, Burst Allowances, and Quota Adjustments',
    category: 'Products',
    summary: 'Standard rate tiers across Standard, Premium, and Enterprise plans, with steps to apply temporary burst multiplier tokens.',
    content: `Standard Plan: 1,000 req/min
Premium Plan: 5,000 req/min
Enterprise Plan: 20,000 req/min (Customisable)

To apply temporary 48-hour event burst:
1. Open Customer 360 > API Keys tab.
2. Select target endpoint cluster.
3. Click 'Enable Temporary Burst Multiplier (2x)'.
4. Note justification reason in audit comments.`,
    readTime: '2 min read',
    helpfulCount: 110,
    unhelpfulCount: 3,
    tags: ['api', 'rate-limits', 'quota', 'tokens'],
    updatedAt: 'Oct 07, 2026'
  },
  {
    id: 'KB-108',
    title: 'Subscription Proration & Billing Cycle Adjustments',
    category: 'Billing',
    summary: 'Explanation of mid-month plan changes, seat additions, and credit carry-overs across invoice cycles.',
    content: `How Proration Works:
When an account upgrades mid-cycle:
- Unused balance of previous plan is credited down to the second.
- New plan charges are applied for remainder of period.
- Net difference is billed either immediately or consolidated on next monthly renewal.`,
    readTime: '3 min read',
    helpfulCount: 79,
    unhelpfulCount: 5,
    tags: ['proration', 'billing', 'upgrades'],
    updatedAt: 'Sep 22, 2026'
  },
  {
    id: 'KB-109',
    title: 'Handling Rude or Abusive Callers - Safety Policy',
    category: 'Policies',
    summary: 'Company escalation steps, 3-warning protocol, and authorized call termination procedures for agent psychological safety.',
    content: `Agent Safety Protocol:
1. First occurrence: Calmly set boundaries: 'I want to help resolve your issue, but I ask that we keep our conversation respectful.'
2. Second occurrence: 'If profanity continues, I will be required to disconnect this call and continue assisting via email.'
3. Third occurrence: Politely inform: 'I am ending this call now. Your case has been logged and our management team will review.'
4. Select outcome 'Escalated - Behavioral' and brief your supervisor immediately.`,
    readTime: '3 min read',
    helpfulCount: 215,
    unhelpfulCount: 3,
    tags: ['safety', 'escalation', 'call-guidelines'],
    updatedAt: 'Oct 11, 2026'
  },
  {
    id: 'KB-110',
    title: 'Dispute Handling & Chargeback Defense Evidence Package',
    category: 'Refunds',
    summary: 'Assembling customer log signatures, IP delivery proofs, and terms of service acceptances to prevent merchant loss.',
    content: `When a formal bank dispute notice is received:
- Export Customer Timeline audit log as PDF.
- Attach Terms of Service acceptance timestamp with matching IP address.
- Submit package to Merchant Processing portal within 7 calendar days.`,
    readTime: '4 min read',
    helpfulCount: 63,
    unhelpfulCount: 1,
    tags: ['chargebacks', 'disputes', 'finance', 'refunds'],
    updatedAt: 'Sep 18, 2026'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'High priority customer waiting',
    message: 'Liam Gallagher (Critical - Render pipeline blocked) has been waiting 3m 45s.',
    timestamp: '2 min ago',
    type: 'priority',
    read: false,
    actionLink: '/'
  },
  {
    id: 'NOTIF-2',
    title: 'Follow-up due in 15 minutes',
    message: 'Sarah Wilson - Verify refund receipt arrived & confirm satisfaction.',
    timestamp: '10 min ago',
    type: 'reminder',
    read: false,
    actionLink: '/follow-ups'
  },
  {
    id: 'NOTIF-3',
    title: 'Customer satisfaction survey received',
    message: 'Marcus Vance gave 5/5 stars: "Alex solved our Black Friday API burst in 8 minutes!"',
    timestamp: '32 min ago',
    type: 'survey',
    read: false,
    actionLink: '/reports'
  },
  {
    id: 'NOTIF-4',
    title: 'Knowledge base article updated',
    message: 'KB-102 "SAML 2.0 Identity Provider & SSO" updated by DevOps team.',
    timestamp: '1 hour ago',
    type: 'kb',
    read: true,
    actionLink: '/knowledge-base'
  },
  {
    id: 'NOTIF-5',
    title: 'Task deadline approaching',
    message: 'Process credit refund #INV-8821 with Finance Dept due today at 4:00 PM.',
    timestamp: '2 hours ago',
    type: 'reminder',
    read: true,
    actionLink: '/tasks'
  },
  {
    id: 'NOTIF-6',
    title: 'VIP Account Inbound alert',
    message: 'QuantEdge Capital account flagged for upcoming maintenance window in London.',
    timestamp: '3 hours ago',
    type: 'system',
    read: true,
    actionLink: '/customers'
  },
  {
    id: 'NOTIF-7',
    title: 'Weekly Performance Milestone',
    message: 'Your First-Call Resolution rate hit 89% this week, beating team target of 85%.',
    timestamp: 'Yesterday',
    type: 'system',
    read: true,
    actionLink: '/reports'
  },
  {
    id: 'NOTIF-8',
    title: 'New customer profile assigned',
    message: 'Kalu & Partners Architects onboarded with 12 workstation CAD licenses.',
    timestamp: 'Yesterday',
    type: 'system',
    read: true,
    actionLink: '/customers'
  },
  {
    id: 'NOTIF-9',
    title: 'System Operational Notice',
    message: 'All telephony SIP trunks and WebRTC bridges operating with nominal <18ms latency.',
    timestamp: '2 days ago',
    type: 'system',
    read: true,
    actionLink: '/'
  },
  {
    id: 'NOTIF-10',
    title: 'Customer survey response',
    message: 'Elena Rostova gave 4/5 stars on ticket resolution speed.',
    timestamp: '3 days ago',
    type: 'survey',
    read: true,
    actionLink: '/reports'
  }
];
