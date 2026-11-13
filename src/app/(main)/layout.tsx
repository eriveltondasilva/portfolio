import { ProfileSidebar } from '@/components/layout/profile-sidebar';
import { TabsNav } from '@/components/layout/tabs-nav';

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className='mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-12'>
      <div className='flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-14'>
        <ProfileSidebar />

        <main className='min-w-0 flex-1'>
          <TabsNav />

          <div className='py-6'>{children}</div>
        </main>
      </div>
    </div>
  );
}
