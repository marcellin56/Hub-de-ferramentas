import React, { useState } from 'react';
import { Category, Tool } from '../types';
import { Button } from './Button';
import { getFaviconUrl, formatUrlToName, generateId } from '../utils';

interface AddToolFormProps {
  onAdd: (tool: Tool) => void;
  onCancel: () => void;
  initialData?: Tool | null;
}

export const AddToolForm: React.FC<AddToolFormProps> = ({ onAdd, onCancel, initialData }) => {
  const [url, setUrl] = useState(initialData?.url || '');
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Production');
  const [emoji, setEmoji] = useState(initialData?.icon || '⚡️');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  // Heuristic Auto-fill
  const handleUrlBlur = () => {
    if (!url) return;
    
    // Auto-fill name if empty
    if (!name) {
      setName(formatUrlToName(url));
    }
    
    // Auto-set emoji to favicon if standard emoji isn't selected
    if (emoji === '⚡️' || emoji === '') {
        const favicon = getFaviconUrl(url);
        // We set the URL as the "icon" string if it's an image
        setEmoji(favicon); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newTool: Tool = {
      id: initialData?.id || generateId(),
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      category,
      icon: emoji,
      description,
      createdAt: initialData?.createdAt || Date.now(),
    };

    // Simulate small delay for UX
    setTimeout(() => {
        onAdd(newTool);
        setIsLoading(false);
    }, 400);
  };

  const categories: Category[] = ['Production', 'Marketing', 'Dev', 'Design', 'Finance'];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tool URL
        </label>
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={handleUrlBlur}
          placeholder="https://example.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Figma"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="col-span-1">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Icon
          </label>
          <input 
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center text-xl"
            placeholder="Icon"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                category === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div>
         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description (Optional)
        </label>
        <textarea
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           placeholder="Short description of what this tool does..."
           className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-20 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : (initialData ? 'Update Tool' : 'Add Tool')}
        </Button>
      </div>
    </form>
  );
};