
import React from 'react';
import { Track, StageTemplate } from '../types';
import { TRACK_COLORS } from '../constants';
import StageCard from './StageCard';

interface TrackViewProps {
  track: Track;
  onRegenerateStage: (stageId: string) => void;
  onSelectStage: (stageId: string, template: StageTemplate) => void;
  onUpdateDistance: (stageId: string, distance: number) => void;
  onRemoveStage: (stageId: string) => void;
}

const TrackView: React.FC<TrackViewProps> = ({ track, onRegenerateStage, onSelectStage, onUpdateDistance, onRemoveStage }) => {
  const colorConfig = TRACK_COLORS.find(c => c.value === track.color) || TRACK_COLORS[2];
  const totalLength = track.stages.reduce((acc, s) => acc + s.distanceToNext, 0);

  return (
    <div className="min-w-max p-10 bg-white rounded-3xl shadow-md border border-slate-200 relative">
      <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className={`w-4 h-10 rounded-full ${colorConfig.bg}`}></div>
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {track.name} <span className="text-slate-400 font-light ml-2">({colorConfig.label})</span>
          </h3>
        </div>
        <div className="flex gap-8 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 mb-1">Общая длина</span>
            <span className="text-slate-800">~{Math.round(totalLength)} м</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 mb-1">Количество этапов</span>
            <span className="text-slate-800">{track.stages.length} шт.</span>
          </div>
        </div>
      </div>

      <div className="relative flex items-end h-[400px] pt-20 px-4">
        {/* Дерево 1 (Старт) */}
        <Tree index={1} color={track.color} />

        {/* Этапы и Деревья */}
        <div className="flex items-end">
          {track.stages.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              {/* Канат + Карточка этапа */}
              <div className="flex flex-col items-center">
                <div className="flex items-center relative" style={{ width: `${Math.max(140, stage.distanceToNext * 10)}px` }}>
                  {/* Линия каната */}
                  <div className={`absolute top-1/2 left-0 w-full h-1 ${colorConfig.bg} opacity-30`}></div>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-900/10"></div>
                  
                  {/* Управление этапом */}
                  <div className="relative z-10 w-full flex justify-center py-10">
                    <StageCard 
                      stage={stage} 
                      trackColor={track.color}
                      onRegenerate={() => onRegenerateStage(stage.id)}
                      onSelect={(template) => onSelectStage(stage.id, template)}
                      onUpdateDistance={(dist) => onUpdateDistance(stage.id, dist)}
                      onRemove={() => onRemoveStage(stage.id)}
                    />
                  </div>
                </div>
              </div>

              {/* Последующие деревья */}
              <Tree index={idx + 2} color={track.color} />
            </React.Fragment>
          ))}
          
          {/* Финиш */}
          <div className="ml-8 self-center">
            <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
              <span className="font-bold text-[10px] uppercase">Финиш</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tree: React.FC<{ index: number; color: string }> = ({ index, color }) => {
  const colorConfig = TRACK_COLORS.find(c => c.value === color) || TRACK_COLORS[2];
  return (
    <div className="relative flex flex-col items-center flex-shrink-0">
      {/* Номер дерева над кроной */}
      <div className="absolute -top-20 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-black shadow-xl ring-4 ring-white z-10">
        {index}
      </div>
      
      {/* Условная крона (для эстетики) */}
      <div className="absolute -top-16 w-16 h-16 bg-emerald-100 rounded-full opacity-50 blur-sm"></div>
      
      {/* Тонкий ствол дерева */}
      <div className="w-8 h-72 bg-gradient-to-b from-slate-300 to-slate-400 border-x border-slate-400 rounded-t-full relative flex flex-col items-center">
        {/* Текстура коры */}
        <div className="w-full h-[1px] bg-slate-500/20 my-6"></div>
        <div className="w-full h-[1px] bg-slate-500/20 my-10"></div>
        <div className="w-full h-[1px] bg-slate-500/20 my-14"></div>
        <div className="w-full h-[1px] bg-slate-500/20 my-18"></div>
        
        {/* Платформа (крепление) */}
        <div className={`absolute top-1/2 -left-4 -right-4 h-5 bg-slate-700 rounded-md shadow-lg flex items-center px-1 border-y border-slate-600`}>
          <div className={`w-full h-1 ${colorConfig.bg} opacity-70 rounded-full`}></div>
        </div>
      </div>
      <div className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Дерево {index}</div>
    </div>
  );
};

export default TrackView;
