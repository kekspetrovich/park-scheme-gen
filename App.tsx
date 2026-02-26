
import React, { useState } from 'react';
import { Plus, RefreshCw, Trash2, Download, Settings } from 'lucide-react';
import { STAGES_DATA, TRACK_COLORS } from './constants';
import { Track, TrackColor, TrackStage, StageTemplate } from './types';
import TrackView from './components/TrackView';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const generateStages = (color: TrackColor, count: number): TrackStage[] => {
    // Находим шаблоны для конкретного цвета
    let validTemplates = STAGES_DATA.filter(s => s.color.includes(color));
    
    // Если для цвета нет этапов (например, для 'белого'), берем самые легкие (желтые) или все
    if (validTemplates.length === 0) {
      validTemplates = STAGES_DATA.filter(s => s.color.includes('yellow'));
    }
    if (validTemplates.length === 0) {
      validTemplates = [STAGES_DATA[0]]; // Совсем крайний случай
    }

    const stages: TrackStage[] = [];
    const shuffled = [...validTemplates].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < count; i++) {
      const template = shuffled[i % shuffled.length] || STAGES_DATA[0];
      stages.push({
        id: uuidv4(),
        template: template,
        distanceToNext: 12.0
      });
    }
    return stages;
  };

  const addTrack = () => {
    const defaultColor: TrackColor = 'green';
    const newTrack: Track = {
      id: uuidv4(),
      name: `Трасса ${tracks.length + 1}`,
      color: defaultColor,
      length: 8,
      avgHeight: 2.5,
      stages: generateStages(defaultColor, 8),
    };
    setTracks([...tracks, newTrack]);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...updates };
      // Если изменилось количество этапов напрямую из инпута
      if (updates.length !== undefined && updates.length !== t.length) {
        updated.stages = generateStages(updated.color, updated.length);
      } else if (updates.color && updates.color !== t.color) {
        // Если изменился только цвет, перегенерируем существующие этапы под новый цвет
        updated.stages = generateStages(updated.color, t.length);
      }
      return updated;
    }));
  };

  const removeTrack = (id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
  };

  const removeStage = (trackId: string, stageId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      const newStages = t.stages.filter(s => s.id !== stageId);
      return {
        ...t,
        stages: newStages,
        length: newStages.length
      };
    }));
  };

  const updateStageDistance = (trackId: string, stageId: string, distance: number) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      return {
        ...t,
        stages: t.stages.map(s => s.id === stageId ? { ...s, distanceToNext: distance } : s)
      };
    }));
  };

  const regenerateStage = (trackId: string, stageId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      let validTemplates = STAGES_DATA.filter(s => s.color.includes(t.color));
      if (validTemplates.length === 0) validTemplates = STAGES_DATA;
      
      return {
        ...t,
        stages: t.stages.map(s => {
          if (s.id !== stageId) return s;
          const randomTemplate = validTemplates[Math.floor(Math.random() * validTemplates.length)];
          return { ...s, template: randomTemplate };
        })
      };
    }));
  };

  const selectSpecificStage = (trackId: string, stageId: string, template: StageTemplate) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      return {
        ...t,
        stages: t.stages.map(s => s.id === stageId ? { ...s, template: template } : s)
      };
    }));
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-16'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className={`flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>
             <span className="text-blue-600">Park</span>Architect
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 rounded text-slate-500">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isSidebarOpen ? (
            <>
              <button onClick={addTrack} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors">
                <Plus size={18} /> Добавить трассу
              </button>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ваши Трассы</h3>
                {tracks.map((track) => (
                  <div key={track.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <input className="bg-transparent font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 w-32" value={track.name} onChange={(e) => updateTrack(track.id, { name: e.target.value })} />
                      <button onClick={() => removeTrack(track.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase">Сложность</label>
                        <select value={track.color} onChange={(e) => updateTrack(track.id, { color: e.target.value as TrackColor })} className="w-full text-xs p-1 rounded border border-slate-300 capitalize">
                          {TRACK_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase">Этапов</label>
                        <input type="number" min="1" max="25" value={track.length} onChange={(e) => updateTrack(track.id, { length: parseInt(e.target.value) || 1 })} className="w-full text-xs p-1 rounded border border-slate-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4"><button onClick={addTrack} className="p-2 bg-blue-600 text-white rounded-full"><Plus size={20}/></button></div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700">Рабочий холст</h2>
          <button onClick={() => setTracks([])} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"><RefreshCw size={16} /> Очистить всё</button>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-slate-100 space-y-12">
          {tracks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
               <div className="w-32 h-32 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center"><Plus size={48} className="opacity-50" /></div>
               <p className="text-lg">Добавьте трассу, чтобы начать работу</p>
            </div>
          ) : (
            tracks.map(track => (
              <TrackView 
                key={track.id} 
                track={track} 
                onRegenerateStage={(stageId) => regenerateStage(track.id, stageId)}
                onSelectStage={(stageId, template) => selectSpecificStage(track.id, stageId, template)}
                onUpdateDistance={(stageId, dist) => updateStageDistance(track.id, stageId, dist)}
                onRemoveStage={(stageId) => removeStage(track.id, stageId)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
