import { Dialog } from '@headlessui/react';
import { ScanType } from './types';

interface ScanDialogProps {
  currentScan: ScanType;
  showDeleteScanDialog: boolean;
  setShowDeleteScanDialog: (show: boolean) => void;
  deleteScan: () => Promise<void>;
}

export default function ScanDialog({
  currentScan,
  showDeleteScanDialog,
  setShowDeleteScanDialog,
  deleteScan,
}: ScanDialogProps) {
  return (
    <Dialog
      open={showDeleteScanDialog}
      onClose={() => setShowDeleteScanDialog(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="rounded-2xl relative bg-white flex flex-col justify-between p-4 max-w-sm mx-auto">
          <Dialog.Title>
            Delete <span className="font-bold">{currentScan.name}</span>
          </Dialog.Title>

          <div className="my-7 flex flex-col gap-y-4">
            <Dialog.Description>
              This is permanently delete <span className="font-bold">{currentScan.name}</span>
            </Dialog.Description>
            <p>Are you sure you want to delete this scan? This action cannot be undone.</p>
          </div>

          <div className="flex flex-row justify-end gap-x-2">
            <button
              className="rounded-lg p-3 text-red-800 bg-red-100 hover:bg-red-200 border border-red-400"
              onClick={async () => {
                await deleteScan();
              }}
            >
              Delete
            </button>
            <button
              className="rounded-lg p-3 bg-gray-200 hover:bg-gray-300 border border-gray-500"
              onClick={() => setShowDeleteScanDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
