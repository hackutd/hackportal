import { ArrowNarrowRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';

interface Props {
  title: string;
  href: string;
}

export default function EventLink({ title, href }: Props) {
  return (
    <Link href={href} legacyBehavior>
      <div className="border-b-[1px] border-primaryDark/50 py-2 flex flex-row items-center gap-x-2">
        <h1 className="sm:text-lg text-base font-bold hover:cursor-pointer text-primaryDark">
          {title}
        </h1>
        <ArrowNarrowRightIcon className="w-5 h-5 text-primaryDark" />
      </div>
    </Link>
  );
}
