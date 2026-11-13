import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { REACTION_CONFIG } from '@/lib/reactions/config';

import type { ReactionType } from '@/lib/reactions/config';

function ReactionCount({
  value,
  loadFailed,
}: {
  value: number | undefined;
  loadFailed: boolean;
}) {
  if (value === undefined) {
    return loadFailed ? <span className='font-mono'>–</span> : null;
  }

  if (value === 0) return null;

  return <span className='font-mono tabular-nums'>{value}</span>;
}

interface Props {
  type: ReactionType;
  count: number | undefined;
  isSelected: boolean;
  isLoaded: boolean;
  loadFailed: boolean;
  readOnly: boolean;
  onToggle: (type: ReactionType) => void;
}

export function ReactionButton({
  type,
  count,
  isSelected,
  isLoaded,
  loadFailed,
  readOnly,
  onToggle,
}: Props) {
  const { emoji, label } = REACTION_CONFIG[type];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onToggle(type)}
          disabled={readOnly}
          aria-disabled={!isLoaded}
          aria-pressed={isSelected}
          aria-label={count === undefined ? label : `${label} (${count})`}
          className={cn(
            'h-8 gap-1.5 px-2 text-xs',
            isSelected ?
              'bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
            : 'text-zinc-500 dark:text-zinc-400',
          )}
        >
          <span className='text-sm leading-none' aria-hidden='true'>
            {emoji}
          </span>
          <span className='md:hidden'>{label}</span>
          <ReactionCount value={count} loadFailed={loadFailed} />
        </Button>
      </TooltipTrigger>

      {/* The label is already visible on mobile */}
      <TooltipContent className='max-md:hidden'>{label}</TooltipContent>
    </Tooltip>
  );
}
