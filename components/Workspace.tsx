import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, AlertTriangle, Plus, X, Maximize2, Monitor } from 'lucide-react';
import { Tool } from '../types';
import { Button } from './Button';

interface WorkspaceProps {
  activeTools: Tool[];
  allTools: Tool[];
  onUpdateActiveTools: (tools: Tool[]) => void;
  onBack: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ activeTools, allTools, onUpdateActiveTools, onBack }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectorQuery, setSelectorQuery] = useState('');

  // Manage reloads independently
  const [reloadKeys, setReloadKeys] = useState<Record<string, number>>({});

  const reloadTool = (toolId: string) => {
    setReloadKeys(prev => ({ ...prev, [toolId]: (prev[toolId] || 0) + 1 }));
  };

  const addTool = (tool: Tool) => {
    if (activeTools.length >= 4) {
      alert("Máximo de 4 ferramentas simultâneas.");
      return;
    }
    // Prevent duplicates
    if (activeTools.find(t => t.id === tool.id)) {
        alert("Esta ferramenta já está aberta.");
        return;
    }
    onUpdateActiveTools([...activeTools, tool]);
    setShowSelector(false);
  };

  const removeTool = (toolId: string) => {
    const updated = activeTools.filter(t => t.id !== toolId);
    if (updated.length === 0) {
      onBack();
    } else {
      onUpdateActiveTools(updated);
    }
  };

  const getGridClasses = (count: number) => {
    switch(count) {
        case 1: return 'grid-cols-1 grid-rows-1';
        case 2: return 'grid-cols-2 grid-rows-1';
        case 3: return 'grid-cols-2 grid-rows-2'; // 3rd takes a slot in 2x2
        case 4: return 'grid-cols-2 grid-rows-2';
        default: return 'grid-cols-1';
    }
  };

  const filteredSelectionTools = allTools.filter(t => 
    t.name.toLowerCase().includes(selectorQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      
      {/* Workspace Global Header */}
      <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={18} />}>
            Voltar
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          <div className="flex items-center gap-2">
             <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-lg text-primary-600 dark:text-primary-400">
                <Monitor size={18} />
             </div>
             <span className="font-medium text-slate-700 dark:text-slate-200 text-sm hidden sm:inline">
                {activeTools.length} {activeTools.length === 1 ? 'Janela Ativa' : 'Janelas Ativas'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTools.length < 4 && (
            <div className="relative">
                <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => setShowSelector(!showSelector)}
                    className={showSelector ? 'ring-2 ring-offset-2 ring-primary' : ''}
                >
                    Adicionar Tela
                </Button>

                {/* Dropdown Tool Selector */}
                {showSelector && (
                    <div className="absolute top-full right-0 mt-2 w-72 max-h-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Buscar ferramenta..." 
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-primary"
                                value={selectorQuery}
                                onChange={(e) => setSelectorQuery(e.target.value)}
                            />
                        </div>
                        <div className="overflow-y-auto p-1">
                            {filteredSelectionTools.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => addTool(tool)}
                                    disabled={!!activeTools.find(t => t.id === tool.id)}
                                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-xs">
                                        {tool.icon.startsWith('http') ? <img src={tool.icon} className="w-4 h-4" /> : tool.icon}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-disabled:text-slate-400">
                                        {tool.name}
                                    </span>
                                    {!!activeTools.find(t => t.id === tool.id) && (
                                        <span className="ml-auto text-xs text-primary font-medium">Aberta</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}
        </div>
      </header>

      {/* Grid Container */}
      <div className={`flex-1 grid gap-2 p-2 overflow-hidden ${getGridClasses(activeTools.length)}`}>
        {activeTools.map((tool) => (
            <div key={tool.id} className="relative flex flex-col bg-white dark:bg-black rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group">
                
                {/* Individual Tool Header */}
                <div className="h-9 bg-slate-50 dark:bg-slate-800 flex items-center justify-between px-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-5 h-5 rounded bg-white dark:bg-slate-700 flex items-center justify-center text-xs shrink-0 shadow-sm">
                            {tool.icon.startsWith('http') ? <img src={tool.icon} className="w-3 h-3" /> : tool.icon}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {tool.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => reloadTool(tool.id)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500"
                            title="Recarregar"
                         >
                            <RefreshCw size={12} />
                         </button>
                         <button 
                            onClick={() => window.open(tool.url, '_blank')}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500"
                            title="Abrir em nova aba"
                         >
                            <ExternalLink size={12} />
                         </button>
                         <button 
                            onClick={() => removeTool(tool.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 rounded text-slate-400 ml-1"
                            title="Fechar Janela"
                         >
                            <X size={12} />
                         </button>
                    </div>
                </div>

                {/* Iframe */}
                <div className="flex-1 relative w-full h-full bg-white dark:bg-black">
                    <iframe
                    key={`${tool.id}-${reloadKeys[tool.id] || 0}`}
                    src={tool.url}
                    title={tool.name}
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                    />
                    
                    {/* Helper overlay for X-Frame-Options */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity">
                        <div className="bg-slate-800/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-[10px] flex items-center gap-1.5 whitespace-nowrap">
                            <AlertTriangle size={10} className="text-yellow-400" />
                            <span>Se branco, use o botão externo.</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {/* Placeholder if 3 items to make grid look balanced (optional, usually empty space is fine but let's make it clear) */}
        {activeTools.length === 3 && (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <button 
                    onClick={() => setShowSelector(true)}
                    className="flex flex-col items-center gap-2 text-slate-400 hover:text-primary transition-colors"
                >
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                        <Plus size={24} />
                    </div>
                    <span className="text-sm font-medium">Adicionar 4ª Tela</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};