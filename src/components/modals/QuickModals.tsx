import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority } from '../../types';
import {
  UserPlus,
  CheckSquare,
  Clock,
  Phone,
  PhoneCall,
  X,
  Delete,
  Hash,
  Star
} from 'lucide-react';

export const QuickModals: React.FC = () => {
  const {
    quickModal,
    setQuickModal,
    customers,
    addCustomer,
    addTask,
    addFollowUp,
    startCallWithCustomer,
    addToast
  } = useApp();

  // New Customer state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custTier, setCustTier] = useState<'Standard' | 'Premium' | 'Enterprise'>('Premium');
  const [custNotes, setCustNotes] = useState('');

  // New Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCustomerId, setTaskCustomerId] = useState(customers[0]?.id || '');
  const [taskDueDate, setTaskDueDate] = useState('Today, 5:00 PM');
  const [taskPriority, setTaskPriority] = useState<Priority>('High');
  const [taskCategory, setTaskCategory] = useState('Support');

  // Follow-up state
  const [fuCustomerId, setFuCustomerId] = useState(customers[0]?.id || '');
  const [fuReason, setFuReason] = useState('');
  const [fuDate, setFuDate] = useState('Tomorrow');
  const [fuTime, setFuTime] = useState('11:00 AM');
  const [fuPriority, setFuPriority] = useState<Priority>('High');

  // Dialer state
  const [dialerNumber, setDialerNumber] = useState('');

  if (!quickModal) return null;

  const handleClose = () => setQuickModal(null);

  // New Customer submit
  const handleNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    addCustomer({
      name: custName,
      email: custEmail || `${custName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: custPhone || '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      tier: custTier,
      status: 'Active',
      customerSince: '2026',
      lastInteraction: 'Just created (Manual Entry)',
      openCommitments: 'Initial account discovery call pending',
      notes: custNotes ? [custNotes] : ['New customer added by staff.'],
      tags: [custTier, 'Direct Entry'],
      company: custCompany || 'Independent Client'
    });

    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustCompany('');
    setCustNotes('');
    handleClose();
  };

  // Create Task submit
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const selectedCust = customers.find(c => c.id === taskCustomerId);

    addTask({
      title: taskTitle,
      customerName: selectedCust ? selectedCust.name : 'General Account',
      customerId: taskCustomerId || 'CUST-GEN',
      dueDate: taskDueDate,
      priority: taskPriority,
      status: 'Pending',
      category: taskCategory
    });

    setTaskTitle('');
    handleClose();
  };

  // Follow-up submit
  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCust = customers.find(c => c.id === fuCustomerId);
    if (!selectedCust) return;

    addFollowUp({
      customerName: selectedCust.name,
      customerId: selectedCust.id,
      phone: selectedCust.phone,
      reason: fuReason || 'Routine account check-in',
      date: fuDate,
      time: fuTime,
      priority: fuPriority,
      status: 'Scheduled'
    });

    setFuReason('');
    handleClose();
  };

  // Dialer start call
  const handleDial = (customerToCall?: typeof customers[0]) => {
    if (customerToCall) {
      startCallWithCustomer(customerToCall, 'Outbound Direct Dial');
      handleClose();
      return;
    }

    if (!dialerNumber.trim()) {
      addToast({
        type: 'warning',
        title: 'Number Required',
        message: 'Please dial or select a customer phone number.'
      });
      return;
    }

    // Match existing customer by phone or create on-the-fly dummy customer
    const found = customers.find(c => c.phone.replace(/\D/g, '') === dialerNumber.replace(/\D/g, ''));
    if (found) {
      startCallWithCustomer(found, 'Outbound Direct Dial');
    } else {
      const tempCustomer = addCustomer({
        name: `Outbound (${dialerNumber})`,
        email: 'dialer.contact@callflow.internal',
        phone: dialerNumber,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        tier: 'Standard',
        status: 'New',
        customerSince: '2026',
        lastInteraction: 'Direct outbound line dialed',
        openCommitments: 'None',
        notes: ['Ad-hoc dialer interaction.'],
        tags: ['Outbound Dial']
      });
      startCallWithCustomer(tempCustomer, 'Outbound Dial');
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* NEW CUSTOMER MODAL */}
        {quickModal === 'newCustomer' && (
          <div>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-command-500/10 text-command-600 dark:text-command-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Create Customer Dossier
                </h3>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleNewCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jordan Belfort"
                  value={custName}
                  onChange={e => setCustName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={custPhone}
                    onChange={e => setCustPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Org
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={custCompany}
                    onChange={e => setCustCompany(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jordan@company.com"
                  value={custEmail}
                  onChange={e => setCustEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Plan Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Standard', 'Premium', 'Enterprise'] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setCustTier(tier)}
                      className={`p-2 rounded-lg border font-semibold text-center transition-all ${
                        custTier === tier
                          ? 'border-command-500 bg-command-50 dark:bg-command-950/40 text-command-600 dark:text-command-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Background Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key account details, service contracts, VIP tags..."
                  value={custNotes}
                  onChange={e => setCustNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-command-600 hover:bg-command-700 text-white font-bold rounded-lg shadow-md shadow-command-600/20"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CREATE TASK MODAL */}
        {quickModal === 'createTask' && (
          <div>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Assign Support Task
                </h3>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Verify DNS propagation for SSL renewal"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Linked Customer
                </label>
                <select
                  value={taskCustomerId}
                  onChange={e => setTaskCustomerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) - {c.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date / Time
                  </label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value)}
                    placeholder="e.g. Billing, Technical"
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`p-2 rounded-lg border font-semibold text-center transition-all ${
                        taskPriority === p
                          ? 'border-command-500 bg-command-50 dark:bg-command-950/40 text-command-600 dark:text-command-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md shadow-emerald-600/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SCHEDULE FOLLOW-UP MODAL */}
        {quickModal === 'scheduleFollowUp' && (
          <div>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Schedule Follow-Up Callback
                </h3>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleFollowUp} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Customer
                </label>
                <select
                  value={fuCustomerId}
                  onChange={e => setFuCustomerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Follow-Up Reason <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Inquire about invoice verification confirmation"
                  value={fuReason}
                  onChange={e => setFuReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="text"
                    value={fuDate}
                    onChange={e => setFuDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Time
                  </label>
                  <input
                    type="text"
                    value={fuTime}
                    onChange={e => setFuTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFuPriority(p)}
                      className={`p-2 rounded-lg border font-semibold text-center transition-all ${
                        fuPriority === p
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md shadow-amber-600/20"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* OUTBOUND DIALER MODAL */}
        {quickModal === 'dialer' && (
          <div>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Direct Outbound Dialer
                </h3>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Dialed number display */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter phone number..."
                  value={dialerNumber}
                  onChange={e => setDialerNumber(e.target.value)}
                  className="w-full text-center text-xl font-mono font-bold py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-command-500"
                />
                {dialerNumber && (
                  <button
                    onClick={() => setDialerNumber(prev => prev.slice(0, -1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Number pad buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { num: '1', sub: '' },
                  { num: '2', sub: 'ABC' },
                  { num: '3', sub: 'DEF' },
                  { num: '4', sub: 'GHI' },
                  { num: '5', sub: 'JKL' },
                  { num: '6', sub: 'MNO' },
                  { num: '7', sub: 'PQRS' },
                  { num: '8', sub: 'TUV' },
                  { num: '9', sub: 'WXYZ' },
                  { num: '*', sub: '' },
                  { num: '0', sub: '+' },
                  { num: '#', sub: '' },
                ].map(item => (
                  <button
                    key={item.num}
                    onClick={() => setDialerNumber(prev => prev + item.num)}
                    className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-command-50 dark:hover:bg-command-950/30 hover:border-command-400 transition-colors flex flex-col items-center justify-center"
                  >
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {item.num}
                    </span>
                    {item.sub && (
                      <span className="text-[9px] font-semibold text-slate-400">
                        {item.sub}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Customer Fast Dial */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Fast Dial Recent Customers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {customers.slice(0, 3).map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleDial(c)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dial Button */}
              <button
                onClick={() => handleDial()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Connect Call</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
