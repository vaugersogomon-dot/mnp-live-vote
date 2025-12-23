
import React from 'react';
import { AppView } from '../types.ts';
import { Settings, Users, BarChart3, Vote } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => { window.location.hash = ''; setView(AppView.ADMIN); }}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Vote className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">LiveVote</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => { window.location.hash = ''; setView(AppView.ADMIN); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${currentView === AppView.ADMIN ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Админ</span>
          </button>
          <button 
            onClick={() => { window.location.hash = 'vote'; setView(AppView.VOTE); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${currentView === AppView.VOTE ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users className="w-4 h-4" />
            <span className="font-medium text-sm">Голосование</span>
          </button>
          <button 
            onClick={() => { window.location.hash = 'results'; setView(AppView.LEADERBOARD); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${currentView === AppView.LEADERBOARD ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">Результаты</span>
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
             <button onClick={() => { window.location.hash = 'vote'; setView(AppView.VOTE); }} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg">
                <Vote className="w-5 h-5" />
             </button>
        </div>
      </div>
    </nav>
  );
};
