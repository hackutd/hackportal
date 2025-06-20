import { useRouter } from 'next/router';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';
import ChallengeForm from '@/components/admin/challenge/ChallengeForm';

import { checkUserPermission } from '@/lib/util';

const allowedRoles = ['super_admin'];

export default function AddChallengePage() {
  const { user, isSignedIn } = useAuthContext();
  const router = useRouter();

  const submitAddChallengeRequest = async (challengeData: Challenge) => {
    try {
      await RequestHelper.post<Challenge, Challenge>(
        '/api/challenges',
        {
          headers: {
            Authorization: user.token,
          },
        },
        {
          ...challengeData,
          rank: parseInt(router.query.id as string),
        },
      );
      alert('Challenge created');
      router.push('/admin/challenges');
    } catch (error) {
      alert('Unexpected error! Please try again');
      console.error(error);
    }
  };

  if (!isSignedIn || !checkUserPermission(user, allowedRoles))
    return <div className="text-2xl font-black text-center">Unauthorized</div>;

  return (
    <div className="p-3">
      <div className="mt-4">
        <Link href="/admin/challenges" passHref legacyBehavior>
          <div className="cursor-pointer items-center inline-flex text-primaryDark font-bold md:text-lg text-base">
            <ChevronLeftIcon />
            Return to challenges
          </div>
        </Link>
      </div>
      <div>
        <ChallengeForm
          onSubmitClick={async (challenge) => {
            await submitAddChallengeRequest(challenge);
          }}
          formAction="Add"
        />
      </div>
    </div>
  );
}
