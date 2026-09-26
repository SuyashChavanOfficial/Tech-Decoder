import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getConsultationById, updateConsultation, deleteConsultation } = useAuth();

  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for status & admin notes
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Copy feedback
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    const res = await getConsultationById(id);
    if (res.success) {
      setConsultation(res.data);
      setStatus(res.data.status || 'pending');
      setAdminNotes(res.data.adminNotes || '');
    } else {
      setError(res.message || 'Consultation not found.');
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateConsultation(id, {
      status,
      adminNotes: adminNotes.trim()
    });

    if (res.success) {
      setConsultation(res.data);
      setSaveSuccessMsg('Consultation updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } else {
      alert(res.message);
    }
    setSaving(false);
  };

  const handleSoftDelete = async () => {
    setDeleting(true);
    const res = await deleteConsultation(id);
    if (res.success) {
      navigate('/dashboard?tab=consultations');
    } else {
      alert(res.message);
      setDeleting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCleanWhatsAppLink = (number, studentName) => {
    const digitsOnly = (number || '').replace(/\D/g, '');
    const cleanNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
    const message = encodeURIComponent(
      `Hi ${studentName}, this is regarding your project consultation request with Tech-Decoder!`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'contacted':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30';
    }
  };

  const getPlanBadge = (plan) => {
    if (!plan) return 'bg-white/5 text-on-surface-variant border border-white/10';
    if (plan.includes('Complete')) return 'bg-primary/10 text-primary border border-primary/30';
    if (plan.includes('Priority')) return 'bg-purple-500/10 text-purple-300 border border-purple-500/30';
    return 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30';
  };

  if (!user || user.role !== 'admin') {
    return (
      <main className="flex-grow pt-32 pb-24 px-margin-mobile flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center max-w-md">
          <span className="material-symbols-outlined text-red-400 text-5xl mb-4">gpp_maybe</span>
          <h2 className="text-on-surface font-headline-md mb-2">Access Denied</h2>
          <p className="text-on-surface-variant text-body-sm">
            This page is restricted to administrators only.
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-grow pt-32 pb-24 px-margin-mobile flex flex-col items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl mb-3">
          progress_activity
        </span>
        <p className="text-on-surface-variant text-sm">Loading submission details...</p>
      </main>
    );
  }

  if (error || !consultation) {
    return (
      <main className="flex-grow pt-32 pb-24 px-margin-mobile flex flex-col items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center max-w-md">
          <span className="material-symbols-outlined text-amber-400 text-5xl mb-3">error</span>
          <h2 className="text-on-surface font-headline-md mb-2">Submission Not Found</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            {error || 'This consultation does not exist or may have been deleted.'}
          </p>
          <Link
            to="/dashboard?tab=consultations"
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Back to Consultations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard?tab=consultations"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface text-sm transition-colors border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Consultations</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold ${getStatusBadge(consultation.status || 'pending')}`}>
              Status: {consultation.status || 'Pending'}
            </span>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Page Title & Meta */}
        <div className="mb-8">
          <h1 className="font-display-md text-display-md text-on-surface flex items-center gap-3">
            {consultation.name}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Submitted on{' '}
            {new Date(consultation.createdAt).toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </p>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Student Details & Direct Outreach */}
          <div className="lg:col-span-1 space-y-6">
            {/* Student Info Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                Student Profile
              </h3>

              <div className="space-y-4 text-sm divide-y divide-white/5">
                <div className="pt-2">
                  <span className="text-xs text-on-surface-variant block">Full Name</span>
                  <span className="font-medium text-on-surface text-base">{consultation.name}</span>
                </div>

                <div className="pt-3">
                  <span className="text-xs text-on-surface-variant block">College / University</span>
                  <span className="font-medium text-on-surface">{consultation.college}</span>
                </div>

                <div className="pt-3">
                  <span className="text-xs text-on-surface-variant block">WhatsApp / Phone</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-on-surface font-medium">{consultation.whatsapp}</span>
                    <button
                      onClick={() => copyToClipboard(consultation.whatsapp)}
                      className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-white/5 transition-colors"
                      title="Copy Number"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <span className="text-xs text-on-surface-variant block">Email Address</span>
                  <span className="font-medium text-on-surface break-all">
                    {consultation.email || 'None provided'}
                  </span>
                </div>

                <div className="pt-3">
                  <span className="text-xs text-on-surface-variant block">Referral Code</span>
                  {consultation.referralCode ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mt-1 font-mono font-semibold">
                      <span className="material-symbols-outlined text-[14px]">loyalty</span>
                      {consultation.referralCode}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant text-xs mt-1 block">Direct / Organic</span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Outreach Action Box */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">send</span>
                Direct Outreach
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href={getCleanWhatsAppLink(consultation.whatsapp, consultation.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium text-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Chat on WhatsApp</span>
                </a>

                {consultation.email && (
                  <a
                    href={`mailto:${consultation.email}?subject=Tech-Decoder Project Consultation Follow-up`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-medium text-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    <span>Send Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Plan Tier Box */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 shadow-xl">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                Selected Package
              </h3>
              <div className="pt-1">
                <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getPlanBadge(consultation.plan)}`}>
                  {consultation.plan || 'Custom / Discussion'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Project Requirements & Admin Workflow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Requirements Card */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                Project Requirements & Description
              </h3>

              <div className="p-5 rounded-xl bg-surface-container-high/60 border border-white/5 text-on-surface text-base whitespace-pre-wrap leading-relaxed min-h-[140px]">
                {consultation.projectDescription ? (
                  consultation.projectDescription
                ) : (
                  <span className="text-on-surface-variant italic">No project description was entered by the student.</span>
                )}
              </div>
            </div>

            {/* Follow-up Status & Admin Notes Form */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
                Admin Workflow & Internal Notes
              </h3>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-on-surface font-semibold block mb-2">
                    Workflow Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full sm:w-64 bg-surface-container-high border border-white/10 text-on-surface rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed / Enrolled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-on-surface font-semibold block mb-2">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={6}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Log discussion history, call summaries, mentors assigned, custom pricing quoted, next steps..."
                    className="w-full p-4 rounded-xl bg-surface-container-high/60 border border-white/10 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary text-sm leading-relaxed"
                  />
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SOFT DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
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
                Are you sure you want to delete this consultation for{' '}
                <strong className="text-on-surface">{consultation.name}</strong>? It will be marked as{' '}
                <code className="text-xs bg-white/5 px-1 py-0.5 rounded text-amber-400 font-mono">is_deleted: true</code> and hidden from active views.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSoftDelete}
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
    </main>
  );
}
