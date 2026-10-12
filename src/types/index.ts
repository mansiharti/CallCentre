export type StaffStatus = 'Available' | 'Busy' | 'On Break' | 'Offline';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type Sentiment = 'Positive' | 'Neutral' | 'Frustrated';

export type CallOutcome = 'Resolved' | 'Follow-up required' | 'Escalated' | 'Customer unavailable';

export interface Customer {
  id: string; // e.g. CUST-10492
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: 'Standard' | 'Premium' | 'Enterprise';
  status: 'Active' | 'VIP' | 'At Risk' | 'New';
  customerSince: string;
  currentIssue?: string;
  lastInteraction: string;
  openCommitments: string;
  notes: string[];
  tags: string[];
  company?: string;
  location?: string;
}

export interface TimelineEvent {
  id: string;
  customerId: string;
  timestamp: string;
  relativeDate: string;
  type: 'Phone Call' | 'Email' | 'Chat' | 'System Note' | 'Follow-up';
  summary: string;
  details: string;
  staffMember: string;
  sentiment: Sentiment;
  duration?: string;
}

export interface CallRecord {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  category: string;
  priority: Priority;
  timestamp: string;
  duration: string;
  outcome: CallOutcome;
  notes: string;
  sentiment: Sentiment;
  agent: string;
  smartActionTaken?: string;
}

export interface QueueItem {
  id: string;
  customerId: string;
  customerName: string;
  avatar: string;
  issue: string;
  category: string;
  priority: Priority;
  waitTime: string; // e.g. 02:14
  waitSeconds: number;
  channel: 'Phone' | 'Web Callback' | 'VIP Inbound';
  status: 'Waiting' | 'Connecting' | 'In Progress';
}

export interface ActiveCallState {
  queueId?: string;
  customerId: string;
  customerName: string;
  phone: string;
  category: string;
  tier: 'Standard' | 'Premium' | 'Enterprise';
  customerSince: string;
  startedAt: number; // Date.now()
  isMuted: boolean;
  isOnHold: boolean;
  participants: string[];
  connectionQuality: 'Excellent' | 'Good' | 'Fair';
  sentiment: Sentiment;
  liveNotes: string;
}

export interface Task {
  id: string;
  title: string;
  customerName: string;
  customerId: string;
  dueDate: string;
  priority: Priority;
  status: 'Pending' | 'Completed';
  category: string;
}

export interface FollowUp {
  id: string;
  customerName: string;
  customerId: string;
  phone: string;
  reason: string;
  date: string;
  time: string;
  priority: Priority;
  status: 'Scheduled' | 'Completed' | 'Rescheduled';
}

export interface KBArticle {
  id: string;
  title: string;
  category: 'Billing' | 'Account' | 'Technical Support' | 'Refunds' | 'Products' | 'Policies';
  summary: string;
  content: string;
  readTime: string;
  helpfulCount: number;
  unhelpfulCount: number;
  userVote?: 'yes' | 'no';
  tags: string[];
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'priority' | 'reminder' | 'system' | 'survey' | 'kb';
  read: boolean;
  actionLink?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  soundAlerts: boolean;
  desktopNotifications: boolean;
  priorityAlertsOnly: boolean;
  defaultCallView: 'expanded' | 'minimal';
}
