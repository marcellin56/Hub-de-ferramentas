export type Category = 'All' | 'Production' | 'Marketing' | 'Dev' | 'Design' | 'Finance';

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