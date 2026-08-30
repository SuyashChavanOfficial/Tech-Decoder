import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminReferrals() {
  const { user, getAllReferrals, updateReferralStatus } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    setLoading(true);
    const res = await getAllReferrals();
    if (res.success) {
      setReferrals(res.data);
    }
    setLoading(false);
  };

  const openModal = (referral, status) => {
    setSelectedReferral(referral);
    setNewStatus(status);
    setComment('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferral(null);
    setNewStatus('');
    setComment('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    const res = await updateReferralStatus(selectedReferral._id, newStatus, comment);
    
    if (res.success) {
      // Update local state without full reload
      setReferrals(prev => prev.map(ref => 
        ref._id === selectedReferral._id ? res.data : ref
      ));
      closeModal();
    } else {
      alert(res.message);
    }
    setSubmitting(false);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-grow pt-32 pb-24 px-margin-mobile flex items-center justify-center">
        <h2 className="text-on-surface font-headline-md">Access Denied. Admins only.</h2>
      </div>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display-md text-display-md text-on-surface">Admin: Referral Management</h1>
          <button 
            onClick={loadReferrals}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-colors font-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>

        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">No referrals found in the system.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 border-b border-white/10">
                    <th className="px-6 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant">Referrer</th>
                    <th className="px-6 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant">Referred User</th>
                    <th className="px-6 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant">Type</th>
                    <th className="px-6 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referrals.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-body-md text-on-surface">{item.referrerName}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">{item.referrerEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body-md text-on-surface">{item.referredName}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">{item.referredEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">
                        {item.type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          item.status === 'successful' || item.status === 'paid' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : item.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal(item, 'successful')}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-md text-sm transition-colors border border-green-500/20"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openModal(item, 'cancelled')}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm transition-colors border border-red-500/20"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {item.status !== 'pending' && (
                          <span className="text-xs text-on-surface-variant mr-2">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container rounded-2xl w-full max-w-md border border-white/10 overflow-hidden"
          >
            <div className={`p-6 border-b border-white/10 ${
              newStatus === 'successful' ? 'bg-green-500/5' : 'bg-red-500/5'
            }`}>
              <h3 className="font-headline-md text-on-surface flex items-center gap-2">
                <span className={`material-symbols-outlined ${
                  newStatus === 'successful' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {newStatus === 'successful' ? 'check_circle' : 'cancel'}
                </span>
                {newStatus === 'successful' ? 'Approve Referral' : 'Reject Referral'}
              </h3>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6">
              <p className="text-on-surface-variant font-body-sm mb-4">
                You are about to mark the referral for <strong>{selectedReferral?.referredName}</strong> as 
                <span className={newStatus === 'successful' ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                  {newStatus}
                </span>.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-label-md text-on-surface-variant mb-2">
                  Reason / Comment (Required)
                </label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={newStatus === 'successful' ? 'e.g., Verified project booking.' : 'e.g., Fraudulent booking / cancelled project.'}
                  className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-2">
                  This comment will be visible to the referring user on their dashboard.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-full font-label-md text-on-surface hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className={`px-5 py-2.5 rounded-full font-label-md transition-colors disabled:opacity-50 flex items-center gap-2 ${
                    newStatus === 'successful' 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {submitting && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Confirm {newStatus === 'successful' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
