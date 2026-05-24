import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ReferralShare from '../components/ReferralShare';

export default function Dashboard() {
  const { 
    user, 
    loading,
    checklist, 
    toggleChecklist, 
    addChecklistItem, 
    uploadedFiles, 
    uploadFile, 
    progressPercentage,
    modulesCompleted,
    getAllReferrals,
    updateReferralStatus,
    getAllUsers,
    updateUserRole,
    logout
  } = useAuth();
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  
  // Tab states
  const activeTab = searchParams.get('tab') || 'overview';
  
  // Local UI states
  const [dragActive, setDragActive] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Referral Manager States
  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(true);
  const [referralSubTab, setReferralSubTab] = useState('records'); // 'records' or 'history'
  
  // Users List States
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [inspectedUser, setInspectedUser] = useState(null);

  // Status Edit Modal States
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [statusComment, setStatusComment] = useState('');

  // Role Change Modal States
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRole, setNewRole] = useState('student');
  const [newDomain, setNewDomain] = useState('');

  // Info/Alert Modal States
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Route protection redirect
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Security Guard: Prevent non-admins from viewing referrals and users tabs
  useEffect(() => {
    if (user && user.role !== 'admin' && (activeTab === 'referrals' || activeTab === 'users')) {
      setActiveTab('overview');
    }
  }, [user, activeTab]);

  // Fetch referrals for admins
  const fetchReferrals = async () => {
    if (!user || user.role !== 'admin') return;
    setReferralsLoading(true);
    const res = await getAllReferrals();
    if (res.success) {
      setReferrals(res.data);
    } else {
      showErrorAlert('Fetch Failed', res.message);
    }
    setReferralsLoading(false);
  };

  // Fetch users for admins
  const fetchUsers = async () => {
    if (!user || user.role !== 'admin') return;
    setUsersLoading(true);
    const res = await getAllUsers();
    if (res.success) {
      setUsers(res.data);
    } else {
      showErrorAlert('Fetch Failed', res.message);
    }
    setUsersLoading(false);
  };

  // Trigger loads based on active tabs
  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'referrals') {
        fetchReferrals();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [activeTab, user]);

  // Sync inspectedUser data if users list gets updated
  useEffect(() => {
    if (inspectedUser && users.length > 0) {
      const updated = users.find(u => u._id === inspectedUser._id);
      if (updated) {
        setInspectedUser(updated);
      }
    }
  }, [users, inspectedUser]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
          <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Loading Dashboard</p>
        </div>
      </div>
    );
  }

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
    // Reset inspector when switching tabs
    if (tabName !== 'users') {
      setInspectedUser(null);
    }
  };

  const showErrorAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  // Drag Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    if (file.size > 10 * 1024 * 1024) {
      showErrorAlert('Upload Rejected', 'File exceeds the secure size limit of 10MB.');
      return;
    }
    const safeExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.zip'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!safeExtensions.includes(fileExt)) {
      showErrorAlert('Format Invalid', 'Only PDF, PNG, JPG, and ZIP files are permitted for architectural reviews.');
      return;
    }
    uploadFile(file.name, `${sizeMB} MB`);
    showErrorAlert('File Uploaded', `Successfully uploaded "${file.name}" for architecture review.`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addChecklistItem(newTaskText);
    setNewTaskText('');
  };

  const openStatusEditor = (refRecord) => {
    setSelectedReferral(refRecord);
    setNewStatus(refRecord.status);
    setStatusComment('');
    setIsEditStatusOpen(true);
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!statusComment.trim()) {
      showErrorAlert('Input Required', 'Please enter a description or reason for this status change.');
      return;
    }
    const res = await updateReferralStatus(selectedReferral._id, newStatus, statusComment);
    if (res.success) {
      setIsEditStatusOpen(false);
      fetchReferrals();
      showErrorAlert('Success', 'Referral status updated successfully.');
    } else {
      showErrorAlert('Update Failed', res.message);
    }
  };

  const openRoleChangeEditor = (uItem) => {
    setSelectedUserForRole(uItem);
    setNewRole(uItem.role);
    setNewDomain(uItem.domain || '');
    setIsEditRoleOpen(true);
  };

  const handleRoleUpdateSubmit = async (e) => {
    e.preventDefault();
    const res = await updateUserRole(selectedUserForRole._id, newRole, newDomain);
    if (res.success) {
      setIsEditRoleOpen(false);
      fetchUsers();
      showErrorAlert('Success', 'User role updated successfully.');
    } else {
      showErrorAlert('Update Failed', res.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'successful': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <>
      <main className="flex-grow pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container mb-4 overflow-hidden border border-white/10 relative">
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
                src={user.avatar}
              />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1 truncate max-w-full">{user.name}</h2>
            <p className="font-label-sm text-label-sm text-primary mb-4 bg-primary/10 px-3 py-1 rounded capitalize">{user.role}</p>
            
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary rounded-full glow-effect transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant w-full text-right">{progressPercentage}% Mentorship Complete</p>
            
            {/* Sidebar Logout Button */}
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="mt-5 w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Logout</span>
            </button>
          </div>

          <nav className="glass-panel rounded-xl p-4 flex flex-col space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                activeTab === 'overview' 
                  ? 'bg-surface-container text-primary font-bold border border-white/10' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'overview' ? "'FILL' 1" : "" }}>dashboard</span>
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                activeTab === 'tasks' 
                  ? 'bg-surface-container text-primary font-bold border border-white/10' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'tasks' ? "'FILL' 1" : "" }}>task</span>
              <span>Tasks</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('meetings')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                activeTab === 'meetings' 
                  ? 'bg-surface-container text-primary font-bold border border-white/10' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'meetings' ? "'FILL' 1" : "" }}>calendar_month</span>
              <span>Meetings</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                activeTab === 'documents' 
                  ? 'bg-surface-container text-primary font-bold border border-white/10' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'documents' ? "'FILL' 1" : "" }}>folder</span>
              <span>Documents</span>
            </button>

            {user.role === 'admin' && (
              <>
                <button 
                  onClick={() => setActiveTab('referrals')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                    activeTab === 'referrals' 
                      ? 'bg-surface-container text-primary font-bold border border-white/10' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'referrals' ? "'FILL' 1" : "" }}>local_activity</span>
                  <span>Referral Manager</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                    activeTab === 'users' 
                      ? 'bg-surface-container text-primary font-bold border border-white/10' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'users' ? "'FILL' 1" : "" }}>group</span>
                  <span>Users</span>
                </button>
              </>
            )}

            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left w-full cursor-pointer transition-all ${
                activeTab === 'profile' 
                  ? 'bg-surface-container text-primary font-bold border border-white/10' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "" }}>person</span>
              <span>Profile</span>
            </button>
          </nav>
        </aside>

        {/* Dashboard Main Canvas */}
        <div className="lg:col-span-9 space-y-gutter">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-gutter"
            >
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <>
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                    <div>
                      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Project Tracker</h1>
                      <p className="font-body-lg text-body-lg text-on-surface-variant">System Architecture &amp; Mentor Dashboard</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-panel text-on-surface font-label-sm text-label-sm border border-white/10">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        <span>Mentor: Online</span>
                      </div>
                    </div>
                  </header>

                  {/* Bento Grid Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    <div className="glass-panel rounded-xl p-6 relative overflow-hidden group border border-white/10">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-500" />
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Modules Completed</p>
                      <div className="flex items-end space-x-2">
                        <span className="font-display-xl text-display-xl text-on-surface">{modulesCompleted}</span>
                        <span className="font-body-lg text-body-lg text-on-surface-variant mb-2">/ 12</span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-xl p-6 relative overflow-hidden group border border-white/10">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-all duration-500" />
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Pending Checklist Tasks</p>
                      <div className="flex items-end space-x-2">
                        <span className="font-display-xl text-display-xl text-on-surface">
                          {checklist.filter(c => !c.checked).length}
                        </span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Overall Progress</p>
                      <div className="relative w-full h-16 flex items-center justify-center">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeLinecap="round" strokeWidth="8" />
                          <path 
                            className="glow-effect transition-all duration-500" 
                            d="M 10 50 A 40 40 0 0 1 90 50" 
                            fill="none" 
                            stroke="#adc6ff" 
                            strokeDasharray="126" 
                            strokeDashoffset={126 - (126 * progressPercentage) / 100} 
                            strokeLinecap="round" 
                            strokeWidth="8" 
                          />
                        </svg>
                        <span className="absolute bottom-0 font-headline-md text-headline-md text-primary">{progressPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Split Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                    <div className="space-y-gutter">
                      {/* Tasks preview */}
                      <div className="glass-panel rounded-xl p-6 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-headline-md text-headline-md text-on-surface">Prep Tasks</h3>
                          <button onClick={() => setActiveTab('tasks')} className="text-primary hover:text-primary-fixed text-xs flex items-center cursor-pointer">
                            <span>Manage All</span>
                            <span className="material-symbols-outlined text-[16px] ml-1">chevron_right</span>
                          </button>
                        </div>
                        <div className="space-y-4">
                          {checklist.slice(0, 3).map(item => (
                            <label key={item.id || item._id} className="flex items-start space-x-3 group cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={item.checked}
                                onChange={() => toggleChecklist(item.id || item._id)}
                                className="mt-1 rounded border-outline bg-surface-dim text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer w-4 h-4"
                              />
                              <div>
                                <p className={`font-body-md text-body-md transition-colors ${item.checked ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                                  {item.text}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Document upload preview */}
                      <div onClick={() => setActiveTab('documents')} className="glass-panel rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-colors text-center cursor-pointer group flex flex-col items-center justify-center min-h-[140px]">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-3xl mb-2">upload_file</span>
                        <h4 className="font-body-md text-body-md text-on-surface font-semibold">Upload Documents</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Architecture diagrams &amp; notes</p>
                      </div>
                    </div>

                    <div className="space-y-gutter">
                      {/* Mentor Notes */}
                      <div className="glass-panel rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-6">
                          <span className="material-symbols-outlined text-primary">speaker_notes</span>
                          <h3 className="font-headline-md text-headline-md text-on-surface">Mentor Feedback</h3>
                        </div>
                        <div className="space-y-6 border-l-2 border-surface-container pl-4">
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-primary glow-effect" />
                            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Today, 10:00 AM</p>
                            <p className="font-body-md text-body-md text-on-surface">Good progress on the auth flow. Ensure you document the JWT refresh token strategy clearly for the viva.</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-surface-container-high" />
                            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Yesterday</p>
                            <p className="font-body-md text-body-md text-on-surface-variant">Reviewed PR #42. Added some comments regarding error handling in the middleware.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab 2: Detailed Tasks */}
              {activeTab === 'tasks' && (
                <div className="glass-panel rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface">Viva &amp; Project Prep Tasks</h2>
                      <p className="text-sm text-on-surface-variant">Manage your checklist to prepare for reviews</p>
                    </div>
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-all px-4 py-2 rounded-lg flex items-center space-x-2 font-label-sm text-label-sm uppercase tracking-wider cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">{showAddForm ? 'close' : 'add'}</span>
                      <span>{showAddForm ? 'Cancel' : 'Add Task'}</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAddForm && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddTask}
                        className="mb-6 bg-surface-container-low border border-white/10 p-4 rounded-xl flex items-center gap-3 overflow-hidden"
                      >
                        <input 
                          type="text" 
                          placeholder="Type task details (e.g., Draw API Gateway layout...)"
                          value={newTaskText}
                          onChange={e => setNewTaskText(e.target.value)}
                          className="flex-grow bg-transparent border-b border-white/10 px-3 py-2 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                        />
                        <button 
                          type="submit" 
                          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:opacity-90 active:scale-95 cursor-pointer flex items-center space-x-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          <span>Save</span>
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    {checklist.map(item => (
                      <div key={item.id || item._id} className="flex items-center justify-between bg-surface-container/30 border border-white/5 p-4 rounded-lg hover:border-white/10 transition-colors">
                        <label className="flex items-start space-x-3 group cursor-pointer select-none flex-grow">
                          <input 
                            type="checkbox" 
                            checked={item.checked}
                            onChange={() => toggleChecklist(item.id || item._id)}
                            className="mt-1 rounded border-outline bg-surface-dim text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer w-5 h-5"
                          />
                          <div>
                            <p className={`font-body-md text-body-md transition-colors ${item.checked ? 'text-on-surface-variant line-through' : 'text-on-surface font-medium'}`}>
                              {item.text}
                            </p>
                          </div>
                        </label>
                        <span className={`text-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider ${item.checked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {item.checked ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Upcoming Meetings */}
              {activeTab === 'meetings' && (
                <div className="glass-panel rounded-xl p-6 border border-white/10">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Upcoming Mentoring Sessions</h2>
                  <p className="text-sm text-on-surface-variant mb-6">Review system structures, database schemas, and practice live viva tests.</p>

                  <div className="space-y-4">
                    <div className="bg-surface-container/50 border border-white/5 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 border border-primary/20 text-primary text-center px-4 py-2.5 rounded-lg font-bold w-16">
                          <p className="text-xs uppercase">May</p>
                          <p className="text-xl">28</p>
                        </div>
                        <div>
                          <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">Architecture &amp; DB Schema Review</h3>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            10:30 AM - 11:30 AM
                          </p>
                          <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Confirmed</span>
                        </div>
                      </div>
                      <a 
                        href="https://meet.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
                      >
                        <span className="material-symbols-outlined">videocam</span>
                        <span>Join Google Meet</span>
                      </a>
                    </div>

                    <div className="bg-surface-container/50 border border-white/5 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 border border-primary/20 text-primary text-center px-4 py-2.5 rounded-lg font-bold w-16">
                          <p className="text-xs uppercase">Jun</p>
                          <p className="text-xl">04</p>
                        </div>
                        <div>
                          <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">Dummy Viva Practice Session</h3>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            2:00 PM - 3:30 PM
                          </p>
                          <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Scheduled</span>
                        </div>
                      </div>
                      <a 
                        href="https://meet.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
                      >
                        <span className="material-symbols-outlined">videocam</span>
                        <span>Join Google Meet</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Documents Upload & Management */}
              {activeTab === 'documents' && (
                <div className="space-y-gutter">
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`glass-panel rounded-xl p-8 border border-dashed hover:border-primary/50 transition-colors text-center cursor-pointer group flex flex-col items-center justify-center min-h-[220px] ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-white/20'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.zip"
                    />
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-4xl">upload_file</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Upload Architecture Reviews</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                      Drag and drop files or click to browse. Supported formats: **PDF, PNG, JPG, ZIP** up to **10MB**.
                    </p>
                  </div>

                  {uploadedFiles.length > 0 ? (
                    <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
                      <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Uploaded Documents ({uploadedFiles.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.map((file, idx) => (
                          <div key={file.id || file._id || idx} className="flex justify-between items-center bg-surface-container-low border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all">
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <span className="material-symbols-outlined text-primary text-[28px] flex-shrink-0">description</span>
                              <div className="overflow-hidden">
                                <span className="text-on-surface font-semibold text-sm truncate block" title={file.name}>{file.name}</span>
                                <span className="text-[11px] text-on-surface-variant block mt-0.5">{file.date}</span>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-on-surface-variant ml-2 bg-surface-container px-2.5 py-1 rounded">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl p-8 border border-white/10 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2 text-white/25">folder_open</span>
                      <p className="text-sm">No files uploaded yet. Drag a file to submit it for review.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Referral Manager (Admin Only) */}
              {activeTab === 'referrals' && user.role === 'admin' && (
                <div className="glass-panel rounded-xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface">Referral Manager</h2>
                      <p className="text-sm text-on-surface-variant">Track referral claims, audits, and payouts</p>
                    </div>
                    
                    {/* Double Tabs */}
                    <div className="flex bg-surface-container rounded-lg p-1 border border-white/5">
                      <button 
                        onClick={() => setReferralSubTab('records')}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${referralSubTab === 'records' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        Records
                      </button>
                      <button 
                        onClick={() => setReferralSubTab('history')}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${referralSubTab === 'history' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        Status History
                      </button>
                    </div>
                  </div>

                  {referralsLoading ? (
                    <div className="py-12 flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" />
                      <p className="text-sm text-on-surface-variant font-mono">Loading Referral Records...</p>
                    </div>
                  ) : referrals.length === 0 ? (
                    <div className="py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2 text-white/20">local_activity</span>
                      <p className="text-sm">No referral activities found in the database.</p>
                    </div>
                  ) : referralSubTab === 'records' ? (
                    /* Table view */
                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-on-surface-variant font-semibold">
                            <th className="py-3 px-2">S/N</th>
                            <th className="py-3 px-4">Referrer Details</th>
                            <th className="py-3 px-4">Referred Friend</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Reward</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {referrals.map((refItem, idx) => (
                            <tr key={refItem._id} className="hover:bg-white/5 transition-colors">
                              <td className="py-4 px-2 font-mono font-bold text-on-surface-variant">{idx + 1}</td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-on-surface">{refItem.referrerName}</div>
                                <div className="text-xs text-on-surface-variant">{refItem.referrerEmail}</div>
                                <span className="text-[10px] mt-1 inline-block bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold uppercase">{refItem.referrerCode}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-on-surface">{refItem.referredName}</div>
                                <div className="text-xs text-on-surface-variant">{refItem.referredEmail}</div>
                              </td>
                              <td className="py-4 px-4 uppercase">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${refItem.type === 'consultation' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                  {refItem.type}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono font-bold text-primary">${refItem.rewardAmount || 0}</td>
                              <td className="py-4 px-4">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${getStatusBadgeClass(refItem.status)}`}>
                                  {refItem.status}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-center">
                                <button 
                                  onClick={() => openStatusEditor(refItem)}
                                  className="text-xs bg-surface-container hover:bg-surface-container-high border border-white/10 px-3 py-1.5 rounded-lg text-primary hover:text-primary-fixed transition-all cursor-pointer font-semibold uppercase tracking-wider"
                                >
                                  Edit Status
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Audit Log history */
                    <div className="space-y-6 pt-4">
                      {referrals
                        .filter(refItem => refItem.statusHistory && refItem.statusHistory.length > 0)
                        .flatMap(refItem => refItem.statusHistory.map(hist => ({ ...hist, referrerName: refItem.referrerName, referredName: refItem.referredName, refId: refItem._id })))
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .map((historyItem, idx) => (
                          <div key={idx} className="relative border-l-2 border-surface-container pl-6 pb-6 last:pb-0">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-container-high border-2 border-background flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <span className="text-xs text-on-surface-variant font-mono">{new Date(historyItem.updatedAt).toLocaleString()}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getStatusBadgeClass(historyItem.status)}`}>
                                {historyItem.status}
                              </span>
                            </div>
                            <div className="bg-surface-container-low border border-white/5 p-4 rounded-xl">
                              <p className="text-sm font-semibold mb-1 text-on-surface">
                                Referrer: <span className="text-primary">{historyItem.referrerName}</span> &rarr; Referred: <span className="text-primary">{historyItem.referredName}</span>
                              </p>
                              <p className="text-sm text-on-surface-variant mt-2 italic font-serif">
                                &ldquo;{historyItem.comment}&rdquo;
                              </p>
                            </div>
                          </div>
                        ))}
                      {referrals.filter(refItem => refItem.statusHistory && refItem.statusHistory.length > 0).length === 0 && (
                        <div className="text-center py-6 text-on-surface-variant">
                          <p className="text-sm">No status changes have been documented yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Users List (Admin Only) */}
              {activeTab === 'users' && user.role === 'admin' && (
                <div className="glass-panel rounded-xl p-6 border border-white/10">
                  {inspectedUser ? (
                    /* Detailed User Profile Inspector View */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                        <button 
                          onClick={() => setInspectedUser(null)}
                          className="flex items-center space-x-2 text-primary hover:text-primary-fixed transition-colors text-sm font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                          <span>Back to Users Directory</span>
                        </button>
                        <span className="text-xs text-on-surface-variant font-mono">User ID: {inspectedUser._id}</span>
                      </div>

                      {/* Header profile card */}
                      <div className="glass-panel rounded-xl p-6 border border-white/10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <div className="w-20 h-20 rounded-full bg-surface-container overflow-hidden border border-white/10 flex-shrink-0">
                          <img src={inspectedUser.avatar} alt={inspectedUser.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow space-y-1">
                          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{inspectedUser.name}</h3>
                          <p className="text-sm font-mono text-on-surface-variant">{inspectedUser.email}</p>
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                            <span className="text-[10px] px-2.5 py-1 rounded font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                              {inspectedUser.role}
                            </span>
                            {inspectedUser.role !== 'student' && inspectedUser.domain && (
                              <span className="text-[10px] px-2.5 py-1 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {inspectedUser.domain}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details stats grids */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                        <div className="bg-surface-container/30 border border-white/5 p-5 rounded-xl text-center">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Referral Code</span>
                          <span className="text-base font-mono font-bold text-primary">{inspectedUser.referralCode || 'N/A'}</span>
                        </div>
                        <div className="bg-surface-container/30 border border-white/5 p-5 rounded-xl text-center">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Referred Count</span>
                          <span className="text-xl font-bold text-on-surface">{inspectedUser.referrals || 0} Friends</span>
                        </div>
                        <div className="bg-surface-container/30 border border-white/5 p-5 rounded-xl text-center">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Completed Modules</span>
                          <span className="text-xl font-bold text-on-surface">{inspectedUser.modulesCompleted || 0} / 12</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                        {/* Task checklist details */}
                        <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Prep Checklist Details</h4>
                          {inspectedUser.checklist && inspectedUser.checklist.length > 0 ? (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {inspectedUser.checklist.map((item, index) => (
                                <div key={item._id || index} className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg text-sm border border-white/5">
                                  <span className={item.checked ? 'text-on-surface-variant line-through' : 'text-on-surface font-medium'}>{item.text}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${item.checked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {item.checked ? 'Done' : 'Pending'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-on-surface-variant">No checklist tasks defined.</p>
                          )}
                        </div>

                        {/* Uploaded documents details */}
                        <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Uploaded Documents</h4>
                          {inspectedUser.uploadedFiles && inspectedUser.uploadedFiles.length > 0 ? (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {inspectedUser.uploadedFiles.map((file, idx) => (
                                <div key={file._id || idx} className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg text-sm border border-white/5">
                                  <span className="text-on-surface truncate max-w-[200px]" title={file.name}>{file.name}</span>
                                  <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{file.size}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-on-surface-variant">No documents uploaded.</p>
                          )}
                        </div>
                      </div>

                      {/* Referral history logs (where this user is the referrer) */}
                      <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Referral Invitation History</h4>
                        {referrals.filter(refItem => refItem.referrerCode === inspectedUser.referralCode).length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                              <thead>
                                <tr className="border-b border-white/10 text-on-surface-variant font-semibold">
                                  <th className="py-2 px-1">Referred Friend</th>
                                  <th className="py-2 px-4">Type</th>
                                  <th className="py-2 px-4">Commission</th>
                                  <th className="py-2 px-4">Status</th>
                                  <th className="py-2 px-4">Date Invited</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {referrals
                                  .filter(refItem => refItem.referrerCode === inspectedUser.referralCode)
                                  .map(refItem => (
                                    <tr key={refItem._id} className="hover:bg-white/5 transition-colors">
                                      <td className="py-3 px-1">
                                        <div className="font-semibold text-on-surface">{refItem.referredName}</div>
                                        <div className="text-xs text-on-surface-variant">{refItem.referredEmail}</div>
                                      </td>
                                      <td className="py-3 px-4 uppercase text-xs">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${refItem.type === 'consultation' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                          {refItem.type}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4 font-mono font-bold text-primary">${refItem.rewardAmount || 0}</td>
                                      <td className="py-3 px-4">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${getStatusBadgeClass(refItem.status)}`}>
                                          {refItem.status}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4 text-xs font-mono text-on-surface-variant">
                                        {new Date(refItem.createdAt).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-on-surface-variant">No referred friends invited yet.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* General directory listing */
                    <>
                      <div className="mb-6">
                        <h2 className="font-headline-md text-headline-md text-on-surface">Registered Platform Users</h2>
                        <p className="text-sm text-on-surface-variant font-medium">View profiles, domains, roles, and statistics for all accounts. Click on any profile row to inspect detailed metrics.</p>
                      </div>

                      {usersLoading ? (
                        <div className="py-12 flex flex-col items-center space-y-3">
                          <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" />
                          <p className="text-sm text-on-surface-variant font-mono">Loading Registered Users...</p>
                        </div>
                      ) : users.length === 0 ? (
                        <div className="py-12 text-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl mb-2 text-white/20">group</span>
                          <p className="text-sm">No users registered on the platform.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto -mx-6 px-6">
                          <table className="w-full border-collapse text-left text-sm">
                            <thead>
                              <tr className="border-b border-white/10 text-on-surface-variant font-semibold">
                                <th className="py-3 px-2">S/N</th>
                                <th className="py-3 px-4">Profile details</th>
                                <th className="py-3 px-4">Domain</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Referrals Info</th>
                                <th className="py-3 px-4">Date Registered</th>
                                <th className="py-3 px-2 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {users.map((uItem, idx) => (
                                <tr 
                                  key={uItem._id} 
                                  onClick={() => setInspectedUser(uItem)}
                                  className="hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                  <td className="py-4 px-2 font-mono font-bold text-on-surface-variant">{idx + 1}</td>
                                  <td className="py-4 px-4 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-surface-container">
                                      <img src={uItem.avatar} alt={uItem.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-on-surface hover:text-primary transition-colors">{uItem.name}</div>
                                      <div className="text-xs text-on-surface-variant font-mono">{uItem.email}</div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 font-medium text-on-surface">{uItem.domain || '—'}</td>
                                  <td className="py-4 px-4">
                                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase border ${
                                      uItem.role === 'admin' 
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                        : uItem.role === 'developer'
                                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                      {uItem.role}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="text-xs text-on-surface-variant">Code: <span className="font-mono font-bold text-primary">{uItem.referralCode || 'N/A'}</span></div>
                                    <div className="text-[11px] text-on-surface-variant mt-0.5">Invited: <span className="font-bold text-on-surface">{uItem.referrals || 0} friends</span></div>
                                  </td>
                                  <td className="py-4 px-4 text-xs text-on-surface-variant font-mono">
                                    {new Date(uItem.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="py-4 px-2 text-center">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openRoleChangeEditor(uItem);
                                      }}
                                      className="text-xs bg-surface-container hover:bg-surface-container-high border border-white/10 px-3 py-1.5 rounded-lg text-primary hover:text-primary-fixed transition-all cursor-pointer font-semibold uppercase tracking-wider"
                                    >
                                      Change Role
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Tab 7: Profile overview */}
              {activeTab === 'profile' && (
                <div className="glass-panel rounded-xl p-8 border border-white/10">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-2">My Profile Card</h2>
                  <p className="text-sm text-on-surface-variant mb-8">Manage registration credentials and reference referral links</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Full Name</label>
                        <div className="bg-surface-container/30 border border-white/10 px-4 py-3 rounded-lg text-on-surface text-sm font-medium">{user.name}</div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Email Address</label>
                        <div className="bg-surface-container/30 border border-white/10 px-4 py-3 rounded-lg text-on-surface text-sm font-medium font-mono">{user.email}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Professional Role</label>
                        <div className="bg-surface-container/30 border border-white/10 px-4 py-3 rounded-lg text-on-surface text-sm font-medium capitalize">{user.role}</div>
                      </div>
                      {user.role !== 'student' && (
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Domain Area</label>
                          <div className="bg-surface-container/30 border border-white/10 px-4 py-3 rounded-lg text-on-surface text-sm font-medium">{user.domain}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Referral details container */}
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">My Referral Program</h3>
                    <p className="text-sm text-on-surface-variant mb-4">Invite your peers to register or request consultations to earn reward credits.</p>
                    
                    <ReferralShare referralCode={user.referralCode} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Edit Referral Status Modal Popup */}
      <AnimatePresence>
        {isEditStatusOpen && selectedReferral && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md rounded-xl p-6 border border-white/10 shadow-2xl relative"
            >
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold">Edit Referral Status</h3>
              <p className="text-xs text-on-surface-variant mb-6 font-mono border-b border-white/5 pb-2">Record ID: {selectedReferral._id}</p>

              <form onSubmit={handleStatusUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Referral Status</label>
                  <select 
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/10 rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="successful">Successful</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Reason / Audit comment</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide details about status change (e.g., Commission processed, or account registered successfully...)"
                    value={statusComment}
                    onChange={e => setStatusComment(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/10 rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsEditStatusOpen(false)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:text-on-surface text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">done</span>
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Role Modal Popup */}
      <AnimatePresence>
        {isEditRoleOpen && selectedUserForRole && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md rounded-xl p-6 border border-white/10 shadow-2xl relative"
            >
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold">Change User Role</h3>
              <p className="text-xs text-on-surface-variant mb-6 font-mono border-b border-white/5 pb-2">Target Account: {selectedUserForRole.email}</p>

              <form onSubmit={handleRoleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Platform Role</label>
                  <select 
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/10 rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {newRole !== 'student' && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Domain Focus Area</label>
                    <input 
                      type="text"
                      placeholder="e.g. Backend Engineering, Full Stack, UI/UX"
                      value={newDomain}
                      onChange={e => setNewDomain(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/10 rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsEditRoleOpen(false)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:text-on-surface text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">done</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info/Alert Modals */}
      <Modal 
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </>
  );
}
