'use client';

import { cn } from 'cn';

import { REACTION_TYPES } from '@/lib/reactions/config';

import { ReactionButton } from './reaction-button';
import { useReactions } from './use-reactions';

interface Props {
  slug: string;
  readOnly?: boolean;
}

export function PostReactions({ slug, readOnly = false }: Props) {
  const { visibleState, isLoaded, loadFailed, errorMessage, toggleReaction } =
    useReactions(slug);

  return (
    <div>
      <div
        role='group'
        aria-label='Reações'
        className='flex items-center gap-1'
      >
        {REACTION_TYPES.map((type) => (
          <ReactionButton
            key={type}
            type={type}
            count={visibleState?.counts[type]}
            isSelected={visibleState?.choice === type}
            isLoaded={isLoaded}
            loadFailed={loadFailed}
            readOnly={readOnly}
            onToggle={toggleReaction}
          />
        ))}
      </div>

      {/* Always mounted so screen readers announce the message when it appears */}
      <p
        role='status'
        className={cn(
          'text-xs text-red-600 dark:text-red-400',
          errorMessage ? 'mt-1' : 'sr-only',
        )}
      >
        {errorMessage}
      </p>
    </div>
  );
}
