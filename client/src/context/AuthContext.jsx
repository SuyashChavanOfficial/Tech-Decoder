import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means logged out
  const [modulesCompleted, setModulesCompleted] = useState(8);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Review System Architecture Diagram', checked: true },
    { id: 2, text: 'Prepare answers for DB scaling strategies', checked: false },
    { id: 3, text: 'Dry run presentation with mentor', checked: false },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [referrals, setReferrals] = useState(4);
  const [referralCode] = useState('ARCH-7X9P-V2');
  const [consultations, setConsultations] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Calculate percentage: 8 completed out of 12 modules
  // Let's make it interactive: each checkmark in the checklist counts as one module component or custom modifier
  const totalModules = 12;
  const completedChecklistCount = checklist.filter(c => c.checked).length;
  // Progress = Math.min(100, Math.round((modulesCompleted / totalModules) * 100))
  // We can derive progress: (8 + completedChecklistCount) / 12
  const progressPercentage = Math.min(100, Math.round(((modulesCompleted + completedChecklistCount - 1) / totalModules) * 100));

  const login = (email, password) => {
    // Validate inputs
    if (!email || !password) return false;
    
    // Simulate API verification
    setUser({
      name: 'Alex Chen',
      email: email,
      domain: 'Backend Engineering',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvrYQbpk584ALwTACqL9kqJYe_-m7dsiX07EqLjKmTcxjm-E7HeYIyGbB1FQewyGJZSJ92YI7o_UigaHiBQGLPKMQJQdGzMxaFUyCuVtEuEyOzttt1fIlq1lw_ARwa4O0Ut-toKk_rjE70q0fUjpjqWYLQXalPA9qLIUY4eZ5N_Kg83XSAAJ4qPfPxdZIDNHOAJBPKSIdXA0K21281IzkxPZOVyp9kVS09aO-r0KR9qIwaINcuoNe7Hwn15Mvtrmk_X9SEXopajac'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name, email, password) => {
    if (!name || !email || !password) return false;
    setUser({
      name,
      email,
      domain: 'Backend Engineering',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvrYQbpk584ALwTACqL9kqJYe_-m7dsiX07EqLjKmTcxjm-E7HeYIyGbB1FQewyGJZSJ92YI7o_UigaHiBQGLPKMQJQdGzMxaFUyCuVtEuEyOzttt1fIlq1lw_ARwa4O0Ut-toKk_rjE70q0fUjpjqWYLQXalPA9qLIUY4eZ5N_Kg83XSAAJ4qPfPxdZIDNHOAJBPKSIdXA0K21281IzkxPZOVyp9kVS09aO-r0KR9qIwaINcuoNe7Hwn15Mvtrmk_X9SEXopajac'
    });
    return true;
  };

  const toggleChecklist = (id) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addChecklistItem = (text) => {
    if (!text.trim()) return;
    setChecklist(prev => [
      ...prev,
      { id: Date.now(), text, checked: false }
    ]);
  };

  const uploadFile = (fileName, fileSize) => {
    setUploadedFiles(prev => [
      ...prev,
      { id: Date.now(), name: fileName, size: fileSize, date: new Date().toLocaleDateString() }
    ]);
  };

  const bookConsultation = (formData) => {
    setConsultations(prev => [...prev, { ...formData, id: Date.now() }]);
  };

  const submitInquiry = (formData) => {
    setInquiries(prev => [...prev, { ...formData, id: Date.now() }]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        modulesCompleted,
        checklist,
        uploadedFiles,
        referrals,
        referralCode,
        progressPercentage,
        login,
        logout,
        register,
        toggleChecklist,
        addChecklistItem,
        uploadFile,
        bookConsultation,
        submitInquiry,
        setReferrals
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
