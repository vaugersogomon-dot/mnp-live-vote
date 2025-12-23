
import React, { useState, useEffect } from 'react';
import { AdminView } from './components/AdminView.tsx';
import { VoterView } from './components/VoterView.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { Navbar } from './components/Navbar.tsx';
import { AppView, Participant } from './types.ts';

const STORAGE_KEY = 'live_vote_state';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ADMIN);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votedForId, setVotedForId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Голосование 2024');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setParticipants(parsed.participants || []);
        setSessionTitle(parsed.sessionTitle || 'Голосование 2024');
      } catch (e) {
        console.error("Storage load error", e);
      }
    }
    
    const savedVote = localStorage.getItem('voted_for_id');
    if (savedVote) setVotedForId(savedVote);

    const syncView = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'vote') setView(AppView.VOTE);
      else if (hash === 'results') setView(AppView.LEADERBOARD);
      else setView(AppView.ADMIN);
    };

    syncView();
    window.addEventListener('hashchange', syncView);
    return () => window.removeEventListener('hashchange', syncView);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ participants, sessionTitle }));
  }, [participants, sessionTitle]);

  const handleAddParticipant = (name: string, photoUrl: string) => {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      photoUrl,
      votes: 0,
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const handleVote = (id: string) => {
    if (votedForId) return;
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
    setVotedForId(id);
    localStorage.setItem('voted_for_id', id);
    window.location.hash = 'results';
  };

  const resetVotes = () => {
    if (confirm("Вы уверены, что хотите удалить всех участников и обнулить голоса?")) {
      setParticipants([]);
      setVotedForId(null);
      localStorage.removeItem('voted_for_id');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentView={view} setView={setView} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === AppView.ADMIN && (
          <AdminView 
            participants={participants} 
            onAdd={handleAddParticipant} 
            onDelete={(id) => setParticipants(p => p.filter(x => x.id !== id))}
            onReset={resetVotes}
            sessionTitle={sessionTitle}
            setSessionTitle={setSessionTitle}
          />
        )}
        {view === AppView.VOTE && (
          <VoterView 
            participants={participants} 
            onVote={handleVote} 
            hasVoted={!!votedForId}
            sessionTitle={sessionTitle}
          />
        )}
        {view === AppView.LEADERBOARD && (
          <LeaderboardView participants={participants} sessionTitle={sessionTitle} />
        )}
      </main>
      <footer className="py-6 text-center text-slate-400 text-xs bg-white border-t">
        LiveVote Engine • Прямая трансляция результатов
      </footer>
    </div>
  );
};

export default App;
