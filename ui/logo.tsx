import Link from 'next/link';
import Image from 'next/image';

export default function SNMSLogo() {
  return (
    <Link href='/'>
      <div className='flex flex-row items-center text-white'>
        <Image src='/logo.png' width={160} height={60} className='hidden md:block' alt='S-NMS' />
      </div>
    </Link>
  );
}
