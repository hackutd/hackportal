import { useRouter } from 'next/router';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { checkUserPermission } from '@/lib/util';
import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';

import EventForm from '@/components/admin/event/EventForm';

const allowedRoles = ['super_admin'];

export default function AddEventPage() {
  const { user, isSignedIn } = useAuthContext();
  const router = useRouter();

  const submitAddEventRequest = async (eventData: ScheduleEvent) => {
    try {
      await RequestHelper.post<ScheduleEvent, ScheduleEvent>(
        '/api/schedule',
        {
          headers: {
            Authorization: user.token,
          },
        },
        {
          ...eventData,
          Event: parseInt(router.query.id as string),
        },
      );
      alert('Event created');
      router.push('/admin/events');
    } catch (error) {
      alert('Unexpected error! Please try again');
      console.error(error);
    }
  };

  if (!isSignedIn || !checkUserPermission(user, allowedRoles))
    return <div className="text-2xl font-black text-center">Unauthorized</div>;

  return (
    <div className="2xl:px-36 md:px-16 px-6">
      <div className="mt-4">
        <Link href="/admin/events" passHref legacyBehavior>
          <div className="cursor-pointer items-center inline-flex text-primaryDark font-bold md:text-lg text-base">
            <ChevronLeftIcon />
            Return to events
          </div>
        </Link>
      </div>
      <div>
        <EventForm
          onSubmitClick={async (event) => {
            await submitAddEventRequest(event);
          }}
          formAction="Add"
        />
      </div>
    </div>
  );
}
