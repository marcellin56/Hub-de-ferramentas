import { Tool } from "./types";

export const DEFAULT_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Figma',
    url: 'https://www.figma.com',
    category: 'Design',
    icon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
    description: 'Ferramenta de design de interfaces.',
    createdAt: 1625241000000,
  },
  {
    id: '2',
    name: 'Notion',
    url: 'https://www.notion.so',
    category: 'Produtividade',
    icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
    description: 'Espaço de trabalho tudo-em-um.',
    createdAt: 1625242000000,
  },
  {
    id: '3',
    name: 'GitHub',
    url: 'https://github.com',
    category: 'Dev',
    icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    description: 'Onde o mundo constrói software.',
    createdAt: 1625243000000,
  },
  {
    id: '4',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'Produtividade',
    icon: '🤖',
    description: 'Parceiro de conversação com IA.',
    createdAt: 1625244000000,
  },
  {
    id: '5',
    name: 'Stripe',
    url: 'https://stripe.com',
    category: 'Finanças',
    icon: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=128',
    description: 'Infraestrutura financeira para a internet.',
    createdAt: 1625245000000,
  }
];