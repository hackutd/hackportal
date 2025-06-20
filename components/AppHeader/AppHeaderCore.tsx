import { Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';
import { SectionReferenceContext } from '@/lib/context/section';
import { NavbarCallbackRegistryContext } from '@/lib/context/navbar';

import AdminNavbarGrid from './AdminNavbarGrid';
import AdminNavbarColumn from './AdminNavbarColumn';
import QRScanDialog from './QRScanDialog';
import FloatingDock from '../FloatingDock';

type Props = {
  dockItemIdRoot?: string;
};

type Scan = {
  precendence: number;
  name: string;
  isCheckIn: boolean;
  startTime: Date;
  endTime: Date;
  isPermanentScan: boolean;
};

export default function AppHeaderCore(props: Props) {
  const { user, hasProfile, signOut } = useAuthContext();
  const { callbackRegistry } = useContext(NavbarCallbackRegistryContext);

  const router = useRouter();

  const isSuperAdmin = user ? user.permissions.indexOf('super_admin') !== -1 : false;
  const isAdmin = isSuperAdmin || (user ? user.permissions.indexOf('admin') !== -1 : false);

  const [scanList, setScanList] = useState<Scan[]>([]);
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

  useEffect(() => {
    async function getScanData() {
      const scans = await RequestHelper.get<Scan[]>('/api/scantypes', {
        headers: {
          authorization: user?.token || '',
        },
      });
      setScanList(scans.data);
    }
    if (!isAdmin) {
      setScanList([]);
    } else {
      getScanData();
    }
  }, [user, isAdmin]);

  const mainDockItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    const itemIdRoot: string = (props.dockItemIdRoot ?? 'AppHeader2-Core-mainDockItems') + '_';
    let itemIdx = 0;

    const navItems = [
      {
        text: 'Home',
        onClick: () => {
          if (router.pathname === '/') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          } else {
            window.location.href = '/';
          }
        },
      },
      {
        text: 'Livestream',
        onClick: () => {
          if (router.pathname === '/live') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          } else {
            window.location.href = '/live';
          }
        },
      },
      {
        text: 'Hackerpacks',
        onClick: () => {
          if (router.pathname === '/hackerpacks') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          } else {
            window.location.href = '/hackerpacks';
          }
        },
      },
      {
        text: 'Schedule',
        onClick: () => {
          if (router.pathname === '/') {
            document.getElementById('schedule-section')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            router.push('/#schedule-section');
          }
        },
      },
      {
        text: 'FAQ',
        onClick: () => {
          if (router.pathname === '/') {
            document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            router.push('/#faq-section');
          }
        },
      },
    ];

    navItems.map((item, idx) => {
      items.push(
        <button
          id={itemIdRoot + idx}
          onClick={item.onClick}
          className={clsx(
            'py-2 px-4 text-[#5D5A88] cursor-pointer flex justify-center font-bold',
            'hover:bg-[#EAE6F2] transition-[background] duration-300 ease-in-out',
            'rounded-[20px]',
          )}
        >
          {item.text}
        </button>,
      );

      itemIdx += 1;
    });

    if (isAdmin) {
      items.push(
        <Menu id={itemIdRoot + itemIdx} as="div">
          <Menu.Button
            className={clsx(
              'py-2 px-4 text-[#5D5A88] cursor-pointer flex gap-1 items-center justify-center font-bold',
              'hover:bg-[#EAE6F2] transition-[background] duration-300 ease-in-out',
              'rounded-[20px]',
            )}
          >
            <div className="text-[##5D5A88]">Admin</div>
            <svg
              xmlns="http:www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#5D5A88"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right divide-x divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none flex">
              <div className="w-1/2 px-1 py-1">
                <AdminNavbarGrid
                  numCols={2}
                  sectionTitle="Admin"
                  options={[
                    {
                      optionName: 'Event Dashboard',
                      onClick: () => router.push('/admin'),
                    },
                    {
                      optionName: 'Scanner',
                      onClick: () => router.push('/admin/scan'),
                    },
                    {
                      optionName: 'User Dashboard',
                      onClick: () => router.push('/admin/users'),
                    },
                    {
                      optionName: 'Late Check-in',
                      onClick: () => router.push('/admin/waitlist'),
                    },
                    ...(isSuperAdmin
                      ? [
                          {
                            optionName: 'Stats at a Glance',
                            onClick: () => router.push('/admin/stats'),
                          },
                        ]
                      : []),
                    ...(isAdmin
                      ? [
                          {
                            optionName: 'Scanner',
                            onClick: () => router.push('/admin/scan'),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
              <div className="px-1 py-1 w-1/4">
                <AdminNavbarColumn
                  sectionTitle="Temporary Scans"
                  options={scanList
                    .filter((scan) => !scan.isPermanentScan)
                    .map((scan) => ({
                      optionName: scan.name,
                      onClick: () => setCurrentScan(scan),
                    }))}
                />
              </div>

              <div className="px-1 py-1">
                <AdminNavbarColumn
                  sectionTitle="Permanent Scans"
                  options={scanList
                    .filter((scan) => scan.isPermanentScan)
                    .map((scan) => ({
                      optionName: scan.name,
                      onClick: () => setCurrentScan(scan),
                    }))}
                />
              </div>
            </Menu.Items>
          </Transition>
        </Menu>,
      );
      itemIdx++;
    }

    // Profile/Apply button
    // TODO: Read after applications open
    items.push(
      <div id={itemIdRoot + itemIdx} className="p-2 text-white cursor-pointer">
        {user && hasProfile && (
          <button
            onClick={async () => {
              if (Object.hasOwn(callbackRegistry, router.pathname)) {
                await callbackRegistry[router.pathname]();
              }
              await router.push('/profile');
            }}
          >
            <div className="py-3 px-5 rounded-[30px] bg-[#5D5A88] font-bold">Profile</div>
          </button>
        )}
      </div>,
    );
    itemIdx++;

    return items;
  };

  return (
    <div className="flex justify-center py-2 w-full">
      {/* Real navbar */}
      <div
        id="nav-bar"
        className="relative font-dmSans border-[3px] border-[rgba(30,30,30,0.60)] rounded-xl p-1 bg-white opacity-90 text-[#5D5A88] cursor-pointer flex-wrap"
      >
        {/* Sign out button */}
        <button
          className={clsx(
            'w-[102px]',
            'top-1/2 -translate-y-1/2',
            `absolute ${
              location.pathname === '/'
                ? '-left-[calc(102px+0.5rem)] lg:left-[unset] lg:-right-[calc(102px+1rem)] xl:-right-[calc(102px+2rem)]'
                : '-right-[calc(102px+0.5rem)] lg:-right-[calc(102px+2rem)]'
            }`,
            'text-sm py-3 px-4 rounded-[30px] bg-[#5D5A88] font-bold text-white border-2 border-white',
          )}
          onClick={async () => {
            if (user) {
              await signOut();
            } else {
              await router.push('/auth');
            }
          }}
        >
          {user ? 'Sign Out' : 'Sign In'}
        </button>

        <FloatingDock
          classes={{
            wrapperDiv: clsx('gap-4 flex items-center justify-center flex-wrap'),
          }}
          items={mainDockItems()}
        />

        <QRScanDialog scan={currentScan} onModalClose={() => setCurrentScan(null)} />
      </div>
    </div>
  );
}
