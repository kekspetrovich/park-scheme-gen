
import React, { useState } from 'react';
import { TrackStage, TrackColor, StageTemplate } from '../types';
import { STAGES_DATA } from '../constants';
import { RefreshCw, Search, X, Check, ArrowLeftRight, Trash2 } from 'lucide-react';

interface StageCardProps {
  stage: TrackStage;
  trackColor: TrackColor;
  onRegenerate: () => void;
  onSelect: (template: StageTemplate) => void;
  onUpdateDistance: (distance: number) => void;
  onRemove: () => void;
}

const StageCard: React.FC<StageCardProps> = ({ stage, trackColor, onRegenerate, onSelect, onUpdateDistance, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isEditingDistance, setIsEditingDistance] = useState(false);

  // Защита от неопределенного шаблона
  if (!stage || !stage.template) {
    return (
       <div className="w-32 h-32 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl flex items-center justify-center">
         <span className="text-[10px] text-red-500 font-bold uppercase">Ошибка</span>
       </div>
    );
  }

  const filteredStages = STAGES_DATA.filter(s => showAll || s.color.includes(trackColor));

  return (
    <div className="relative flex flex-col items-center group">
      {/* Дистанция */}
      <div className="absolute -top-10 z-20">
        {isEditingDistance ? (
          <div className="flex items-center bg-white border border-blue-400 rounded-full px-2 py-0.5 shadow-lg animate-in fade-in zoom-in duration-100">
            <input 
              autoFocus
              type="number" 
              className="w-12 text-center text-xs font-bold outline-none"
              value={stage.distanceToNext}
              onChange={(e) => onUpdateDistance(parseFloat(e.target.value) || 0)}
              onBlur={() => setIsEditingDistance(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingDistance(false)}
            />
            <span className="text-[10px] font-bold text-slate-400 ml-0.5">м</span>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditingDistance(true)}
            className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm hover:border-blue-400 transition-colors group/dist"
          >
            <ArrowLeftRight size={10} className="text-slate-400 group-hover/dist:text-blue-500" />
            <span className="text-[11px] font-black text-slate-700">{stage.distanceToNext}м</span>
          </button>
        )}
      </div>

      {/* Основная карточка */}
      <div className="relative w-32 h-32 bg-white border-2 border-slate-200 flex flex-col items-center justify-center p-3 rounded-2xl transition-all shadow-sm group-hover:shadow-xl group-hover:border-blue-400 group-hover:-translate-y-1">
        
        {/* Эмодзи */}
        <div className="text-4xl mb-2 drop-shadow-sm group-hover:scale-110 transition-transform">
          {stage.template.emoji || '❓'}
        </div>
        
        <div className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tighter leading-none px-1 h-6 flex items-center overflow-hidden">
          {stage.template.name}
        </div>

        {/* Оверлей управления */}
        <div className="absolute inset-0 bg-blue-600/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
          <div className="flex gap-2">
            <button 
              onClick={onRegenerate}
              className="p-2 bg-white text-blue-600 rounded-full hover:bg-slate-100 shadow-lg"
              title="Случайный этап"
            >
              <RefreshCw size={14} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-white text-slate-800 rounded-full hover:bg-slate-100 shadow-lg"
              title="Выбрать из списка"
            >
              <Search size={14} />
            </button>
          </div>
          <button 
            onClick={onRemove}
            className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-[10px] font-bold shadow-md transition-colors"
          >
            <Trash2 size={12} /> Удалить
          </button>
        </div>
      </div>

      {/* Модальное окно выбора */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div>
                  <h4 className="font-black text-3xl text-slate-900 tracking-tight">Библиотека этапов</h4>
                  <p className="text-slate-500 font-medium">Текущий этап: {stage.template.name}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-800"><X size={32}/></button>
            </header>

            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0">
              <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Доступно: {filteredStages.length}</span>
              <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-slate-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                 <input 
                  type="checkbox" 
                  checked={showAll} 
                  onChange={() => setShowAll(!showAll)}
                  className="w-4 h-4 rounded-md border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                 Показать всё (без учета сложности)
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-slate-50/30">
              {filteredStages.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    onSelect(t);
                    setIsModalOpen(false);
                  }}
                  className={`relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all group/item
                    ${stage.template.name === t.name 
                      ? 'border-blue-600 bg-white shadow-xl ring-4 ring-blue-50' 
                      : 'border-white bg-white hover:border-blue-200 hover:shadow-lg shadow-sm'}
                  `}
                >
                  <span className="text-5xl mb-4 group-hover/item:scale-125 transition-transform duration-300">{t.emoji || '❓'}</span>
                  <span className="text-sm font-black text-slate-800 text-center leading-tight mb-2 uppercase tracking-tighter">{t.name}</span>
                  
                  <div className="flex gap-1 flex-wrap justify-center">
                    {t.color.map(c => (
                      <div key={c} className={`w-2 h-2 rounded-full bg-${c === 'white' ? 'slate-200' : c}-500`} title={c}></div>
                    ))}
                  </div>

                  {stage.template.name === t.name && (
                    <div className="absolute top-4 right-4 text-blue-600 bg-blue-50 p-1 rounded-full"><Check size={20} strokeWidth={3}/></div>
                  )}
                </button>
              ))}
            </div>

            <footer className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
               <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-lg"
               >
                 Закрыть
               </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageCard;
