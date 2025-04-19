import React from 'react';
import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SponsorForm from '@/components/admin/sponsor/AdminSponsorForm';

function isAuthorized(user: any): boolean {
  if (!user || !user.permissions) return false;
  return (user.permissions as string[]).includes('super_admin');
}

export default function AddSponsorPage() {
  const { user, isSignedIn } = useAuthContext();
  const router = useRouter();

  const submitAddSponsorRequest = async (sponsorData: Sponsor) => {
    try {
      const { data, status } = await RequestHelper.post<Sponsor, { msg?: string }>(
        '/api/sponsors',
        {
          headers: {
            Authorization: user.token,
          },
        },
        sponsorData,
      );

      if (status === 403) {
        alert('You do not have the permission to perform this functionality');
        return;
      }
      if (status >= 400) {
        alert(`Unexpected HTTP error: ${status}`);
        return;
      }

      if (status >= 200 && status < 300) {
        alert('Sponsor created successfully!');
        router.push('/admin/sponsors');
      } else {
        alert(`There was an error: ${data?.msg}`);
      }
    } catch (error) {
      alert('Unexpected error! Please try again');
      console.error(error);
    }
  };

  if (!isSignedIn || !isAuthorized(user)) {
    return <div className="text-2xl font-black text-center">Unauthorized</div>;
  }

  return (
    <div className="2xl:px-36 md:px-16 px-6">
      <div className="mt-4">
        <Link href="/admin/sponsors" passHref legacyBehavior>
          <div className="cursor-pointer inline-flex items-center text-primaryDark font-bold md:text-lg text-base">
            <ChevronLeftIcon />
            Return to sponsors
          </div>
        </Link>
      </div>
      <div className="mt-4">
        <SponsorForm
          formAction="Add"
          onSubmitClick={async (sponsorData) => {
            await submitAddSponsorRequest(sponsorData);
          }}
        />
      </div>
    </div>
  );
}
