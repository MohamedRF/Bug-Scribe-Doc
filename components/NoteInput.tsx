import React, { useState, KeyboardEvent } from 'react';
import { PlusCircle, CornerDownLeft } from 'lucide-react';

interface NoteInputProps {
  onAddNote: (text: string) => void;
}

export const NoteInput: React.FC<NoteInputProps> = ({ onAddNote }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddNote(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 mb-6">
      <label htmlFor="note-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        New Observation
      </label>
      <div className="relative">
        <textarea
          id="note-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the bug or observation here... (Press Enter to add)"
          className="w-full h-24 p-3 pr-12 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all text-sm sm:text-base text-slate-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-600"
        />
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
           <span className="hidden sm:inline text-xs text-gray-400">Press Enter ↵</span>
           <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};