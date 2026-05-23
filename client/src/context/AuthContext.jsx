import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  withCredentials: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
            const res = await axios.post('http://127.0.0.1:5000/api/auth/refresh', {}, { withCredentials: true });
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
        const res = await axios.post('http://127.0.0.1:5000/api/auth/refresh', {}, { withCredentials: true });
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
      const res = await API.post('/auth/register', { name, email, password });
      setUser(res.data);
      setAccessToken(res.data.token);
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
    const updatedChecklist = user.checklist.map(item => 
      item._id === id || item.id === id ? { ...item, checked: !item.checked } : item
    );
    setUser(prev => ({ ...prev, checklist: updatedChecklist }));
    syncProgress({ checklist: updatedChecklist });
  };

  const addChecklistItem = (text) => {
    if (!text.trim()) return;
    const newItem = { text, checked: false };
    const updatedChecklist = [...user.checklist, newItem];
    setUser(prev => ({ ...prev, checklist: updatedChecklist }));
    syncProgress({ checklist: updatedChecklist });
  };

  const uploadFile = (fileName, fileSize) => {
    const newFile = { name: fileName, size: fileSize, date: new Date().toLocaleDateString() };
    const updatedFiles = [...user.uploadedFiles, newFile];
    setUser(prev => ({ ...prev, uploadedFiles: updatedFiles }));
    syncProgress({ uploadedFiles: updatedFiles });
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
    const newVal = typeof val === 'function' ? val(user.referrals) : val;
    setUser(prev => ({ ...prev, referrals: newVal }));
    syncProgress({ referrals: newVal });
  };

  const totalModules = 12;
  const completedChecklistCount = user?.checklist ? user.checklist.filter(c => c.checked).length : 0;
  const progressPercentage = user 
    ? Math.min(100, Math.round(((user.modulesCompleted + completedChecklistCount - 1) / totalModules) * 100))
    : 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        modulesCompleted: user?.modulesCompleted || 8,
        checklist: user?.checklist || [],
        uploadedFiles: user?.uploadedFiles || [],
        referrals: user?.referrals || 4,
        referralCode: user?.referralCode || 'ARCH-7X9P-V2',
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
