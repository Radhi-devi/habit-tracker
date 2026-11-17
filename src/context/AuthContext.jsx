import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initFirebaseService, 
  getSavedFirebaseConfig, 
  saveFirebaseConfig,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  fbUpdateProfile,
  onAuthStateChanged
} from '../utils/firebase';

const AuthContext = createContext(null);

const LOCAL_USERS_KEY = 'habit_tracker_local_users_v1';
const CURRENT_USER_KEY = 'habit_tracker_current_user_v1';

// Default Demo User
const DEFAULT_USER = {
  id: 'user_demo_1',
  name: 'Radhi Devi',
  email: 'radhi@habitflow.app',
  avatar: '💜',
  createdAt: new Date().toISOString(),
  isCloud: false,
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isCloudEnabled, setIsCloudEnabled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase if configured
  useEffect(() => {
    const service = initFirebaseService();
    setIsCloudEnabled(service.isReady);

    if (service.isReady && service.auth) {
      const unsubscribe = onAuthStateChanged(service.auth, (fbUser) => {
        if (fbUser) {
          const userObj = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email,
            avatar: '✨',
            isCloud: true,
          };
          setCurrentUser(userObj);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Save current user to localStorage
  const updateCurrentUserState = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  // Sign up
  const signup = async (name, email, password, avatar = '💜') => {
    const service = initFirebaseService();
    if (service.isReady && service.auth) {
      // Cloud Sign Up with Firebase
      const cred = await createUserWithEmailAndPassword(service.auth, email, password);
      await fbUpdateProfile(cred.user, { displayName: name });
      const userObj = {
        id: cred.user.uid,
        name,
        email,
        avatar: avatar || '✨',
        isCloud: true,
      };
      updateCurrentUserState(userObj);
      return userObj;
    }

    // Local account sign up
    let localUsers = [];
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      if (raw) localUsers = JSON.parse(raw);
    } catch {
      localUsers = [];
    }

    const existing = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser = {
      id: newId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // in real cloud, Firebase hashes. Locally kept for verification
      avatar: avatar || '💜',
      createdAt: new Date().toISOString(),
      isCloud: false,
    };

    localUsers.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    // Exclude password from active state
    const { password: _, ...safeUser } = newUser;
    updateCurrentUserState(safeUser);
    return safeUser;
  };

  // Login
  const login = async (email, password) => {
    const service = initFirebaseService();
    if (service.isReady && service.auth) {
      // Cloud Login with Firebase
      const cred = await signInWithEmailAndPassword(service.auth, email, password);
      const userObj = {
        id: cred.user.uid,
        name: cred.user.displayName || email.split('@')[0],
        email: cred.user.email,
        avatar: '✨',
        isCloud: true,
      };
      updateCurrentUserState(userObj);
      return userObj;
    }

    // Local login check
    let localUsers = [];
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      if (raw) localUsers = JSON.parse(raw);
    } catch {
      localUsers = [];
    }

    // Check demo user
    if (email.toLowerCase() === DEFAULT_USER.email.toLowerCase()) {
      updateCurrentUserState(DEFAULT_USER);
      return DEFAULT_USER;
    }

    const user = localUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...safeUser } = user;
    updateCurrentUserState(safeUser);
    return safeUser;
  };

  // Logout
  const logout = async () => {
    const service = initFirebaseService();
    if (service.isReady && service.auth) {
      await fbSignOut(service.auth);
    }
    updateCurrentUserState(null);
  };

  // Update Firebase Cloud Sync Configuration
  const configureCloud = (config) => {
    saveFirebaseConfig(config);
    const service = initFirebaseService();
    setIsCloudEnabled(service.isReady);
    return service.isReady;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isCloudEnabled,
        loading,
        login,
        signup,
        logout,
        configureCloud,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCloudModalOpen,
        setIsCloudModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
