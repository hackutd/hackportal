import { useState } from 'react';
import QRCodeReader from '@/components/dashboard/QRCodeReader';
import {
  ScanType,
  UserProfile,
  successStrings,
  getSuccessColor,
  SuccessMessage,
} from '@/types/scan';

interface ScannerViewProps {
  currentScan: ScanType;
  userToken: string;
  onDone: () => void;
}

export default function ScannerView({ currentScan, userToken, onDone }: ScannerViewProps) {
  const [scanData, setScanData] = useState<string>();
  const [success, setSuccess] = useState<SuccessMessage>();
  const [scannedUserInfo, setScannedUserInfo] = useState<UserProfile>();

  const handleScan = async (data: string) => {
    if (!data.startsWith('hack:')) {
      setScanData(data);
      setSuccess(successStrings.invalidFormat);
      return;
    }

    const query = new URL(`/api/scan`, window.location.origin);
    query.searchParams.append('id', data.replaceAll('hack:', ''));

    try {
      const result = await fetch(query.toString(), {
        mode: 'cors',
        headers: { Authorization: userToken },
        method: 'POST',
        body: JSON.stringify({
          id: data.replaceAll('hack:', ''),
          scan: currentScan.name,
        }),
      });

      setScanData(data);
      const userId = data.split(':')[1];
      const userResponse = await fetch(`/api/userinfo?id=${userId}`, {
        headers: { Authorization: userToken },
      });
      const userPayload = await userResponse.json();
      setScannedUserInfo(userPayload.data);

      if (result.status === 404) {
        setSuccess(successStrings.invalidUser);
      } else if (result.status === 201) {
        setSuccess(successStrings.alreadyClaimed);
      } else if (result.status === 403) {
        setSuccess(successStrings.notCheckedIn);
      } else if (result.status === 400) {
        setSuccess(successStrings.lateCheckinIneligible);
      } else if (result.status !== 200) {
        setSuccess(successStrings.unexpectedError);
      } else {
        setSuccess(successStrings.claimed);
      }
    } catch (err) {
      console.error(err);
      setScanData(data);
      setSuccess(successStrings.unexpectedError);
    }
  };

  return (
    <div className="my-6">
      <div className="flex flex-col gap-y-4">
        <div className="text-center text-xl font-black">{currentScan.name}</div>

        {!scanData && <QRCodeReader width={200} height={200} callback={handleScan} />}

        {scanData && (
          <>
            <div
              className="text-center text-3xl font-black"
              style={{ color: getSuccessColor(success!) }}
            >
              <p>{success ?? 'Unexpected error!'}</p>
              {scannedUserInfo && (
                <p>
                  Name: {scannedUserInfo.user.firstName} {scannedUserInfo.user.lastName}
                </p>
              )}
            </div>

            <div className="flex m-auto items-center justify-center">
              <div
                className="w-min-5 m-3 rounded-lg text-center text-lg font-black p-3 cursor-pointer hover:bg-green-300 border border-green-800 text-green-900"
                onClick={() => setScanData(undefined)}
              >
                Next Scan
              </div>
              <div
                className="w-min-5 m-3 rounded-lg text-center text-lg font-black p-3 cursor-pointer hover:bg-green-300 border border-green-800 text-green-900"
                onClick={onDone}
              >
                Done
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
