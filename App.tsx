import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NoteInput } from './components/NoteInput';
import { NoteList } from './components/NoteList';
import { ReportViewer } from './components/ReportViewer';
import { Note, Theme } from './types';
import { generateBugReport } from './services/gemini';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [notes, setNotes] = useState<Note[]>([]);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Load theme from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addNote = (text: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: text,
      timestamp: Date.now(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const clearAllNotes = () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      setNotes([]);
      setGeneratedReport('');
    }
  };

  const handleGenerateReport = async () => {
    if (notes.length === 0) return;
    
    setIsGenerating(true);
    const noteContents = notes.map(n => n.content);
    
    try {
      const report = await generateBugReport(noteContents);
      setGeneratedReport(report);
    } catch (error) {
      console.error("Failed to generate report", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Left Column: Input and List */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-none">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Manual Testing Logs
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Enter your observations one by one. The AI will compile them into a coherent document.
              </p>
              <NoteInput onAddNote={addNote} />
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 pb-4">
              <NoteList 
                notes={notes} 
                onRemoveNote={removeNote} 
                onClearAll={clearAllNotes}
              />
            </div>
          </div>

          {/* Right Column: Generated Output */}
          <div className="h-full overflow-hidden">
             <ReportViewer 
                report={generatedReport}
                isGenerating={isGenerating}
                onGenerate={handleGenerateReport}
                hasNotes={notes.length > 0}
             />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;