
import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
    hasKnowledgeBase: boolean;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasKnowledgeBase, onReset }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-sky-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-200">Grid Tech Troubleshooter</h1>
      </div>
      {hasKnowledgeBase && (
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
        >
          <Icon name="reset" className="w-5 h-5" />
          <span>New Document</span>
        </button>
      )}
    </header>
  );
};
