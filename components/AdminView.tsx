
import React, { useState, useRef } from 'react';
import { Participant } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Trash2, Link as LinkIcon, RefreshCcw, QrCode, Image as ImageIcon, Loader2, Download, Copy, CheckCircle2, Globe, Info } from 'lucide-react';

interface AdminViewProps {
  participants: Participant[];
  onAdd: (name: string, photoUrl: string) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  sessionTitle: string;
  setSessionTitle: (title: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  participants, 
  onAdd, 
  onDelete, 
  onReset,
  sessionTitle,
  setSessionTitle
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Detection for GitHub Pages: window.location.origin + window.location.pathname
  // This handles sub-folders like /repo-name/ correctly.
  const getDefaultBaseUrl = () => {
    const url = window.location.origin + window.location.pathname;
    return url.endsWith('/') ? url : url + '/';
  };

  const [customBaseUrl, setCustomBaseUrl] = useState(getDefaultBaseUrl());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<SVGSVGElement>(null);

  const voteUrl = `${customBaseUrl}#vote`;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setProcessedCount(0);
    const fileArray = Array.from(files);
    let currentTotal = participants.length;
    for (let i = 0; i < fileArray.length; i++) {
      const compressed = await compressImage(fileArray[i]);
      onAdd(`Участник #${currentTotal + i + 1}`, compressed);
      setProcessedCount(i + 1);
    }
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "livevote-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(voteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Админ-панель</h1>
          <input 
            type="text" 
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            className="text-lg font-medium text-indigo-600 bg-transparent border-b border-dashed border-indigo-200 focus:border-indigo-500 outline-none pb-1 w-full"
            placeholder="Название события"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium border border-slate-200">
            <RefreshCcw className="w-4 h-4" />
            Сбросить всё
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-bold text-emerald-700">Online</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative group cursor-pointer p-10 rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center min-h-[300px] ${isProcessing ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-400'}`}
          >
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-medium font-black">Сжатие: {processedCount} фото...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Загрузить пачкой</h3>
                <p className="text-slate-500 text-lg mb-8">Система сама пронумерует участников</p>
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">
                  Выбрать файлы
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {participants.map((p, idx) => (
              <div key={p.id} className="relative group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <img src={p.photoUrl} alt={p.name} className="aspect-square w-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded-lg text-white text-[10px] font-black">#{idx + 1}</div>
                <button onClick={() => onDelete(p.id)} className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center text-center gap-6 shadow-2xl">
            <h3 className="text-xl font-black flex items-center gap-2">
              <QrCode className="w-6 h-6 text-indigo-400" />
              Вход для зрителей
            </h3>
            <div className="bg-white p-4 rounded-3xl">
              <QRCodeSVG ref={qrRef} value={voteUrl} size={180} level="H" />
            </div>
            <div className="w-full space-y-3">
              <button onClick={downloadQR} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                <Download className="w-4 h-4" /> Скачать QR-код
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Публичный URL</p>
                   <button onClick={copyToClipboard} className="text-indigo-400 hover:text-white transition-colors">
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   </button>
                </div>
                <input 
                  type="text" 
                  value={customBaseUrl} 
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-slate-300 outline-none border-b border-white/10 focus:border-indigo-500 pb-1"
                />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Info className="w-5 h-5" />
             </div>
             <div className="space-y-1">
                <p className="text-sm font-bold text-indigo-900">Совет по GitHub Pages</p>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  После публикации репозитория, убедитесь, что URL выше совпадает с адресом вашего сайта. 
                  Если вы открыли админку по ссылке GitHub, всё настроится автоматически.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
