
import React, { useState } from 'react';
import { Participant } from '../types';
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
        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">Ваш голос успешно зарегистрирован. <br/>Результаты обновляются прямо сейчас на главной трансляции.</p>
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
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm shadow-indigo-50">
          <Star className="w-3 h-3 fill-indigo-600" />
          Зрительское голосование
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{sessionTitle}</h1>
        <p className="text-slate-500 text-lg font-medium opacity-80">Выберите одного участника из сетки ниже</p>
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
                <img 
                  src={p.photoUrl} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Number Overlay */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-black text-sm border border-white/20">
                        {idx + 1}
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              </div>
              
              <div className="absolute bottom-0 inset-x-0 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-white leading-none mb-1">Участник</h3>
                    <p className="text-2xl font-black text-white tracking-tighter">#{idx + 1}</p>
                  </div>
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all border-2 ${selectedId === p.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-110' : 'bg-white/10 border-white/20 text-transparent'}`}>
                    <Check className="w-7 h-7 stroke-[4px]" />
                  </div>
                </div>
              </div>

              {selectedId === p.id && (
                <div className="absolute top-4 right-4 z-20 animate-bounce">
                   <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl border border-indigo-400">
                      Ваш выбор
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Persistent Vote Button */}
      <div className="fixed bottom-10 left-0 right-0 px-6 z-50 pointer-events-none">
        <div className="max-w-sm mx-auto pointer-events-auto">
            <button 
              disabled={!selectedId}
              onClick={() => selectedId && onVote(selectedId)}
              className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border-b-4 ${selectedId ? 'bg-indigo-600 text-white border-indigo-800 shadow-indigo-300 hover:bg-indigo-700 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-50'}`}
            >
              <VoteIcon className="w-7 h-7" />
              {selectedId ? 'ГОЛОСОВАТЬ' : 'ВЫБЕРИТЕ УЧАСТНИКА'}
            </button>
        </div>
      </div>
    </div>
  );
};
