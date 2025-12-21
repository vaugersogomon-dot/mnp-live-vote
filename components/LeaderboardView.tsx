
import React, { useMemo, useEffect, useState } from 'react';
import { Participant } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Star, TrendingUp, Users } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface LeaderboardViewProps {
  participants: Participant[];
  sessionTitle: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ 
  participants,
  sessionTitle
}) => {
  const sorted = useMemo(() => [...participants].sort((a, b) => b.votes - a.votes), [participants]);
  const totalVotes = useMemo(() => participants.reduce((acc, p) => acc + p.votes, 0), [participants]);
  const [aiInsight, setAiInsight] = useState<string>('');

  useEffect(() => {
    if (participants.length === 0 || totalVotes === 0) return;

    const generateInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const leader = sorted[0];
        const prompt = `Голосование "${sessionTitle}". Проголосовало ${totalVotes}. Лидер: ${leader.name}. Напиши одну короткую реакцию в стиле спортивного комментатора на русском. 10-15 слов.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        setAiInsight(response.text || '');
      } catch (e) {
        console.error("AI insight failed", e);
      }
    };

    const timer = setTimeout(generateInsight, 3000);
    return () => clearTimeout(timer);
  }, [sorted[0]?.id, sorted[0]?.votes, totalVotes]); // Refresh when leader or votes change

  const chartData = useMemo(() => participants.map(p => ({
    name: p.name.length > 10 ? p.name.substring(0, 8) + '...' : p.name,
    votes: p.votes,
    fullName: p.name
  })).sort((a,b) => b.votes - a.votes), [participants]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-10 rounded-[2.5rem] border shadow-sm">
        <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Live трансляция</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{sessionTitle}</h1>
            <p className="text-slate-400 font-medium text-lg">Результаты в реальном времени</p>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-center">
                <p className="text-5xl font-black text-indigo-600 tabular-nums">{totalVotes}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Голосов</p>
            </div>
            <div className="h-16 w-[2px] bg-slate-100"></div>
            <div className="text-center">
                <p className="text-5xl font-black text-slate-900 tabular-nums">{participants.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Участников</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Podium and AI */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Trophy className="text-yellow-500 w-6 h-6" />
              Лидеры гонки
            </h2>
            <div className="space-y-6">
              {sorted.slice(0, 3).map((p, idx) => (
                <div key={p.id} className={`group relative flex items-center gap-5 p-5 rounded-3xl border-2 transition-all duration-500 ${idx === 0 ? 'bg-indigo-50/50 border-yellow-400 shadow-xl shadow-yellow-100/50 scale-105' : 'bg-slate-50/50 border-slate-100'}`}>
                  <div className="relative shrink-0">
                    <img src={p.photoUrl} alt={p.name} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-sm" />
                    <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-xl flex items-center justify-center text-white font-black shadow-lg transform -rotate-12 ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-400' : 'bg-orange-500'
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-black text-slate-900 truncate text-lg">{p.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{p.votes} голосов</span>
                        <span className="text-xs font-black text-slate-300">
                            {totalVotes > 0 ? ((p.votes / totalVotes) * 100).toFixed(0) : 0}%
                        </span>
                    </div>
                  </div>
                </div>
              ))}
              {participants.length === 0 && (
                <div className="py-20 text-center text-slate-300 font-bold italic">Ожидание первого голоса...</div>
              )}
            </div>
          </div>

          {aiInsight && (
            <div className="p-8 bg-black rounded-[2rem] text-white shadow-2xl animate-in slide-in-from-left duration-700 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-20 h-20 text-white fill-white" />
               </div>
               <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">AI Аналитика</span>
                  </div>
                  <p className="text-xl font-bold leading-relaxed italic">"{aiInsight}"</p>
               </div>
            </div>
          )}
        </div>

        {/* Dynamic Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <TrendingUp className="text-indigo-500 w-7 h-7" />
              Динамика рейтинга
            </h2>
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-600 uppercase">Online TV Mode</span>
            </div>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} 
                />
                <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 15 }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                    itemStyle={{ fontWeight: '900', color: '#6366f1' }}
                    labelStyle={{ fontWeight: '800', marginBottom: '4px', color: '#1e293b' }}
                />
                <Bar dataKey="votes" radius={[15, 15, 5, 5]} animationDuration={1000} animationEasing="ease-out">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8">
             {sorted.slice(0, 5).map((p, idx) => (
                 <div key={p.id} className="text-center group cursor-default">
                    <div className="relative inline-block mb-2">
                        <img src={p.photoUrl} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white shadow-sm rounded-lg flex items-center justify-center text-[10px] font-black text-slate-900">
                            {idx + 1}
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.name.split(' ')[0]}</p>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
