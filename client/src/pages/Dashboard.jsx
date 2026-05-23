import React, { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { 
    user, 
    checklist, 
    toggleChecklist, 
    addChecklistItem, 
    uploadedFiles, 
    uploadFile, 
    progressPercentage,
    modulesCompleted
  } = useAuth();
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Protect route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle Drag Over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      // Perform mock security check: file size limit (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setModalTitle('Upload Rejected');
        setModalMessage('File exceeds the secure size limit of 10MB.');
        setModalOpen(true);
        return;
      }
      
      uploadFile(file.name, `${sizeMB} MB`);
      setModalTitle('File Uploaded');
      setModalMessage(`Successfully uploaded "${file.name}" for architecture review.`);
      setModalOpen(true);
    }
  };

  // Handle File Input Select
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      if (file.size > 10 * 1024 * 1024) {
        setModalTitle('Upload Rejected');
        setModalMessage('File exceeds the secure size limit of 10MB.');
        setModalOpen(true);
        return;
      }

      uploadFile(file.name, `${sizeMB} MB`);
      setModalTitle('File Uploaded');
      setModalMessage(`Successfully uploaded "${file.name}" for architecture review.`);
      setModalOpen(true);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addChecklistItem(newTaskText);
    setNewTaskText('');
  };

  return (
    <>
      <main className="flex-grow pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-6">
          <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container mb-4 overflow-hidden border border-white/10 relative">
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
                src={user.avatar}
              />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">{user.name}</h2>
            <p className="font-label-sm text-label-sm text-primary mb-4 bg-primary/10 px-3 py-1 rounded">{user.domain}</p>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary rounded-full glow-effect transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant w-full text-right">{progressPercentage}% Complete</p>
          </div>

          <nav className="glass-panel rounded-xl p-4 flex flex-col space-y-2">
            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm border border-white/10 text-left w-full cursor-pointer">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span>Overview</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-sm text-label-sm text-left w-full">
              <span className="material-symbols-outlined text-[20px]">task</span>
              <span>Tasks</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-sm text-label-sm text-left w-full">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Meetings</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-sm text-label-sm text-left w-full">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              <span>Documents</span>
            </button>
          </nav>
        </aside>

        {/* Dashboard Canvas */}
        <div className="md:col-span-9 space-y-gutter">
          {/* Header area */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Project Tracker</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Authentication Microservice Refactor</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-panel text-on-surface font-label-sm text-label-sm border border-white/10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span>Production: Live</span>
              </div>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg text-on-surface border border-white/10 font-label-sm text-label-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
                <span>GitHub Repo</span>
              </a>
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
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Pending Tasks</p>
              <div className="flex items-end space-x-2">
                <span className="font-display-xl text-display-xl text-on-surface">14</span>
                <span className="font-body-md text-body-md text-tertiary mb-3 flex items-center">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_down</span>-2
                </span>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Overall Progress</p>
              <div className="relative w-full h-16 flex items-center justify-center">
                {/* SVG Radial Progress Arc */}
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
            {/* Left Column */}
            <div className="space-y-gutter">
              {/* Viva Prep Checklist */}
              <div className="glass-panel rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Viva Prep Checklist</h3>
                </div>
                <div className="space-y-4 mb-6">
                  {checklist.map(item => (
                    <label key={item.id || item._id} className="flex items-start space-x-3 group cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={item.checked}
                        onChange={() => toggleChecklist(item.id || item._id)}
                        className="mt-1 rounded border-outline bg-surface-dim text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer w-4 h-4"
                      />
                      <div>
                        <p className={`font-body-md text-body-md transition-colors ${item.checked ? 'text-on-surface-variant line-through group-hover:text-on-surface' : 'text-on-surface group-hover:text-primary'}`}>
                          {item.text}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2 border-t border-white/5 pt-4">
                  <input 
                    type="text" 
                    placeholder="Add new prep task..."
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    className="flex-grow bg-surface-container-low border-b border-white/10 px-3 py-1 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                  />
                  <button 
                    type="submit" 
                    className="text-primary hover:text-primary-fixed transition-colors flex items-center p-1 cursor-pointer active:scale-90"
                    aria-label="Add task"
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                </form>
              </div>

              {/* Secure Drag & Drop Document Upload */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`glass-panel rounded-xl p-6 border border-dashed hover:border-primary/50 transition-colors text-center cursor-pointer group flex flex-col items-center justify-center min-h-[160px] ${
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
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">upload_file</span>
                </div>
                <h4 className="font-body-md text-body-md text-on-surface mb-1">Upload Architecture Drafts</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Drag &amp; drop files (.pdf, .png, .zip) or click to browse</p>
                <p className="text-[10px] text-on-surface-variant/40 mt-1">Maximum secure file size: 10MB</p>
              </div>

              {/* Render Uploaded Files list if any */}
              {uploadedFiles.length > 0 && (
                <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-3">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Uploaded Documents ({uploadedFiles.length})</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={file.id || file._id || idx} className="flex justify-between items-center bg-surface-container-low border border-white/5 p-3 rounded text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                          <span className="text-on-surface truncate max-w-[200px]" title={file.name}>{file.name}</span>
                        </div>
                        <span className="text-xs text-on-surface-variant">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-gutter">
              {/* Mentor Notes */}
              <div className="glass-panel rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="material-symbols-outlined text-primary">speaker_notes</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Mentor Feedback Notes</h3>
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

              {/* Upcoming Meetings */}
              <div className="glass-panel rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Meetings</h3>
                  <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
                </div>
                <div className="bg-surface-container rounded-lg p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-surface-dim rounded-md p-2 text-center w-12 border border-white/5 flex-shrink-0">
                      <p className="font-label-sm text-label-sm text-primary uppercase">Oct</p>
                      <p className="font-body-lg text-body-lg text-on-surface">24</p>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md text-on-surface mb-1 font-semibold">Architecture Review</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">schedule</span>
                        2:00 PM - 3:00 PM
                      </p>
                    </div>
                  </div>
                  <a 
                    href="https://meet.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload/Alert Modals */}
      <Modal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </>
  );
}
