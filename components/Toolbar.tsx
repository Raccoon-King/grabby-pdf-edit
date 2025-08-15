
import React from 'react';
import { Plus, Download, X, Loader2, RectangleHorizontal } from 'lucide-react';

interface ToolbarProps {
  onAddText: () => void;
  onAddRedaction: () => void;
  onDownload: () => void;
  onClose: () => void;
  isDownloading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddText, onAddRedaction, onDownload, onClose, isDownloading }) => {
  const buttonClass = "flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-md shadow-sm hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <header className="flex items-center justify-between p-2 bg-white shadow-md z-10">
      <h1 className="text-xl font-bold text-slate-800">React PDF Editor</h1>
      <div className="flex items-center gap-2">
        <button onClick={onAddText} className={buttonClass}>
          <Plus size={18} />
          <span>Add Text</span>
        </button>
        <button onClick={onAddRedaction} className={buttonClass}>
          <RectangleHorizontal size={18} />
          <span>Add Redaction</span>
        </button>
        <button onClick={onDownload} className={buttonClass} disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          <span>{isDownloading ? 'Redacting & Saving...' : 'Download PDF'}</span>
        </button>
        <button onClick={onClose} className="p-2 bg-slate-50 text-slate-700 rounded-md shadow-sm hover:bg-red-100 hover:text-red-600 active:bg-red-200 transition-colors">
          <X size={20} />
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
