import { useEffect, useRef, useState } from 'react';
import Pagination from './HackerApplicationPagination';
import { useAuthContext } from '../../../lib/user/AuthContext';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  LockOpenIcon,
  XIcon,
} from '@heroicons/react/solid';
import { getGroupId } from './utils';
import UserAdminGroupCarousel from './HackerApplicationGroupCarousel';
import { ApplicationViewState } from '@/lib/util';
import { ApplicationEntry, useUserGroup } from '@/lib/admin/group';

interface UserAdminGroupViewProps {
  userGroups: ApplicationEntry[];
  currentUserGroupId: string;
  goBack: () => void;
  // updateCurrentUser: (value: Omit<UserIdentifier, 'scans'>) => void;
  onUserGroupClick: (id: string) => void;
  // onAcceptReject: (status: string, notes: string) => void;
  // onUpdateRole: (newRole: UserPermission) => void;
  appViewState: ApplicationViewState;
}

export default function UserAdminGroupView({
  userGroups,
  currentUserGroupId,
  goBack,
  onUserGroupClick,
  appViewState,
}: UserAdminGroupViewProps) {
  const { user } = useAuthContext();
  const [currentUserGroupIndex, setCurrentUserGroupIndex] = useState(0);

  useEffect(() => {
    let tempCurrentUserGroupIndex = 0;
    for (let i = 0; i < userGroups.length; i++) {
      if (getGroupId(userGroups[i].application) === currentUserGroupId) {
        tempCurrentUserGroupIndex = i;
        break;
      }
    }
    setCurrentUserGroupIndex(tempCurrentUserGroupIndex);
  }, [userGroups, currentUserGroupId]);

  const stringifyScore = (appScore: { acceptCount: number; rejectCount: number }) => {
    if (appScore.acceptCount >= 1000000000) return 'Auto-Accepted by HackPortal';
    return `${appScore.acceptCount - appScore.rejectCount} (${appScore.acceptCount} accepted, ${
      appScore.rejectCount
    } rejected)`;
  };

  // Pagination
  const ref = useRef(null);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [height, setHeight] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  // Contains info of the user who is viewing the data
  const { user: organizer } = useAuthContext();

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const h = Math.max(60, ref.current.offsetHeight);
    setHeight(h);
    setCurrentPage(Math.floor(currentUserGroupIndex / Math.floor(h / 60) + 1));
  }, [windowHeight, currentUserGroupIndex]);

  const pageSize = Math.floor(height / 60);
  const startIndex = (currentPage - 1) * pageSize;

  // 208 px
  return (
    <div
      className={`
        lg:mx-14 flex flex-row h-full 
        bg-[rgba(255,255,255,0.6)] backdrop-blur
        rounded-2xl
      `}
    >
      {/* User List */}
      <div className="hidden md:block md:w-72 px-2 py-4">
        {/* Page */}
        <div className="overflow-y-hidden h-[calc(100%-40px)]" ref={ref}>
          {userGroups.slice(startIndex, startIndex + pageSize).map((group, idx) => (
            <div
              key={getGroupId(group.application)}
              className={`
                flex flex-row justify-center items-center w-full py-2 rounded-xl mb-3 h-12 p-4
                bg-[rgba(255,255,255,0.6)]
                shadow-md ${
                  getGroupId(group.application) === currentUserGroupId
                    ? 'border-primaryDark border-[2px]'
                    : ''
                }
                cursor-pointer
                gap-x-3
              `}
              onClick={() => {
                onUserGroupClick(getGroupId(group.application));
              }}
            >
              {/* <div
                className={`
                  text-[rgba(19,19,19,1)] font-bold
                  whitespace-nowrap overflow-hidden text-ellipsis max-w-[50%]
                `}
              >
                {user.user.firstName}
              </div> */}

              <div
                className={`
                  py-1 px-6 text-sm font-bold rounded-full
                  flex-1 flex flex-row justify-center items-center
                  whitespace-nowrap overflow-hidden text-ellipsis
                  ${
                    group.application[0].status === 'Accepted'
                      ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]'
                      : ''
                  }
                  ${
                    group.application[0].status === 'Rejected'
                      ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]'
                      : ''
                  }
                  ${
                    group.application[0].status === 'In Review'
                      ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]'
                      : ''
                  }
                  ${
                    group.application[0].status.startsWith('Maybe')
                      ? 'bg-yellow-200 text-[rgb(9,45,122)]'
                      : ''
                  }
                `}
              >
                {group.application[0].status}
              </div>
              <div
                className={`
                  py-1 px-6 text-sm font-bold rounded-full
                  flex-1 flex flex-row justify-center items-center
                  whitespace-nowrap overflow-hidden text-ellipsis
                  bg-green-200                
                `}
              >
                {group.application.length} member{group.application.length > 1 && 's'}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalCount={userGroups.length}
          pageSize={pageSize}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>

      {/* User */}
      <div className="rounded-2xl h-full overflow-y-hidden w-full flex-1">
        {/* Header */}
        <div className="sticky top-0 bg-[rgba(255,255,255,0.8)] flex flex-row justify-between items-center text-secondary">
          <div className="flex items-center p-0">
            <ChevronLeftIcon
              className="h-12 w-12 text-sm font-extralight cursor-pointer text-[#5D5A88]"
              onClick={() =>
                onUserGroupClick(
                  userGroups[currentUserGroupIndex - 1]
                    ? getGroupId(userGroups[currentUserGroupIndex - 1].application)
                    : '',
                )
              }
            />
            <ChevronRightIcon
              className="h-12 w-12 text-sm font-extralight cursor-pointer text-[#5D5A88]"
              onClick={() =>
                onUserGroupClick(
                  userGroups[currentUserGroupIndex + 1]
                    ? getGroupId(userGroups[currentUserGroupIndex + 1].application)
                    : '',
                )
              }
            />
          </div>
          <div onClick={goBack} className="p-3">
            <XIcon className="h-12 w-12 cursor-pointer text-[#5D5A88]" />
          </div>
        </div>

        {/* Application */}
        <UserAdminGroupCarousel
          group={userGroups[currentUserGroupIndex].application}
          appViewState={appViewState}
        />
      </div>
    </div>
  );
}
