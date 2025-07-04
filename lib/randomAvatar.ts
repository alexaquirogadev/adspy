// Helper para generar la URL SVG de Boring Avatars con la paleta dopamine
// Ubicación: /lib/randomAvatar.ts
// Uso: import randomAvatar from '@/lib/randomAvatar';

const PALETTE = 'ff006f,fff538,00d1ff,000000,f1f1f1';

export default function randomAvatar(seed?: string): string {
  const finalSeed = seed || Math.random().toString(36).slice(2, 10);
  return `https://source.boringavatars.com/beam/160/${finalSeed}?colors=${PALETTE}`;
} 