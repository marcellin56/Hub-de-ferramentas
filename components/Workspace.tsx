import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { Tool } from '../types';
import { Button } from './Button';

interface WorkspaceProps {
  tool: Tool;
  onBack: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ tool, onBack }) => {
  const [iframeKey, setIframeKey] = useState(0);

  const reload = () => setIframeKey(prev => prev + 1);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      {/* Workspace Header */}
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={18} />}>
            Back
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg">
                {tool.icon.startsWith('http') ? <img src={tool.icon} className="w-5 h-5" /> : tool.icon}
             </div>
             <div>
                <h1 className="font-display font-bold text-slate-800 dark:text-white text-lg leading-none">{tool.name}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tool.url}</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={reload} icon={<RefreshCw size={16} />}>
             Reload
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => window.open(tool.url, '_blank')}
            icon={<ExternalLink size={16} />}
          >
            Open Original
          </Button>
        </div>
      </header>

      {/* Iframe Container */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-white dark:bg-black">
        <iframe
          key={iframeKey}
          src={tool.url}
          title={tool.name}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
        />
        
        {/* Helper overlay for X-Frame-Options */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-60">
           <div className="bg-slate-800/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs flex items-center gap-2">
              <AlertTriangle size={12} className="text-yellow-400" />
              <span>If content is blank, this site blocks embedding. Use "Open Original".</span>
           </div>
        </div>
      </div>
    </div>
  );
};