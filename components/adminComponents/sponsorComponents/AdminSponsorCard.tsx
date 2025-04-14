import React, { useState } from 'react';
import Link from 'next/link';
import { RequestHelper } from '@/lib/request-helper';
import { useAuthContext } from '@/lib/user/AuthContext';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';

interface AdminSponsorCardProps {
  tier: string;
  reference: string;
  link: string;
  name: string;
  onDelete?: () => void;
}

const AdminSponsorCard: React.FC<AdminSponsorCardProps> = ({
  tier,
  reference,
  link,
  name,
  onDelete,
}) => {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await RequestHelper.delete(
        '/api/sponsors',
        {
          headers: {
            Authorization: user.token,
          },
        },
        { name, tier, reference, link },
      );

      const { status } = response;

      if (status === 403) {
        alert('You do not have the permission to perform this functionality');
        return;
      }

      if (status >= 200 && status < 300) {
        alert('Sponsor deleted successfully!');
        setIsModalOpen(false);
        if (onDelete) {
          onDelete();
        }
      } else {
        alert('There was an error with the request');
      }
    } catch (error) {
      alert('Unexpected error! Please try again');
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
        <div className="p-4 flex flex-col h-full">
          <div>
            <div className="text-lg font-semibold text-gray-800 mb-2 capitalize">
              {tier} Sponsor
            </div>
            <div className="text-gray-800 font-medium">{name}</div>
            <div className="w-full h-32 flex justify-center items-center mb-2">
              {reference && (
                <img
                  src={reference}
                  alt={`${name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <a
              href={link.startsWith('http') ? link : `https://${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-blue-500 break-all"
            >
              {link}
            </a>
          </div>
          <div className="mt-auto flex gap-2">
            <Link href={`/admin/sponsors/edit/${encodeURIComponent(name)}`} passHref legacyBehavior>
              <button className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm">
                Edit Sponsor
              </button>
            </Link>
            <button
              className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Delete Sponsor
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Delete Sponsor
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the {name} sponsor?
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AdminSponsorCard;
