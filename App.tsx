import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Moon, Sun, LayoutGrid, HelpCircle } from 'lucide-react';
import { Category, Tool } from './types';
import { ToolCard } from './components/ToolCard';
import { Workspace } from './components/Workspace';
import { Modal } from './components/Modal';
import { AddToolForm } from './components/AddToolForm';
import { Button } from './components/Button';
import { Rafaelzinho } from './components/Rafaelzinho';
import { DEFAULT_TOOLS } from './constants';

function App() {
  // State
  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('dashboard-tools');
    return saved ? JSON.parse(saved) : DEFAULT_TOOLS;
  });
  
  // Changed from activeTool (single) to activeTools (array)
  const [activeTools, setActiveTools] = useState<Tool[]>([]);
  
  // Animation State
  const [isClosing, setIsClosing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  
  // Theme Management
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Effects
  useEffect(() => {
    localStorage.setItem('dashboard-tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Handlers
  const handleAddTool = (newTool: Tool) => {
    if (editingTool) {
      setTools(tools.map(t => t.id === newTool.id ? newTool : t));
    } else {
      setTools([newTool, ...tools]);
    }
    setIsModalOpen(false);
    setEditingTool(null);
  };

  const handleDeleteTool = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ferramenta?')) {
      setTools(tools.filter(t => t.id !== id));
    }
  };

  const handleEditRequest = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleOpenWorkspace = (tool: Tool) => {
    setIsClosing(false);
    // Opens a fresh workspace with just this tool
    setActiveTools([tool]);
  };

  const handleCloseWorkspace = () => {
    setIsClosing(true);
    // Wait for animation to finish before removing from DOM
    setTimeout(() => {
      setActiveTools([]);
      setIsClosing(false);
    }, 200); 
  };

  // Filter Logic
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'Todas' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  const categories: Category[] = ['Todas', 'Produtividade', 'Marketing', 'Dev', 'Design', 'Finanças'];

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-[1800px] mx-auto relative">
      
      {/* Floating Header */}
      <header className="sticky top-6 z-40 mx-2 md:mx-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-3 md:p-4 px-4 md:px-6 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <LayoutGrid size={20} />
                </div>
                <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-white">
                Dashboard<span className="text-primary">Hub</span>
                </span>
            </div>

            {/* Center Navigation Pills - TOUR ID ADDED */}
            <nav id="tour-categories" className="flex items-center overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2 transition-all duration-300">
                <div className="flex p-1 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                {categories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        selectedCategory === cat
                        ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-md transform scale-105'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </nav>

            {/* Right Actions - TOUR ID ADDED */}
            <div id="tour-actions" className="flex items-center gap-2 md:gap-3 transition-all duration-300">
                {/* Search Bar (Compact) */}
                <div className="hidden xl:flex items-center bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary transition-shadow">
                    <Search size={18} className="text-slate-400" />
                    <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="bg-transparent border-none outline-none text-sm ml-2 w-24 2xl:w-32 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                {/* Help Button */}
                <button
                onClick={() => setShowGuide(true)}
                className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-primary dark:hover:text-primary transition-colors"
                title="Ajuda do Rafaelzinho"
                >
                  <HelpCircle size={20} />
                </button>

                <button
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <Button 
                onClick={() => {
                    setEditingTool(null);
                    setIsModalOpen(true);
                }}
                icon={<Plus size={18} />}
                className="shadow-xl shadow-primary/20"
                >
                <span className="hidden sm:inline">Adicionar</span>
                </Button>
            </div>
            </div>

            {/* Mobile Search Bar (Below header on small screens) */}
            <div className="mt-4 xl:hidden relative border-t border-slate-200 dark:border-slate-700 pt-4">
            <Search size={18} className="absolute left-3 top-[1.65rem] -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Pesquise suas ferramentas..." 
                className="w-full bg-slate-50 dark:bg-slate-800/50 backdrop-blur px-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </header>

      {/* Hero / Welcome Section */}
      <section className="mt-10 md:mt-16 mb-8 md:mb-12 flex flex-col items-center justify-center text-center px-4 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-2xl md:text-4xl font-display font-medium text-slate-700 dark:text-slate-300 mb-2">
            Bem-vindo ao seu
        </h1>
        <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl font-display font-black text-primary pb-2">
                Painel de Ferramentas
            </h1>
            {/* Decorative underline/glow */}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 blur-sm"></div>
        </div>
      </section>

      {/* Grid Content - TOUR ID ADDED */}
      <main id="tour-grid" className="mt-6">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 md:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onOpen={handleOpenWorkspace}
                onEdit={handleEditRequest}
                onDelete={handleDeleteTool}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-slate-300 dark:text-slate-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Nenhuma ferramenta encontrada</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
               Não encontramos ferramentas com seus critérios. Tente ajustar os filtros ou adicionar uma nova.
             </p>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTool ? "Editar Ferramenta" : "Nova Ferramenta"}
      >
        <AddToolForm 
          onAdd={handleAddTool} 
          onCancel={() => setIsModalOpen(false)}
          initialData={editingTool}
        />
      </Modal>

      {/* EXPANDING WORKSPACE OVERLAY */}
      {activeTools.length > 0 && (
        <div 
          className={`fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-900 shadow-2xl overflow-hidden ${
            isClosing 
              ? 'animate-[collapseWorkspace_0.2s_ease-in_forwards]' 
              : 'animate-[expandWorkspace_0.25s_ease-out_forwards]'
          }`}
        >
          <Workspace 
            activeTools={activeTools} 
            allTools={tools}
            onUpdateActiveTools={setActiveTools}
            onBack={handleCloseWorkspace} 
          />
        </div>
      )}

      {/* Assistente Rafaelzinho */}
      {showGuide && activeTools.length === 0 && !isModalOpen && (
        <Rafaelzinho onClose={() => setShowGuide(false)} />
      )}

    </div>
  );
}

export default App;