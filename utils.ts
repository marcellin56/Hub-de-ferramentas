import { Tool } from "./types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (e) {
    return 'https://via.placeholder.com/64';
  }
};

export const getMicrolinkUrl = (url: string): string => {
  return `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
};

// Heuristic to guess name from URL if fetch fails
export const formatUrlToName = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const name = hostname.replace('www.', '').split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'New Tool';
  }
};