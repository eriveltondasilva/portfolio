'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <Button
      type='button'
      variant='outline'
      size='icon-sm'
      className='shrink-0 text-zinc-500 dark:text-zinc-400'
      onClick={toggleTheme}
    >
      <Icon iconNode={SunIcon} className='hidden dark:block' />
      <Icon iconNode={MoonIcon} className='dark:hidden' />
      <span className='sr-only'>Alternar tema</span>
    </Button>
  );
}
