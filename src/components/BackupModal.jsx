import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, FileJson, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { parseImportJson } from '../utils/storage.js';

export default function BackupModal({ isOpen, onClose, onExportJson, onExportCsv, onImport }) {
  const [tab, setTab] = useState('export');
  const [jsonText, setJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setJsonText(text);
        const data = parseImportJson(text);
        setStatusMessage({
          type: 'success',
          text: `Valid backup detected with ${data.activities.length} activities and ${Object.keys(data.logs).length} days of logs. Click "Confirm Import" to apply.`,
        });
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Invalid JSON format',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    try {
      const data = parseImportJson(jsonText);
      onImport(data);
      setStatusMessage({
        type: 'success',
        text: 'Backup restored successfully!',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to parse JSON backup',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#110e1f] border border-purple-200 dark:border-purple-900/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-900/30 bg-purple-500/5">
          <div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Data Backup & Sync
            </h3>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/80 font-medium">
              Export your habit logs or restore from a previous backup
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-purple-100 dark:border-purple-900/30 px-6 pt-2 bg-purple-50/30 dark:bg-purple-950/20">
          <button
            onClick={() => {
              setTab('export');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              tab === 'export'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 dark:border-purple-400'
                : 'border-transparent text-zinc-500 hover:text-purple-600'
            }`}
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button
            onClick={() => {
              setTab('import');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              tab === 'import'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 dark:border-purple-400'
                : 'border-transparent text-zinc-500 hover:text-purple-600'
            }`}
          >
            <Upload className="w-4 h-4" /> Import Data
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {tab === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Save a local copy of all your habits and daily check-ins. You can transfer this file to another device or restore it anytime.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onExportJson();
                    setStatusMessage({
                      type: 'success',
                      text: 'JSON backup file downloaded successfully!',
                    });
                  }}
                  className="flex flex-col items-start p-4 rounded-xl border border-purple-200/80 dark:border-purple-900/60 hover:border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 hover:bg-purple-100/40 transition-all text-left group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Export as JSON
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Complete data backup including custom colors, emojis, targets, and all logs.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onExportCsv();
                    setStatusMessage({
                      type: 'success',
                      text: 'CSV spreadsheet downloaded successfully!',
                    });
                  }}
                  className="flex flex-col items-start p-4 rounded-xl border border-purple-200/80 dark:border-purple-900/60 hover:border-emerald-500 bg-purple-50/30 dark:bg-purple-950/20 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-left group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Export as CSV
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Spreadsheet table format suitable for Microsoft Excel or Google Sheets.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Upload a valid JSON backup file or paste its raw contents below to restore your habits and history.
              </p>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-5 border-2 border-dashed border-purple-300 dark:border-purple-800 hover:border-purple-500 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Select Backup JSON File
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5">
                  Click to browse from your device
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Or Paste JSON String
                </label>
                <textarea
                  rows={4}
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    if (statusMessage) setStatusMessage(null);
                  }}
                  placeholder='{"activities": [...], "logs": {...}}'
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {jsonText && (
                <button
                  type="button"
                  onClick={handleApplyImport}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Confirm & Import Backup
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-purple-50/40 dark:bg-purple-950/20 border-t border-purple-100 dark:border-purple-900/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
