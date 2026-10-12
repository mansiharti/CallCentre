import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  TimelineEvent,
  CallRecord,
  QueueItem,
  ActiveCallState,
  Task,
  FollowUp,
  KBArticle,
  AppNotification,
  StaffStatus,
  UserSettings,
  CallOutcome,
  Priority,
  Sentiment
} from '../types';
import {
  initialCustomers,
  initialQueueItems,
  initialTimelineEvents,
  initialCallRecords,
  initialTasks,
  initialFollowUps,
  initialKBArticles,
  initialNotifications
} from '../data/mockData';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  // Staff & Operations
  staffStatus: StaffStatus;
  setStaffStatus: (status: StaffStatus) => void;
  staffName: string;
  queuePulse: 'Low' | 'Moderate' | 'High';
  
  // Queue & Active Call
  queue: QueueItem[];
  activeCall: ActiveCallState | null;
  startCallWithCustomer: (customer: Customer, category?: string) => void;
  acceptQueueCall: (queueItem: QueueItem) => void;
  updateActiveCall: (updates: Partial<ActiveCallState>) => void;
  endActiveCall: () => void;
  pendingEndCallModal: boolean;
  setPendingEndCallModal: (open: boolean) => void;
  finalizeCallSummary: (summary: {
    outcome: CallOutcome;
    notes: string;
    followUpDate?: string;
    followUpTime?: string;
    followUpReason?: string;
    priority?: Priority;
  }) => void;
  
  // Data entities
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  timelineEvents: Record<string, TimelineEvent[]>;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  
  calls: CallRecord[];
  
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  
  followUps: FollowUp[];
  rescheduleFollowUp: (id: string, newDate: string, newTime: string) => void;
  completeFollowUp: (id: string) => void;
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  
  kbArticles: KBArticle[];
  voteArticle: (id: string, vote: 'yes' | 'no') => void;
  
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Settings & Theme
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  
  // Command Palette & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Quick Action Modals
  quickModal: 'newCustomer' | 'createTask' | 'scheduleFollowUp' | 'dialer' | null;
  setQuickModal: (modal: 'newCustomer' | 'createTask' | 'scheduleFollowUp' | 'dialer' | null) => void;
  
  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Staff
  const [staffStatus, setStaffStatusState] = useState<StaffStatus>(() => {
    return (localStorage.getItem('callflow_status') as StaffStatus) || 'Available';
  });
  const staffName = 'Alex Mercer';

  // Settings
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('callflow_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      theme: 'light',
      compactMode: false,
      soundAlerts: true,
      desktopNotifications: true,
      priorityAlertsOnly: false,
      defaultCallView: 'expanded'
    };
  });

  // Apply dark theme class to html/body
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('callflow_settings', JSON.stringify(next));
      return next;
    });
    addToast({
      type: 'success',
      title: 'Preferences Updated',
      message: 'Your settings have been saved.'
    });
  };

  const setStaffStatus = (status: StaffStatus) => {
    setStaffStatusState(status);
    localStorage.setItem('callflow_status', status);
    addToast({
      type: status === 'Available' ? 'success' : status === 'Busy' ? 'warning' : 'info',
      title: `Status set to ${status}`,
      message: status === 'Available' ? 'Ready to accept incoming interactions.' : 'Queue routing adjusted.'
    });
  };

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('callflow_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialCustomers;
  });

  useEffect(() => {
    localStorage.setItem('callflow_customers', JSON.stringify(customers));
  }, [customers]);

  // Timeline
  const [timelineEvents, setTimelineEvents] = useState<Record<string, TimelineEvent[]>>(() => {
    const saved = localStorage.getItem('callflow_timeline');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialTimelineEvents;
  });

  useEffect(() => {
    localStorage.setItem('callflow_timeline', JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  // Queue
  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const saved = localStorage.getItem('callflow_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialQueueItems;
  });

  // Queue Pulse computation based on count and high priority items
  const queuePulse: 'Low' | 'Moderate' | 'High' = 
    queue.length > 5 || queue.some(q => q.priority === 'Critical')
      ? 'High'
      : queue.length >= 3
      ? 'Moderate'
      : 'Low';

  // Active call
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(() => {
    const saved = localStorage.getItem('callflow_active_call');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  useEffect(() => {
    if (activeCall) {
      localStorage.setItem('callflow_active_call', JSON.stringify(activeCall));
    } else {
      localStorage.removeItem('callflow_active_call');
    }
  }, [activeCall]);

  const [pendingEndCallModal, setPendingEndCallModal] = useState<boolean>(false);

  // Calls
  const [calls, setCalls] = useState<CallRecord[]>(() => {
    const saved = localStorage.getItem('callflow_calls');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialCallRecords;
  });

  useEffect(() => {
    localStorage.setItem('callflow_calls', JSON.stringify(calls));
  }, [calls]);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('callflow_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('callflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Follow-ups
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem('callflow_followups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialFollowUps;
  });

  useEffect(() => {
    localStorage.setItem('callflow_followups', JSON.stringify(followUps));
  }, [followUps]);

  // KB Articles
  const [kbArticles, setKbArticles] = useState<KBArticle[]>(() => {
    const saved = localStorage.getItem('callflow_kb');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialKBArticles;
  });

  useEffect(() => {
    localStorage.setItem('callflow_kb', JSON.stringify(kbArticles));
  }, [kbArticles]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('callflow_notifs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('callflow_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Modals & Command palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [quickModal, setQuickModal] = useState<'newCustomer' | 'createTask' | 'scheduleFollowUp' | 'dialer' | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keyboard shortcut for Command Palette (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Queue timer simulator: increment seconds slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prev =>
        prev.map(item => {
          const nextSec = item.waitSeconds + 1;
          const mins = Math.floor(nextSec / 60).toString().padStart(2, '0');
          const secs = (nextSec % 60).toString().padStart(2, '0');
          return {
            ...item,
            waitSeconds: nextSec,
            waitTime: `${mins}:${secs}`
          };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Call actions
  const startCallWithCustomer = (customer: Customer, category = 'Outbound Support') => {
    const newCall: ActiveCallState = {
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      category,
      tier: customer.tier,
      customerSince: customer.customerSince,
      startedAt: Date.now(),
      isMuted: false,
      isOnHold: false,
      participants: ['You (' + staffName + ')', customer.name],
      connectionQuality: 'Excellent',
      sentiment: 'Neutral',
      liveNotes: ''
    };
    setActiveCall(newCall);
    setStaffStatusState('Busy');
    addToast({
      type: 'info',
      title: 'Call Connected',
      message: `Direct line connected to ${customer.name} (${customer.phone}).`
    });
  };

  const acceptQueueCall = (queueItem: QueueItem) => {
    const targetCustomer = customers.find(c => c.id === queueItem.customerId);
    const newCall: ActiveCallState = {
      queueId: queueItem.id,
      customerId: queueItem.customerId,
      customerName: queueItem.customerName,
      phone: targetCustomer ? targetCustomer.phone : '+1 (555) 018-2930',
      category: queueItem.category,
      tier: targetCustomer ? targetCustomer.tier : 'Standard',
      customerSince: targetCustomer ? targetCustomer.customerSince : '2023',
      startedAt: Date.now(),
      isMuted: false,
      isOnHold: false,
      participants: ['You (' + staffName + ')', queueItem.customerName],
      connectionQuality: 'Excellent',
      sentiment: queueItem.priority === 'Critical' ? 'Frustrated' : 'Neutral',
      liveNotes: queueItem.issue ? `[Queue Note] ${queueItem.issue}\n` : ''
    };

    // Remove from queue
    setQueue(prev => prev.filter(q => q.id !== queueItem.id));
    setActiveCall(newCall);
    setStaffStatusState('Busy');
    addToast({
      type: 'success',
      title: 'Call Accepted',
      message: `Connected with ${queueItem.customerName}.`
    });
  };

  const updateActiveCall = (updates: Partial<ActiveCallState>) => {
    setActiveCall(prev => (prev ? { ...prev, ...updates } : null));
  };

  const endActiveCall = () => {
    setPendingEndCallModal(true);
  };

  const finalizeCallSummary = (summary: {
    outcome: CallOutcome;
    notes: string;
    followUpDate?: string;
    followUpTime?: string;
    followUpReason?: string;
    priority?: Priority;
  }) => {
    if (!activeCall) return;

    const durationSeconds = Math.max(1, Math.floor((Date.now() - activeCall.startedAt) / 1000));
    const mins = Math.floor(durationSeconds / 60).toString().padStart(2, '0');
    const secs = (durationSeconds % 60).toString().padStart(2, '0');
    const durationFormatted = `${mins}:${secs}`;

    // Smart Next Action text based on outcome
    let smartActionTaken = 'Logged call record into customer activity log.';
    if (summary.outcome === 'Follow-up required') {
      smartActionTaken = 'Automated reminder queued. Priority follow-up dispatched to calendar.';
    } else if (summary.outcome === 'Escalated') {
      smartActionTaken = 'Tier 2 engineering ticket created and dispatched to on-call lead.';
    } else if (summary.outcome === 'Customer unavailable') {
      smartActionTaken = 'Voicemail delivery confirmed. Reschedule callback ticket opened.';
    } else {
      smartActionTaken = 'Case marked resolved. Automated customer satisfaction survey sent.';
    }

    // Create call record
    const newRecord: CallRecord = {
      id: `CALL-${Math.floor(8800 + Math.random() * 1000)}`,
      customerId: activeCall.customerId,
      customerName: activeCall.customerName,
      phone: activeCall.phone,
      category: activeCall.category,
      priority: summary.priority || 'Medium',
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: durationFormatted,
      outcome: summary.outcome,
      notes: summary.notes || activeCall.liveNotes || 'Call completed successfully.',
      sentiment: activeCall.sentiment,
      agent: staffName,
      smartActionTaken
    };

    setCalls(prev => [newRecord, ...prev]);

    // Add to customer timeline
    const newTimelineEvent: TimelineEvent = {
      id: `TL-${Date.now()}`,
      customerId: activeCall.customerId,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relativeDate: 'Today',
      type: 'Phone Call',
      summary: `${activeCall.category} call: ${summary.outcome}`,
      details: summary.notes || 'Spoke with customer regarding ' + activeCall.category,
      staffMember: staffName,
      sentiment: activeCall.sentiment,
      duration: durationFormatted
    };

    setTimelineEvents(prev => ({
      ...prev,
      [activeCall.customerId]: [newTimelineEvent, ...(prev[activeCall.customerId] || [])]
    }));

    // Update customer last interaction
    setCustomers(prev =>
      prev.map(c =>
        c.id === activeCall.customerId
          ? {
              ...c,
              lastInteraction: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Phone Call)`,
              notes: summary.notes ? [summary.notes, ...c.notes] : c.notes
            }
          : c
      )
    );

    // If follow-up was scheduled
    if (summary.followUpDate) {
      const newFollowUp: FollowUp = {
        id: `FU-${Math.floor(600 + Math.random() * 400)}`,
        customerName: activeCall.customerName,
        customerId: activeCall.customerId,
        phone: activeCall.phone,
        reason: summary.followUpReason || 'Post-call resolution check',
        date: summary.followUpDate,
        time: summary.followUpTime || '02:00 PM',
        priority: summary.priority || 'High',
        status: 'Scheduled'
      };
      setFollowUps(prev => [newFollowUp, ...prev]);
    }

    // Reset active call & set staff available
    setActiveCall(null);
    setPendingEndCallModal(false);
    setStaffStatusState('Available');

    addToast({
      type: 'success',
      title: 'Call Wrapped Up',
      message: `Record saved for ${activeCall.customerName}. Duration: ${durationFormatted}.`
    });
  };

  // Customer methods
  const addCustomer = (customerData: Omit<Customer, 'id'>): Customer => {
    const newId = `CUST-${Math.floor(10500 + Math.random() * 500)}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCustomer.name} (${newId}) added to directory.`
    });
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    addToast({
      type: 'info',
      title: 'Customer Updated',
      message: `Updated profile details.`
    });
  };

  const addTimelineEvent = (eventData: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `TL-${Date.now()}`
    };
    setTimelineEvents(prev => ({
      ...prev,
      [eventData.customerId]: [newEvent, ...(prev[eventData.customerId] || [])]
    }));
  };

  // Task methods
  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `TSK-${Math.floor(320 + Math.random() * 100)}`
    };
    setTasks(prev => [newTask, ...prev]);
    addToast({
      type: 'success',
      title: 'Task Created',
      message: `"${newTask.title}" added to queue.`
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast({
      type: 'info',
      title: 'Task Removed',
      message: 'Task removed from your list.'
    });
  };

  // Follow-up methods
  const rescheduleFollowUp = (id: string, newDate: string, newTime: string) => {
    setFollowUps(prev =>
      prev.map(f => (f.id === id ? { ...f, date: newDate, time: newTime, status: 'Rescheduled' } : f))
    );
    addToast({
      type: 'info',
      title: 'Follow-up Rescheduled',
      message: `Moved to ${newDate} at ${newTime}.`
    });
  };

  const completeFollowUp = (id: string) => {
    setFollowUps(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'Completed' } : f))
    );
    addToast({
      type: 'success',
      title: 'Follow-up Completed',
      message: 'Marked as completed.'
    });
  };

  const addFollowUp = (data: Omit<FollowUp, 'id'>) => {
    const newFU: FollowUp = {
      ...data,
      id: `FU-${Math.floor(550 + Math.random() * 200)}`
    };
    setFollowUps(prev => [newFU, ...prev]);
    addToast({
      type: 'success',
      title: 'Follow-up Scheduled',
      message: `Scheduled with ${newFU.customerName} for ${newFU.date}.`
    });
  };

  // KB methods
  const voteArticle = (id: string, vote: 'yes' | 'no') => {
    setKbArticles(prev =>
      prev.map(a => {
        if (a.id === id) {
          if (a.userVote === vote) return a;
          const helpfulDelta = vote === 'yes' ? 1 : a.userVote === 'yes' ? -1 : 0;
          const unhelpfulDelta = vote === 'no' ? 1 : a.userVote === 'no' ? -1 : 0;
          return {
            ...a,
            helpfulCount: a.helpfulCount + helpfulDelta,
            unhelpfulCount: a.unhelpfulCount + unhelpfulDelta,
            userVote: vote
          };
        }
        return a;
      })
    );
    addToast({
      type: 'info',
      title: 'Feedback Recorded',
      message: 'Thank you for rating this article.'
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        staffStatus,
        setStaffStatus,
        staffName,
        queuePulse,
        queue,
        activeCall,
        startCallWithCustomer,
        acceptQueueCall,
        updateActiveCall,
        endActiveCall,
        pendingEndCallModal,
        setPendingEndCallModal,
        finalizeCallSummary,
        customers,
        addCustomer,
        updateCustomer,
        timelineEvents,
        addTimelineEvent,
        calls,
        tasks,
        toggleTask,
        addTask,
        deleteTask,
        followUps,
        rescheduleFollowUp,
        completeFollowUp,
        addFollowUp,
        kbArticles,
        voteArticle,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        settings,
        updateSettings,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        quickModal,
        setQuickModal,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
