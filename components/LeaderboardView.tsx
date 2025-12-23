
import React, { useMemo, useEffect, useState } from 'react';
import { Participant } from '../types.ts';
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
        // Fix: Initialization must use the named parameter and direct environment variable
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const leader = sorted[0];
        const prompt = `Голосование "${sessionTitle}". Проголосовало ${totalVotes}. Лидер: ${leader.name}. Напиши короткую реакцию (10 слов).`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        
        // Fix: Use response.text property directly
        setAiInsight(response.text || '');
      } catch (e) {
        console.error("AI insight failed", e);
      }
    };

    const timer = setTimeout(generateInsight, 3000);
    return () => clearTimeout(timer);
  }, [sorted[0]?.id, sorted[0]?.votes, totalVotes]);

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
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{sessionTitle}</h1>
            <p className="text-slate-400 font-medium text-lg">Результаты LIVE</p>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-center">
                <p className="text-5xl font-black text-indigo-600">{totalVotes}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Голосов</p>
            </div>
        </div>
      </div>

      {aiInsight && (
        <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg animate-in slide-in-from-right-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-200" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">AI Аналитика</span>
          </div>
          <p className="text-lg font-bold italic">"{aiInsight}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <Trophy className="text-yellow-500 w-6 h-6" />
              Лидеры
            </h2>
            <div className="space-y-6">
              {sorted.slice(0, 3).map((p, idx) => (
                <div key={p.id} className={`flex items-center gap-5 p-5 rounded-3xl border-2 ${idx === 0 ? 'bg-indigo-50 border-yellow-400' : 'bg-slate-50 border-slate-100'}`}>
                  <img src={p.photoUrl} alt={p.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black text-slate-900">{p.name}</h4>
                    <span className="text-xs font-bold text-indigo-600 uppercase">{p.votes} голосов</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border shadow-sm">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="votes" radius={[15, 15, 5, 5]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
