import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Moon, Sun, LayoutGrid } from 'lucide-react';
import { Category, Tool, ViewMode } from './types';
import { ToolCard } from './components/ToolCard';
import { Workspace } from './components/Workspace';
import { Modal } from './components/Modal';
import { AddToolForm } from './components/AddToolForm';
import { Button } from './components/Button';
import { DEFAULT_TOOLS } from './constants';

function App() {
  // State
  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('dashboard-tools');
    return saved ? JSON.parse(saved) : DEFAULT_TOOLS;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  
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
    if (window.confirm('Are you sure you want to delete this tool?')) {
      setTools(tools.filter(t => t.id !== id));
    }
  };

  const handleEditRequest = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleOpenWorkspace = (tool: Tool) => {
    setActiveTool(tool);
    setViewMode('workspace');
  };

  const handleCloseWorkspace = () => {
    setViewMode('grid');
    setActiveTool(null);
  };

  // Filter Logic
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  const categories: Category[] = ['All', 'Production', 'Marketing', 'Dev', 'Design', 'Finance'];

  // View: Workspace
  if (viewMode === 'workspace' && activeTool) {
    return <Workspace tool={activeTool} onBack={handleCloseWorkspace} />;
  }

  // View: Grid (Main Dashboard)
  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <header className="py-8 sticky top-0 z-40">
        {/* Blur backdrop for sticky header */}
        <div className="absolute inset-0 -mx-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <LayoutGrid size={20} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
              Dashboard<span className="text-indigo-600">Hub</span>
            </span>
          </div>

          {/* Center Navigation Pills */}
          <nav className="flex items-center overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            <div className="flex p-1.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
             {/* Search Bar (Compact) */}
             <div className="hidden lg:flex items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Find tool..." 
                  className="bg-transparent border-none outline-none text-sm ml-2 w-32 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

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
              className="shadow-xl shadow-indigo-500/20"
            >
              Add Tool
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar (Below header on small screens) */}
        <div className="mt-4 lg:hidden relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
              type="text" 
              placeholder="Search your tools..." 
              className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur px-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </header>

      {/* Grid Content */}
      <main className="mt-6">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No tools found</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
               We couldn't find any tools matching your criteria. Try adjusting your filters or add a new one.
             </p>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTool ? "Edit Tool" : "Add New Tool"}
      >
        <AddToolForm 
          onAdd={handleAddTool} 
          onCancel={() => setIsModalOpen(false)}
          initialData={editingTool}
        />
      </Modal>

    </div>
  );
}

export default App;