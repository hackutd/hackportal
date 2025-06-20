import Head from 'next/head';
import { useState } from 'react';

import { checkUserPermission } from '@/lib/util';
import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';

import WaitlistCheckInNotificationDialog from '@/components/admin/WaitlistCheckInNotificationDialog';
import QRCodeReader from '@/components/dashboard/QRCodeReader';

const allowedRoles = ['admin', 'organizer', 'super_admin'];

const SCAN_STATUS = {
  successful: 'Check-in successful...',
  invalidUser: 'Invalid user...',
  unexpectedError: 'Unexpected error...',
  invalidFormat: 'Invalid hacker tag format...',
  scanCancelled: 'Scan cancelled...',
};

type ApiResponseType = {
  statusCode: number;
  msg: string;
};

type ApiRequestType = {
  userId: string;
  optInMethod: string;
  contactInfo: string;
};

export default function WaitlistCheckinPage() {
  const [scanStatus, setScanStatus] = useState<ApiResponseType | undefined>(undefined);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const { user, isSignedIn } = useAuthContext();
  const [upperBoundValue, setUpperBoundValue] = useState<number>(0);
  const [currentUserData, setCurrentUserData] = useState<string | undefined>(undefined);

  const handleUpdateLateCheckInUpperBound = async (value: number) => {
    try {
      const { data } = await RequestHelper.post<{ value: number }, ApiResponseType>(
        '/api/waitlist/upperbound',
        {
          headers: {
            Authorization: user.token,
            'Content-Type': 'application/json',
          },
        },
        {
          value,
        },
      );
      if (data.statusCode !== 200) {
        alert('Unexpected error...');
        console.error(data.msg);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert('Unexpected error...');
      console.error(error);
    }
  };

  const updateWaitListHandler = async (
    hackerData: string,
    optInMethod: string,
    contactInfo: string,
  ) => {
    try {
      const { data: resData } = await RequestHelper.post<ApiRequestType, ApiResponseType>(
        '/api/waitlist',
        {
          headers: {
            Authorization: user.token,
            'Content-Type': 'application/json',
          },
        },
        {
          userId: hackerData.replaceAll('hack:', ''),
          optInMethod,
          contactInfo,
        },
      );
      setScanStatus(resData);
      setShowNotifyDialog(false);
    } catch (error) {
      setScanStatus({
        statusCode: 500,
        msg: SCAN_STATUS.unexpectedError,
      });
      console.error(error);
    }
  };

  const handleScan = (data: string) => {
    if (!data.startsWith('hack:')) {
      setScanStatus({
        statusCode: 400,
        msg: SCAN_STATUS.invalidFormat,
      });
    } else {
      setShowNotifyDialog(true);
      setCurrentUserData(data);
    }
  };

  if (!isSignedIn || !checkUserPermission(user, allowedRoles))
    return <div className="text-2xl font-black text-center">Unauthorized</div>;

  return (
    <div className="flex flex-col flex-grow">
      <WaitlistCheckInNotificationDialog
        isOpen={showNotifyDialog}
        closeModal={() => {
          setShowNotifyDialog(false);
          setCurrentUserData(undefined);
          setScanStatus({
            statusCode: 200,
            msg: SCAN_STATUS.scanCancelled,
          });
        }}
        onFormSubmit={async (optInType, contactInfo) => {
          try {
            await updateWaitListHandler(currentUserData, optInType, contactInfo);
          } catch (error) {
            setScanStatus({
              statusCode: 500,
              msg: SCAN_STATUS.unexpectedError,
            });
            console.error(error);
          } finally {
            setCurrentUserData(undefined);
          }
        }}
      />
      <Head>
        <title>HackPortal - Admin</title>
        <meta name="description" content="HackPortal's Admin Page" />
      </Head>
      <div className="mt-4 flex flex-col justify-center">
        <div className="my-6 mx-auto">
          <div className="md:flex gap-x-4 mb-10 items-center">
            <h1 className="text-lg">Set late check-in eligible upper bound: </h1>
            <input
              type="number"
              name="lateCheckInUpperBound"
              onChange={(e) => setUpperBoundValue(parseInt(e.target.value))}
            />
            <button
              className="rounded-full bg-[rgba(66,184,187,1)] text-white border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-white hover:text-[rgba(66,184,187,1)] hover:bg-white transition"
              // Score of 4 means strong YES
              onClick={async () => {
                await handleUpdateLateCheckInUpperBound(upperBoundValue);
              }}
            >
              UPDATE
            </button>
          </div>
          <div className="flex flex-col gap-y-4">
            {scanStatus === undefined ? (
              <QRCodeReader width={200} height={200} callback={handleScan} />
            ) : (
              <>
                <div
                  className={`text-center text-3xl ${
                    scanStatus.statusCode < 400 ? 'font-black' : 'text-red-600'
                  }`}
                >
                  {scanStatus.msg}
                </div>
                <div className="flex gap-x-5 mx-auto">
                  <div
                    onClick={() => setScanStatus(undefined)}
                    className="w-min-5 m-3 rounded-lg text-center text-lg font-black p-3 cursor-pointer hover:bg-green-300 border border-green-800 text-green-900"
                  >
                    Next Scan
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
