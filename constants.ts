import { Tool } from "./types";

export const DEFAULT_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Figma',
    url: 'https://www.figma.com',
    category: 'Design',
    icon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
    description: 'Interface design tool.',
    createdAt: 1625241000000,
  },
  {
    id: '2',
    name: 'Notion',
    url: 'https://www.notion.so',
    category: 'Production',
    icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
    description: 'All-in-one workspace.',
    createdAt: 1625242000000,
  },
  {
    id: '3',
    name: 'GitHub',
    url: 'https://github.com',
    category: 'Dev',
    icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    description: 'Where the world builds software.',
    createdAt: 1625243000000,
  },
  {
    id: '4',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'Production',
    icon: '🤖',
    description: 'AI Conversational Partner.',
    createdAt: 1625244000000,
  },
  {
    id: '5',
    name: 'Stripe',
    url: 'https://stripe.com',
    category: 'Finance',
    icon: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=128',
    description: 'Financial infrastructure platform.',
    createdAt: 1625245000000,
  }
];