import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, FileJson, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { parseImportJson } from '../utils/storage';

export default function BackupModal({ isOpen, onClose, onExportJson, onExportCsv, onImport }) {
  const [tab, setTab] = useState('export'); // 'export' | 'import'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Data Backup & Sync
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Export your habit logs or restore from a previous backup
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 pt-2 bg-zinc-50/50 dark:bg-zinc-800/30">
          <button
            onClick={() => {
              setTab('export');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'export'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button
            onClick={() => {
              setTab('import');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'import'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
                  className="flex flex-col items-start p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 hover:border-blue-500 dark:hover:border-blue-500/80 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
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
                  className="flex flex-col items-start p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 hover:border-emerald-500 dark:hover:border-emerald-500/80 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-left group"
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Upload a valid JSON backup file or paste its raw contents below to restore your habits and history.
              </p>

              {/* Upload file box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-5 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500/80 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Select Backup JSON File
                </span>
                <span className="text-xs text-zinc-500 mt-0.5">
                  Click to browse from your computer
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
              </div>

              {/* Or paste JSON */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
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
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {jsonText && (
                <button
                  type="button"
                  onClick={handleApplyImport}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Confirm & Import Backup
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
