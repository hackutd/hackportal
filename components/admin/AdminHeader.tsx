import { useRef, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';

import { useAuthContext } from '@/lib/user/AuthContext';

import NavLink from '../NavLink';
import { checkUserPermission } from '@/lib/util';

const allowedRoles = ['super_admin'];
/**
 * A dashboard header.
 */
export default function AdminHeader() {
  const { user } = useAuthContext();
  const accordian = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const triggerAccordion = () => {
    let acc = accordian.current;
    setIsOpen(!isOpen);
    acc.classList.toggle('menuactive');
    var panel = acc.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  };

  return (
    <section className="">
      <header className="hidden md:flex flex-row justify-center p-2 items-center">
        <div className=" md:text-base lg:text-xl font-header md:text-left text-complementary font-semibold border-b-2 py-2">
          <NavLink
            href="/admin"
            exact={true}
            activeOptions={'border-b-4 border-primaryDark text-complementaryDark'}
            className="mr-4 py-2"
          >
            Event Dashboard
          </NavLink>
          <NavLink
            href="/admin/scan"
            exact={true}
            activeOptions={'border-b-4 border-primaryDark text-complementaryDark'}
            className="mx-4 py-2"
          >
            Scanner
          </NavLink>
          <NavLink
            href="/admin/users"
            exact={true}
            activeOptions={'border-b-4 border-primaryDark text-complementaryDark'}
            className="mx-4 py-2"
          >
            User Dashboard
          </NavLink>
          {checkUserPermission(user, allowedRoles) && (
            <NavLink
              href="/admin/stats"
              exact={true}
              activeOptions={'border-b-4 border-primaryDark text-complementaryDark'}
              className="ml-4 py-2"
            >
              Stats at a Glance
            </NavLink>
          )}
          <NavLink
            href="/admin/waitlist"
            exact={true}
            activeOptions={'border-b-4 border-primaryDark text-complementaryDark'}
            className="mx-4 py-2"
          >
            Waitlist Check-in
          </NavLink>
        </div>
      </header>
      <div className="mt-4 hidden">
        <button
          ref={accordian}
          onClick={() => triggerAccordion()}
          className="accordion text-left p-2 text-sm bg-[#40B7BA] text-white flex justify-between relative"
        >
          <p>Admin Menu</p>
          <ChevronRightIcon className={`${isOpen ? 'transform rotate-90' : ''} w-5 h-5`} />
        </button>
        <div className="panel w-full bg-secondaryDark text-primaryDark text-sm">
          <ul className="">
            <li className="p-2 hover:bg-secondary cursor-pointer">
              <Link href="/admin" passHref legacyBehavior>
                <div>Event Dashboard</div>
              </Link>
            </li>
            <li className="p-2 hover:bg-secondary cursor-pointer">
              <Link href="/admin/scan" passHref legacyBehavior>
                <div>Scanner</div>
              </Link>
            </li>
            <li className="p-2 hover:bg-[#DCDEFF]">
              <Link href="/admin/users" passHref legacyBehavior>
                <div>User Dashboard</div>
              </Link>
            </li>
            {checkUserPermission(user, allowedRoles) && (
              <li className="p-2 hover:bg-secondary cursor-pointer">
                <Link href="/admin/stats" passHref legacyBehavior>
                  <div>Stats at a Glance</div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
