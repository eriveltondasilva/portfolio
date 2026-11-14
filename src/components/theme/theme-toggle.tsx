'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const LABEL = 'Alternar tema';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          aria-label={LABEL}
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className='shrink-0 text-muted-foreground hover:text-foreground'
        >
          <Icon iconNode={SunIcon} className='hidden dark:block' />
          <Icon iconNode={MoonIcon} className='dark:hidden' />
        </Button>
      </TooltipTrigger>

      <TooltipContent>{LABEL}</TooltipContent>
    </Tooltip>
  );
}
