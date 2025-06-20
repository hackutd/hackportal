import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onFormSubmit: (subscriptionType: string, payload: string) => Promise<unknown>;
}

export default function WaitlistCheckInNotificationDialog({
  isOpen,
  closeModal,
  onFormSubmit,
}: Props) {
  const [optInType, setOptInType] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
                  Notification Method
                </Dialog.Title>
                <div className="flex flex-col gap-y-3 mt-2">
                  <p className="text-sm text-gray-500">
                    Please specify how you want to be notified when you are eligible to check-in.
                  </p>
                  <select
                    value={optInType}
                    onChange={(e) => setOptInType(e.target.value)}
                    defaultValue=""
                    className="rounded-lg"
                  >
                    <option disabled value="">
                      Choose a opt-in method
                    </option>
                    <option value="email">Via Email</option>
                    <option value="sms">Via SMS</option>
                  </select>
                  {optInType !== '' && (
                    <input
                      className="rounded-lg"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder={optInType === 'email' ? 'Email' : 'Phone Number'}
                    />
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={async (e) => {
                      e.preventDefault();
                      await onFormSubmit(optInType, contactInfo);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
