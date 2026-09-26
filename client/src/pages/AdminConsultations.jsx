import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminConsultations({ isEmbedded = false }) {
  const navigate = useNavigate();
  const { user, getAllConsultations, updateConsultation, deleteConsultation } = useAuth();

  const [consultations, setConsultations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Delete Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Copy Feedback
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, [statusFilter, planFilter]);

  const fetchConsultations = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (planFilter !== 'all') params.plan = planFilter;
    if (searchQuery.trim()) params.search = searchQuery.trim();

    const res = await getAllConsultations(params);
    if (res.success) {
      setConsultations(res.data);
      if (res.stats) {
        setStats(res.stats);
      }
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchConsultations();
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    const res = await updateConsultation(id, { status: newStatus });
    if (res.success) {
      setConsultations(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );
      fetchConsultations();
    } else {
      alert(res.message);
    }
  };

  const confirmSoftDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    const res = await deleteConsultation(itemToDelete._id);
    if (res.success) {
      setConsultations(prev => prev.filter(c => c._id !== itemToDelete._id));
      setItemToDelete(null);
      fetchConsultations();
    } else {
      alert(res.message);
    }
    setDeleting(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCleanWhatsAppLink = (number, studentName) => {
    const digitsOnly = (number || '').replace(/\D/g, '');
    const cleanNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
    const message = encodeURIComponent(
      `Hi ${studentName}, this is regarding your project consultation request with Tech-Decoder!`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'contacted':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <main className="flex-grow pt-32 pb-24 px-margin-mobile flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center max-w-md">
          <span className="material-symbols-outlined text-red-400 text-5xl mb-4">gpp_maybe</span>
          <h2 className="text-on-surface font-headline-md mb-2">Access Denied</h2>
          <p className="text-on-surface-variant text-body-sm">
            This screen is restricted to administrators only.
          </p>
        </div>
      </main>
    );
  }

  const Container = isEmbedded ? 'div' : 'main';
  const containerClass = isEmbedded
    ? 'w-full'
    : 'flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full';

  return (
    <Container className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
              <h1 className="font-display-md text-display-md text-on-surface">Consultation Submissions</h1>
            </div>
            <p className="text-on-surface-variant font-body-sm mt-1">
              Review and manage incoming student project consultation requests in real-time.
            </p>
          </div>

          <button
            onClick={fetchConsultations}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-all font-label-md cursor-pointer border border-white/5 active:scale-95 shadow-md"
          >
            <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>
        </div>

        {/* High-Level Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Total Bookings</span>
            <span className="text-2xl lg:text-3xl font-bold text-on-surface mt-2">{stats.total}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">Pending Review</span>
            <span className="text-2xl lg:text-3xl font-bold text-amber-300 mt-2">{stats.pending}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-medium">Contacted</span>
            <span className="text-2xl lg:text-3xl font-bold text-blue-300 mt-2">{stats.contacted}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-medium">In Progress</span>
            <span className="text-2xl lg:text-3xl font-bold text-purple-300 mt-2">{stats.in_progress}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">Completed</span>
            <span className="text-2xl lg:text-3xl font-bold text-emerald-300 mt-2">{stats.completed}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, college, email, phone, referral code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-high/60 border border-white/10 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-all"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-high border border-white/10 text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>Plan:</span>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-surface-container-high border border-white/10 text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value="all">All Plans</option>
                <option value="Basic Project">Basic Project</option>
                <option value="Priority Project">Priority Project</option>
                <option value="Complete Project Package">Complete Project Package</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-[36px] text-primary mb-3">
                progress_activity
              </span>
              <p className="text-sm font-medium">Loading consultations...</p>
            </div>
          ) : consultations.length === 0 ? (
            <div className="p-16 text-center">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-5xl mb-3">
                inbox
              </span>
              <p className="text-on-surface font-headline-sm mb-1">No consultation requests found</p>
              <p className="text-on-surface-variant text-sm">
                No submissions matched the selected filters or search terms.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/60 border-b border-white/10 text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">College</th>
                    <th className="py-4 px-6">Contact & Actions</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-body-sm">
                  {consultations.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => navigate(`/admin/consultations/${item._id}`)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      {/* Student info */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-medium text-on-surface text-base group-hover:text-primary transition-colors">
                          {item.name}
                        </div>
                        {item.email && (
                          <div className="text-xs text-on-surface-variant/80 mt-0.5">{item.email}</div>
                        )}
                        <div className="text-[11px] text-on-surface-variant/60 mt-1">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* College */}
                      <td className="py-4 px-6 align-top text-on-surface-variant">
                        <span className="inline-block max-w-[180px] truncate font-medium text-on-surface">
                          {item.college}
                        </span>
                        {item.referralCode && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              <span className="material-symbols-outlined text-[12px]">loyalty</span>
                              Ref: {item.referralCode}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Quick Contact buttons */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* Direct WhatsApp link */}
                            <a
                              href={getCleanWhatsAppLink(item.whatsapp, item.name)}
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                              <span>WhatsApp</span>
                            </a>

                            {/* Copy phone button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.whatsapp, item._id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-on-surface-variant hover:text-on-surface text-xs transition-colors"
                              title="Copy Phone Number"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {copiedId === item._id ? 'check' : 'content_copy'}
                              </span>
                            </button>
                          </div>

                          <span className="text-xs text-on-surface-variant/80 font-mono">
                            {item.whatsapp}
                          </span>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6 align-top">
                        <select
                          value={item.status || 'pending'}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleQuickStatusChange(item._id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-medium cursor-pointer outline-none transition-colors ${getStatusBadge(
                            item.status || 'pending'
                          )} bg-transparent`}
                        >
                          <option value="pending" className="bg-[#191c26] text-amber-400">Pending</option>
                          <option value="contacted" className="bg-[#191c26] text-blue-400">Contacted</option>
                          <option value="in_progress" className="bg-[#191c26] text-purple-400">In Progress</option>
                          <option value="completed" className="bg-[#191c26] text-emerald-400">Completed</option>
                          <option value="cancelled" className="bg-[#191c26] text-red-400">Cancelled</option>
                        </select>
                      </td>

                      {/* Delete Action & Row Arrow */}
                      <td className="py-4 px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemToDelete(item);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 transition-colors"
                            title="Soft Delete Submission"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>

                          <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-[20px]">
                            chevron_right
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* SOFT DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#13161e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl">delete_sweep</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">Delete Consultation?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Are you sure you want to delete the submission for{' '}
                <strong className="text-on-surface">{itemToDelete.name}</strong>? It will be marked as{' '}
                <code className="text-xs bg-white/5 px-1 py-0.5 rounded text-amber-400 font-mono">is_deleted: true</code> and hidden from active views.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSoftDelete}
                  disabled={deleting}
                  className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors active:scale-95 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Submission'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Container>
  );
}
