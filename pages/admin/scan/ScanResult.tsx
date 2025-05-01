import { UserProfile } from './types';
import { getSuccessColor, successStrings } from './constants';
import QRCodeReader from '@/components/dashboard/QRCodeReader';

interface ScanResultProps {
  scanData: string;
  success: string;
  scannedUserInfo: UserProfile;
  setScanData: (data: string | undefined) => void;
  setCurrentScan: (scan: any) => void;
  setStartScan: (start: boolean) => void;
  currentScan: any;
  handleScan: (data: string) => Promise<void>;
}

export default function ScanResult({
  scanData,
  success,
  scannedUserInfo,
  setScanData,
  setCurrentScan,
  setStartScan,
  currentScan,
  handleScan,
}: ScanResultProps) {
  return (
    <>
      {currentScan && !scanData ? (
        <QRCodeReader width={200} height={200} callback={handleScan} />
      ) : (
        <div />
      )}

      {scanData ? (
        <div
          className="text-center text-3xl font-black"
          style={{ color: getSuccessColor(success) }}
        >
          <p>{success ?? 'Unexpected error!'}</p>
          {scannedUserInfo && (
            <>
              <p>
                Name: {scannedUserInfo.user.firstName} {scannedUserInfo.user.lastName}
              </p>
            </>
          )}
        </div>
      ) : (
        <div />
      )}

      {scanData ? (
        <div className="flex m-auto items-center justify-center">
          <div
            className="w-min-5 m-3 rounded-lg text-center text-lg font-black p-3 cursor-pointer hover:bg-green-300 border border-green-800 text-green-900"
            onClick={() => {
              setScanData(undefined);
            }}
          >
            Next Scan
          </div>
          <div
            className="w-min-5 m-3 rounded-lg text-center text-lg font-black p-3 cursor-pointer hover:bg-green-300 border border-green-800 text-green-900"
            onClick={() => {
              setScanData(undefined);
              setCurrentScan(undefined);
              setStartScan(false);
            }}
          >
            Done
          </div>
        </div>
      ) : (
        <div />
      )}
    </>
  );
}
