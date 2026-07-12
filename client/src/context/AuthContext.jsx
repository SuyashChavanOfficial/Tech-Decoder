import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// In development, use '' (empty) so Vite proxy handles /api/* same-origin
// In production, use the configured backend URL
const BACKEND_URL = import.meta.env.MODE === 'development'
  ? ''
  : import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true
});

const defaultChecklist = [
  { id: 'mock-1', text: 'Review System Architecture Diagram', checked: true },
  { id: 'mock-2', text: 'Prepare answers for DB scaling strategies', checked: false },
  { id: 'mock-3', text: 'Dry run presentation with mentor', checked: false }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallbacks for anonymous user
  const [localChecklist, setLocalChecklist] = useState(defaultChecklist);
  const [localFiles, setLocalFiles] = useState([]);
  const [localReferrals, setLocalReferrals] = useState(4);

  // Sync token to API headers
  useEffect(() => {
    const reqInterceptor = API.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => API.interceptors.request.eject(reqInterceptor);
  }, [accessToken]);

  // Handle automatic refresh token rotation on token expiry
  useEffect(() => {
    const resInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });
            const newToken = res.data.token;
            setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);
          } catch (refreshErr) {
            setUser(null);
            setAccessToken(null);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => API.interceptors.response.eject(resInterceptor);
  }, []);

  // Try loading profile on mount using refresh token
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const token = res.data.token;
        setAccessToken(token);

        const profileRes = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(profileRes.data);
      } catch (err) {
        // Token lookup failed, user is logged out silently
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Background profile sync polling to check for role updates automatically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      // Visibility Guard: Skip polling if the browser tab is in the background
      if (document.hidden) return;

      try {
        const profileRes = await API.get('/auth/profile');
        // Deep compare user profiles to check for changes
        if (
          profileRes.data.role !== user.role ||
          profileRes.data.domain !== user.domain ||
          profileRes.data.name !== user.name ||
          profileRes.data.email !== user.email ||
          profileRes.data.avatar !== user.avatar
        ) {
          setUser(profileRes.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Token is expired/invalid, log out the user automatically
          setUser(null);
          setAccessToken(null);
        }
      }
    }, 600000); // Poll every 10 minutes to minimize server load

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setUser(res.data);
      setAccessToken(res.data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Authentication failed. Please check credentials.'
      };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const register = async (name, email, password) => {
    try {
      const referralCode = sessionStorage.getItem('referralCode') || '';
      const res = await API.post('/auth/register', { name, email, password, referralCode });
      setUser(res.data);
      setAccessToken(res.data.token);

      // Clean up sessionStorage after successful registration
      if (referralCode) {
        sessionStorage.removeItem('referralCode');
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const syncProgress = async (updatedFields) => {
    if (!user) return;
    try {
      const res = await API.put('/auth/progress', updatedFields);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to sync progress:', err.message);
    }
  };

  const toggleChecklist = (id) => {
    if (user) {
      const updatedChecklist = user.checklist.map(item =>
        item._id === id || item.id === id ? { ...item, checked: !item.checked } : item
      );
      setUser(prev => ({ ...prev, checklist: updatedChecklist }));
      syncProgress({ checklist: updatedChecklist });
    } else {
      setLocalChecklist(prev => prev.map(item =>
        item.id === id || item._id === id ? { ...item, checked: !item.checked } : item
      ));
    }
  };

  const addChecklistItem = (text) => {
    if (!text.trim()) return;
    const newItem = { text, checked: false };
    if (user) {
      const updatedChecklist = [...user.checklist, newItem];
      setUser(prev => ({ ...prev, checklist: updatedChecklist }));
      syncProgress({ checklist: updatedChecklist });
    } else {
      const mockItem = { id: `mock-${Date.now()}`, ...newItem };
      setLocalChecklist(prev => [...prev, mockItem]);
    }
  };

  const uploadFile = (fileName, fileSize) => {
    const newFile = { name: fileName, size: fileSize, date: new Date().toLocaleDateString() };
    if (user) {
      const updatedFiles = [...user.uploadedFiles, newFile];
      setUser(prev => ({ ...prev, uploadedFiles: updatedFiles }));
      syncProgress({ uploadedFiles: updatedFiles });
    } else {
      const mockFile = { id: `mock-${Date.now()}`, ...newFile };
      setLocalFiles(prev => [...prev, mockFile]);
    }
  };

  const bookConsultation = async (formData) => {
    try {
      await API.post('/consultations', formData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Booking failed.' };
    }
  };

  const submitInquiry = async (formData) => {
    try {
      await API.post('/inquiries', formData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Submission failed.' };
    }
  };

  const setReferrals = (val) => {
    if (user) {
      const newVal = typeof val === 'function' ? val(user.referrals) : val;
      setUser(prev => ({ ...prev, referrals: newVal }));
      syncProgress({ referrals: newVal });
    } else {
      setLocalReferrals(prev => typeof val === 'function' ? val(prev) : val);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const referralCode = sessionStorage.getItem('referralCode') || '';
      const res = await API.post('/auth/google-login', { token: googleToken, referralCode });
      setUser(res.data);
      setAccessToken(res.data.token);

      // Clean up sessionStorage after successful registration
      if (referralCode) {
        sessionStorage.removeItem('referralCode');
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Google authentication failed.'
      };
    }
  };

  const getAllReferrals = async () => {
    try {
      const res = await API.get('/auth/referrals/all');
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to fetch referrals.' };
    }
  };

  const updateReferralStatus = async (id, status, comment) => {
    try {
      const res = await API.put(`/auth/referrals/${id}/status`, { status, comment });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update status.' };
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to fetch users.' };
    }
  };

  const updateUserRole = async (id, role, domain) => {
    try {
      const res = await API.put(`/auth/users/${id}/role`, { role, domain });
      // If the updated user is the currently logged-in user, sync the state immediately
      if (user && user._id === id) {
        setUser(prev => ({
          ...prev,
          role,
          domain: role === 'student' ? '' : domain
        }));
      }
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update user role.' };
    }
  };

  const totalModules = 12;
  const completedChecklistCount = user
    ? (user.checklist ? user.checklist.filter(c => c.checked).length : 0)
    : localChecklist.filter(c => c.checked).length;
  const modulesCompletedCount = user ? user.modulesCompleted : 8;
  const progressPercentage = Math.min(100, Math.round(((modulesCompletedCount + completedChecklistCount) / totalModules) * 100));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        modulesCompleted: user ? user.modulesCompleted : 8,
        checklist: user ? user.checklist : localChecklist,
        uploadedFiles: user ? user.uploadedFiles : localFiles,
        referrals: user ? user.referrals : localReferrals,
        referralCode: user ? user.referralCode : null,
        progressPercentage,
        login,
        logout,
        register,
        toggleChecklist,
        addChecklistItem,
        uploadFile,
        bookConsultation,
        submitInquiry,
        setReferrals,
        loginWithGoogle,
        getAllReferrals,
        updateReferralStatus,
        getAllUsers,
        updateUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
