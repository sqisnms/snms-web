'use client';

import { HomeIcon, ServerStackIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: '대시보드', href: '/dashboard', icon: HomeIcon },
  { name: '시스템관리', href: '/dashboard', icon: ServerStackIcon },
  { name: '설정', href: '/dashboard', icon: Cog8ToothIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ name, href, icon: LinkIcon }) => (
        <Link
          key={name}
          href={href}
          className={clsx(
            'flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3',
            { 'bg-sky-100 text-blue-600': pathname === href },
          )}
        >
          <LinkIcon className='w-6' />
          <span className='hidden md:block'>{name}</span>
        </Link>
      ))}
    </>
  );
}
