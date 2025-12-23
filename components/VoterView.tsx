
import React, { useState } from 'react';
import { Participant } from '../types.ts';
import { Check, Vote as VoteIcon, Star, UserCheck } from 'lucide-react';

interface VoterViewProps {
  participants: Participant[];
  onVote: (id: string) => void;
  hasVoted: boolean;
  sessionTitle: string;
}

export const VoterView: React.FC<VoterViewProps> = ({ 
  participants, 
  onVote, 
  hasVoted,
  sessionTitle 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (hasVoted) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200 rotate-3">
          <UserCheck className="w-12 h-12 stroke-[3px]" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-none">Спасибо!</h2>
        <button 
          onClick={() => window.location.hash = 'results'}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all active:scale-95"
        >
          ПОСМОТРЕТЬ РЕЙТИНГ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-40 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12 mt-6 space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{sessionTitle}</h1>
        <p className="text-slate-500 text-lg font-medium opacity-80">Выберите одного участника</p>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-32 text-slate-300 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
            <VoteIcon className="w-24 h-24 mx-auto mb-6 opacity-5" />
            <p className="text-2xl font-black">Список участников скоро появится...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {participants.map((p, idx) => (
            <div 
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`relative cursor-pointer group rounded-[2.5rem] overflow-hidden bg-white border-4 transition-all duration-300 shadow-lg ${selectedId === p.id ? 'border-indigo-600 ring-8 ring-indigo-50 scale-[1.03] -translate-y-1' : 'border-white hover:border-slate-100 hover:scale-[1.01]'}`}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 z-20">
                    <div className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-black text-sm border border-white/20">
                        {idx + 1}
                    </div>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between gap-3 text-white">
                  <p className="text-xl font-black">#{idx + 1}</p>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedId === p.id ? 'bg-indigo-600 text-white' : 'bg-white/10 text-transparent'}`}>
                    <Check className="w-6 h-6 stroke-[4px]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-10 left-0 right-0 px-6 z-50">
        <div className="max-w-sm mx-auto">
            <button 
              disabled={!selectedId}
              onClick={() => selectedId && onVote(selectedId)}
              className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl transition-all ${selectedId ? 'bg-indigo-600 text-white border-b-4 border-indigo-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              ГОЛОСОВАТЬ
            </button>
        </div>
      </div>
    </div>
  );
};
