import AdminSponsorList from '@/components/admin/sponsor/AdminSponsorList';
import { RequestHelper } from '@/lib/request-helper';
import { useAuthContext } from '@/lib/user/AuthContext';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';

export interface Sponsor {
  name: string;
  link: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
  // base64 encoded image data instead of a path
  reference: string;
}

interface AdminSponsorPageProps {
  sponsors_: Sponsor[];
}

function isAuthorized(user): boolean {
  if (!user || !user.permissions) return false;
  return (user.permissions as string[]).includes('super_admin');
}

const Page = ({ sponsors_ }: AdminSponsorPageProps) => {
  const { user, isSignedIn } = useAuthContext();

  const [sponsors, setSponsors] = useState<Sponsor[]>(sponsors_);

  if (!isSignedIn || !isAuthorized(user))
    return <div className="text-2xl font-bold text-center">Unauthorized</div>;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-12 gap-4 ">
      <AdminSponsorList sponsors={sponsors} />
      <div className="p-3">
        <Link href={`/admin/sponsors/add`} legacyBehavior>
          <button className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2">
            Add New Sponsor
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<Sponsor[]>(
    `${protocol}://${context.req.headers.host}/api/sponsors`,
    {},
  );

  return {
    props: {
      sponsors_: data,
    },
  };
};
