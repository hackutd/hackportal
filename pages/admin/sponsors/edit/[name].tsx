import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SponsorForm from '@/components/admin/sponsor/AdminSponsorForm';
import { RequestHelper } from '@/lib/request-helper';
import { useAuthContext } from '@/lib/user/AuthContext';
import { Sponsor } from '../index';

interface EditSponsorPageProps {
  sponsor: Sponsor;
}

export default function EditSponsorPage({ sponsor }: EditSponsorPageProps) {
  const { user, isSignedIn } = useAuthContext();
  const router = useRouter();
  const { name: originalName } = router.query;

  const submitEditSponsorRequest = async (sponsorData: Sponsor) => {
    try {
      const { data, status } = await RequestHelper.post<any, { msg?: string }>(
        '/api/sponsors',
        {
          headers: {
            Authorization: user.token,
          },
        },
        {
          ...sponsorData,
          originalName: originalName as string,
        },
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
        alert('Sponsor updated successfully!');
        router.push('/admin/sponsors');
      } else {
        alert(`There was an error: ${data?.msg}`);
      }
    } catch (error) {
      alert('Unexpected error! Please try again');
      console.error(error);
    }
  };

  if (!isSignedIn) {
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
          sponsor={sponsor}
          formAction="Edit"
          onSubmitClick={async (sponsorData) => {
            await submitEditSponsorRequest(sponsorData);
          }}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.params;

  if (!name) {
    return {
      notFound: true,
    };
  }

  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<Sponsor[]>(
    `${protocol}://${context.req.headers.host}/api/sponsors`,
    {},
  );

  const sponsor = data.find((s) => s.name === name);

  if (!sponsor) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      sponsor,
    },
  };
};
