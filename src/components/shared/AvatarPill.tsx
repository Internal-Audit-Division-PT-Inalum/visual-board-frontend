import { cn } from '@/lib/utils';

interface AvatarPillProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarPill({ name, size = 'md', className }: AvatarPillProps) {
  const initials = name
    .split(' ')
    .filter(Boolean) 
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-xs',
    lg: 'w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm',
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full bg-[#0054A6] text-white font-bold shrink-0',
        sizes[size],
        className
      )}
      title={name}
    >
      {initials || '?'}
    </div>
  );
}

