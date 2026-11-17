import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVATAR_OPTIONS = ['💜', '🧘', '🏃', '💻', '🎯', '🚀', '🌟', '🦉', '✨', '🔥'];

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup, isCloudEnabled, setIsCloudModalOpen } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('💜');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(name, email, password, avatar);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setError('');
    try {
      await login('radhi@habitflow.app', 'demo1234');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to login with demo user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#110e1f] border border-purple-200 dark:border-purple-900/50 rounded-2xl shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent border-b border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  {mode === 'signin' 
                    ? 'Log in to sync your habits and streaks' 
                    : 'Track your personal habits across devices'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 mt-4 rounded-xl bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/40 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white dark:bg-zinc-900 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-purple-600'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white dark:bg-zinc-900 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-purple-600'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* If Sign up: Name & Avatar */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhi Devi"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Choose Avatar
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                        avatar === av
                          ? 'bg-purple-600/20 ring-2 ring-purple-600 scale-110'
                          : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to HabitFlow</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create My Account</span>
              </>
            )}
          </button>

          {/* Quick Demo Login */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#110e1f] px-2 text-zinc-400">
                Or quick test
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 px-3 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ Instant Demo Account</span>
          </button>

          {/* Cross browser sync notice */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsCloudModalOpen(true);
              }}
              className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isCloudEnabled ? 'Cloud Sync is Active' : 'Setup Free Cross-Browser Cloud Sync'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
