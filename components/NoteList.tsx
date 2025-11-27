import React from 'react';
import { Trash2, X, ClipboardList } from 'lucide-react';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  onRemoveNote: (id: string) => void;
  onClearAll: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, onRemoveNote, onClearAll }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-slate-600 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
        <ClipboardList className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">No notes added yet.</p>
        <p className="text-xs">Start typing above to build your report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Collected Points ({notes.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center"
        >
          <Trash2 className="w-3 h-3 mr-1" /> Clear All
        </button>
      </div>
      
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className="group flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold mt-0.5">
               {index + 1}
            </span>
            <p className="flex-grow text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">
              {note.content}
            </p>
            <button
              onClick={() => onRemoveNote(note.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
              title="Remove note"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};