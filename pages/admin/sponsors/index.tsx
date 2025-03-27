import AdminSponsorList from '@/components/adminComponents/sponsorComponents/AdminSponsorList';
import { RequestHelper } from '@/lib/request-helper';
import { useAuthContext } from '@/lib/user/AuthContext';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

const Page = () => {
  const { user, isSignedIn } = useAuthContext();

  const [values, setValues] = React.useState({
    link: '',
    img: '',
    tier: '',
  });

  const [form, setForm] = React.useState({
    link: values.link,
    img: values.img,
    tier: values.tier,
  });

  const [isEditing, setIsEditing] = React.useState(false);

  const onSubmit = async () => {
    const { data }: any = await RequestHelper.post(
      '/api/sponsors',
      {
        headers: {
          authorization: user.token,
        },
      },
      form,
    );
    if (data.msg == 'ok') {
      setValues(form);
      setIsEditing(false);
      alert('updated');
    } else {
      alert('there was an error: ' + data.msg);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: keynote }: any = await RequestHelper.get('/api/sponsors', {});
      setValues(keynote);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-12 gap-4 ">
      <AdminSponsorList />
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
