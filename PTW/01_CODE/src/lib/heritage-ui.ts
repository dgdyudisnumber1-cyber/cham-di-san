import type { LocationCategory } from '@/types/heritage';

export const categoryMeta: Record<
  LocationCategory,
  { label: string; icon: string; badge: string; text: string; dot: string }
> = {
  'craft-village': {
    label: 'Làng nghề',
    icon: 'ri-hammer-line',
    badge: 'bg-primary-500 text-background-50',
    text: 'text-primary-600',
    dot: 'bg-primary-500',
  },
  monument: {
    label: 'Di tích',
    icon: 'ri-ancient-gate-line',
    badge: 'bg-accent-500 text-foreground-950',
    text: 'text-accent-700',
    dot: 'bg-accent-500',
  },
  'ethnic-region': {
    label: 'Khu vực bản địa',
    icon: 'ri-community-line',
    badge: 'bg-secondary-500 text-background-50',
    text: 'text-secondary-700',
    dot: 'bg-secondary-500',
  },
};