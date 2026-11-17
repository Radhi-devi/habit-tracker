import React, { useState } from 'react';
import { X, Cloud, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSavedFirebaseConfig } from '../utils/firebase';

export default function CloudSyncModal({ isOpen, onClose }) {
  const { isCloudEnabled, configureCloud } = useAuth();

  const saved = getSavedFirebaseConfig() || {};
  const [apiKey, setApiKey] = useState(saved.apiKey || '');
  const [projectId, setProjectId] = useState(saved.projectId || '');
  const [authDomain, setAuthDomain] = useState(saved.authDomain || '');
  const [appId, setAppId] = useState(saved.appId || '');
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      setMessage({ type: 'error', text: 'API Key and Project ID are required.' });
      return;
    }

    const config = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: `${projectId.trim()}.appspot.com`,
      appId: appId.trim() || '1:123456789:web:abcdef',
    };

    const success = configureCloud(config);
    if (success) {
      setMessage({
        type: 'success',
        text: 'Cloud Sync connected successfully! All your browsers will now synchronize in real time.',
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage({
        type: 'error',
        text: 'Could not connect with these credentials. Please check your Project ID and API Key.',
      });
    }
  };

  const handleDisconnect = () => {
    configureCloud(null);
    setApiKey('');
    setProjectId('');
    setAuthDomain('');
    setAppId('');
    setMessage({
      type: 'success',
      text: 'Cloud sync disconnected. Operating in local mode.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#110e1f] border border-purple-200 dark:border-purple-900/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-900/30 bg-purple-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                Cross-Browser Cloud Sync
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                Sync habits across Chrome, Safari, phone, and live site
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

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
          {message && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
              <ShieldCheck className="w-4 h-4" /> Why do different browsers show different data?
            </div>
            <p>
              By default, browsers isolate local data (Chrome cannot read Edge or your mobile phone's storage).
            </p>
            <p>
              Connecting a free <strong>Google Firebase</strong> backend links all your browsers together under your single login!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Firebase Project ID <span className="text-purple-500">*</span>
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="e.g. my-habit-tracker-1234"
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Firebase Web API Key <span className="text-purple-500">*</span>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g. AIzaSyD..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Auth Domain (Optional)
            </label>
            <input
              type="text"
              value={authDomain}
              onChange={(e) => setAuthDomain(e.target.value)}
              placeholder="e.g. my-project.firebaseapp.com"
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {isCloudEnabled && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-xs text-rose-600 hover:underline"
              >
                Disconnect Cloud
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs shadow-purple-600/30"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
