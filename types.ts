export type Category = 'Todas' | 'Produtividade' | 'Marketing' | 'Dev' | 'Design' | 'Finanças';

export interface Tool {
  id: string;
  name: string;
  url: string;
  category: Category;
  icon: string; // Emoji or URL to icon
  description: string;
  createdAt: number;
}

export type ViewMode = 'grid' | 'workspace';

export interface MetadataResponse {
  title?: string;
  icon?: string;
  description?: string;
}