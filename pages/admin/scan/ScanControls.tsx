import { ScanType } from './types';

interface ScanControlsProps {
  currentScan: ScanType;
  user: any;
  setStartScan: (start: boolean) => void;
  setEditScan: (edit: boolean) => void;
  setCurrentEditScan: (scan: ScanType) => void;
  setShowDeleteScanDialog: (show: boolean) => void;
  setCurrentScan: (scan: ScanType | undefined) => void;
  setCurrentScanIdx: (idx: number) => void;
}

export default function ScanControls({
  currentScan,
  user,
  setStartScan,
  setEditScan,
  setCurrentEditScan,
  setShowDeleteScanDialog,
  setCurrentScan,
  setCurrentScanIdx,
}: ScanControlsProps) {
  return (
    <div className="mx-auto flex flex-row gap-x-4">
      <button
        className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-700 rounded-lg md:p-3 p-1 px-2"
        onClick={() => {
          setStartScan(true);
        }}
      >
        Start Scan
      </button>
      {user.permissions.includes('super_admin') && (
        <>
          <button
            className="font-bold bg-gray-200 hover:bg-gray-300 border border-gray-500 rounded-lg md:p-3 p-1 px-2"
            onClick={() => {
              if (!user.permissions.includes('super_admin')) {
                alert('You do not have the required permission to use this functionality');
                return;
              }
              setCurrentEditScan(currentScan);
              setEditScan(true);
            }}
          >
            Edit
          </button>
          <button
            className="font-bold text-red-700 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2"
            onClick={() => {
              if (!user.permissions.includes('super_admin')) {
                alert('You do not have the required permission to use this functionality');
                return;
              }
              if (currentScan.isCheckIn) {
                alert('Check-in scan cannot be deleted');
                return;
              }
              setShowDeleteScanDialog(true);
            }}
          >
            Delete
          </button>
        </>
      )}
      <button
        className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2"
        onClick={() => {
          setCurrentScan(undefined);
          setCurrentScanIdx(-1);
        }}
      >
        Cancel
      </button>
    </div>
  );
}
