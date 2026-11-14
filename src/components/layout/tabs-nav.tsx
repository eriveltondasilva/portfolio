'use client';

import {
  FileTextIcon,
  FolderGit2Icon,
  FolderBookmarkIcon,
  HashIcon,
  LayoutGridIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from 'cn';

import { SearchDialog } from '@/components/search-dialog';
import { Icon } from '@/components/icon';
import { ThemeToggle } from '@/components/theme/theme-toggle';

import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';

type Tab = {
  label: string;
  href: Route;
  icon: LucideIcon;
};

const tabs = [
  { label: 'Home', href: '/', icon: LayoutGridIcon },
  { label: 'Blog', href: '/blog', icon: FileTextIcon },
  { label: 'Séries', href: '/series', icon: FolderBookmarkIcon },
  { label: 'Projetos', href: '/projects', icon: FolderGit2Icon },
  { label: 'Tags', href: '/tags', icon: HashIcon },
] as const satisfies ReadonlyArray<Tab>;

export function TabsNav() {
  const pathname = usePathname();

  return (
    <nav
      className='flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700/60'
      aria-label='Navegação principal'
    >
      <div className='-mb-px flex min-w-0 flex-1 overflow-x-auto'>
        {tabs.map(({ label, href, icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                isActive ?
                  'border-orange-500 text-zinc-900 dark:border-orange-400 dark:text-zinc-50'
                : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200',
              )}
            >
              <Icon iconNode={icon} />
              {label}
            </Link>
          );
        })}
      </div>

      <SearchDialog />
      <ThemeToggle />
    </nav>
  );
}
