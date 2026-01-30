import React from 'react';
import { ExternalLink, Edit2, Trash2, Maximize2 } from 'lucide-react';
import { Tool } from '../types';
import { getMicrolinkUrl } from '../utils';

interface ToolCardProps {
  tool: Tool;
  onOpen: (tool: Tool) => void;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpen, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-soft-glow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Visual Preview */}
      <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 mb-4 cursor-pointer" onClick={() => onOpen(tool)}>
        <img 
          src={getMicrolinkUrl(tool.url)} 
          alt={`${tool.name} preview`}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/600/400?blur=2'; // Fallback
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
                <Maximize2 size={16} /> Open Workspace
             </span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xl shadow-inner border border-slate-100 dark:border-slate-600">
            {tool.icon.startsWith('http') ? (
              <img src={tool.icon} alt="icon" className="w-6 h-6 rounded-sm" />
            ) : (
              <span>{tool.icon}</span>
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight truncate max-w-[150px]">
              {tool.name}
            </h3>
            <span className="text-xs font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-grow">
        {tool.description || `Manage your ${tool.name} workflow directly from the dashboard.`}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex gap-1">
           <button 
            onClick={() => onEdit(tool)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(tool.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button 
          onClick={() => window.open(tool.url, '_blank')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          New Tab <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};