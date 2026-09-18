import { cn } from '@/lib/utils';
import type { AbnormalityStatus } from '@/types/api';
import { Check } from 'lucide-react';

interface StatusBadgeProps {
  status: AbnormalityStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<AbnormalityStatus, { label: string; cls: string; dotCls: string; icon?: boolean }> = {
    open: { label: 'OPEN', cls: 'bg-red-500 text-white shadow-[0_2px_10px_-2px_rgba(239,68,68,0.5)]', dotCls: 'bg-white' },
    in_progress: { label: 'IN PROGRESS', cls: 'bg-amber-500 text-white shadow-[0_2px_10px_-2px_rgba(245,158,11,0.5)]', dotCls: 'bg-white' },
    resolved: { label: 'RESOLVED', cls: 'bg-emerald-500 text-white shadow-[0_2px_10px_-2px_rgba(16,185,129,0.5)]', dotCls: '', icon: true },
  };

  const { label, cls, dotCls, icon } = map[status];
  
  return (
    <span className={cn('px-3 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black rounded-full tracking-widest whitespace-nowrap inline-flex items-center gap-1.5', cls, className)}>
      {icon ? (
        <Check className="w-3 h-3" strokeWidth={3} />
      ) : (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotCls)}></span>
      )}
      {label}
    </span>
  );
}

