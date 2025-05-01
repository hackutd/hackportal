import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Dialog } from '@headlessui/react';

import AppHeaderCoreMobile from '@/components/AppHeader/AppHeaderCoreMobile';
import { checkUserPermission } from '@/lib/util';
import { useAuthContext } from '@/lib/user/AuthContext';
import ScanType from '@/components/ScanType';
import Loading from '@/components/icon/Loading';
import ScanForm from '@/components/scan/ScanForm';
import ScannerView from '@/components/scan/ScannerView';
import { ScanService } from '@/services/scanService';
import { ScanType as ScanTypeInterface, ScanFormData } from '@/types/scan';

const allowedRoles = ['super_admin', 'admin', 'organizer'];

const successStrings = {
  claimed: 'Scan claimed...',
  invalidUser: 'Invalid user...',
  alreadyClaimed: 'User has already claimed...',
  unexpectedError: 'Unexpected error...',
  notCheckedIn: "User hasn't checked in!",
  invalidFormat: 'Invalid hacker tag format...',
  lateCheckinIneligible: 'User is not eligible for late check-in...',
};

interface UserProfile extends Omit<Registration, 'user'> {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    permissions: string[];
    preferredEmail: string;
  };
}

function getSuccessColor(success: string) {
  if (success === successStrings.claimed) {
    return '#5fde05';
  }
  return '#ff0000';
}

/**
 * The admin scanning page.
 *
 * Landing: /admin/scan
 */
export default function Admin() {
  const { user, isSignedIn } = useAuthContext();
  const [scanTypes, setScanTypes] = useState<ScanTypeInterface[]>([]);
  const [scansFetched, setScansFetched] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanTypeInterface>();
  const [currentScanIdx, setCurrentScanIdx] = useState(-1);
  const [showNewScanForm, setShowNewScanForm] = useState(false);
  const [startScan, setStartScan] = useState(false);
  const [editScan, setEditScan] = useState(false);
  const [showDeleteScanDialog, setShowDeleteScanDialog] = useState(false);

  const [newScanForm, setNewScanForm] = useState<ScanFormData>({
    name: '',
    isCheckIn: false,
    isPermanentScan: false,
    startTime: new Date(),
    endTime: new Date(),
  });

  const handleScanClick = (data: ScanTypeInterface, idx: number) => {
    setCurrentScan(data);
    setCurrentScanIdx(idx);
  };

  const handleCreateScan = async () => {
    if (!user.permissions.includes('super_admin')) {
      alert('You do not have the required permission to use this functionality');
      return;
    }

    if (
      !newScanForm.isPermanentScan &&
      newScanForm.startTime.getTime() > newScanForm.endTime.getTime()
    ) {
      alert('Invalid date range');
      return;
    }

    try {
      await ScanService.createScan(user.token!, {
        ...newScanForm,
        precedence: scanTypes.length,
      });
      alert('Scan added');
      setScanTypes((prev) => [...prev, { ...newScanForm, precedence: scanTypes.length }]);
      setShowNewScanForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create scan');
    }
  };

  const handleUpdateScan = async () => {
    if (!user.permissions.includes('super_admin') || !currentScan) {
      alert('You do not have the required permission to use this functionality');
      return;
    }

    if (
      !currentScan.isPermanentScan &&
      currentScan.startTime.getTime() > currentScan.endTime.getTime()
    ) {
      alert('Invalid date range');
      return;
    }

    try {
      await ScanService.updateScan(user.token!, currentScan);
      alert('Scan updated');
      const newScanTypes = [...scanTypes];
      newScanTypes[currentScanIdx] = currentScan;
      setScanTypes(newScanTypes);
      setEditScan(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update scan');
    }
  };

  const handleDeleteScan = async () => {
    if (!user.permissions.includes('super_admin') || !currentScan) {
      alert('You do not have the required permission to use this functionality');
      return;
    }

    if (currentScan.isCheckIn) {
      alert('Check-in scan cannot be deleted');
      return;
    }

    try {
      await ScanService.deleteScan(user.token!, currentScan);
      alert('Scan deleted');
      const newScanTypes = [...scanTypes];
      newScanTypes.splice(currentScanIdx, 1);
      setScanTypes(newScanTypes);
      setCurrentScan(undefined);
      setCurrentScanIdx(-1);
      setShowDeleteScanDialog(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete scan');
    }
  };

  useEffect(() => {
    const fetchScans = async () => {
      if (!isSignedIn || scansFetched) return;
      try {
        const data = await ScanService.fetchScanTypes(user.token!);
        setScanTypes(data);
        setScansFetched(true);
      } catch (error) {
        console.error('Failed to fetch scan types:', error);
      }
    };
    fetchScans();
  }, [isSignedIn, scansFetched, user?.token]);

  if (!isSignedIn || !checkUserPermission(user, allowedRoles)) {
    return <div className="text-2xl font-black text-center">Unauthorized</div>;
  }

  return (
    <div className="relative flex flex-col flex-grow">
      <Head>
        <title>HackUTD 2024 - Admin</title>
        <meta name="description" content="HackPortal's Admin Page" />
      </Head>

      <div className="z-10 md:hidden md:mt-10 mt-10">
        <AppHeaderCoreMobile />
      </div>

      {showNewScanForm ? (
        <>
          <button
            className="text-primaryDark font-bold md:text-lg text-base flex items-center px-6"
            onClick={() => setShowNewScanForm(false)}
          >
            <ChevronLeftIcon />
            Return to scanner
          </button>
          <div className="text-2xl font-black text-center">Add New Scan</div>
          <ScanForm
            formData={newScanForm}
            onFormChange={setNewScanForm}
            onSubmit={handleCreateScan}
            onCancel={() => setShowNewScanForm(false)}
            submitLabel="Add Scan"
          />
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center md:h-auto max-h-[26rem] max-w-full overflow-y-auto p-2">
              {scansFetched ? (
                scanTypes.map((scan, idx) => (
                  <ScanType
                    key={scan.name}
                    data={scan}
                    name={scan.name}
                    onClick={() => handleScanClick(scan, idx)}
                  />
                ))
              ) : (
                <div className="w-full flex justify-center">
                  <Loading width={150} height={150} />
                </div>
              )}
            </div>

            {currentScan && (
              <>
                {startScan ? (
                  <ScannerView
                    currentScan={currentScan}
                    userToken={user.token!}
                    onDone={() => {
                      setCurrentScan(undefined);
                      setStartScan(false);
                    }}
                  />
                ) : editScan ? (
                  <div>
                    <div className="text-2xl font-black text-center">Edit Scan</div>
                    <ScanForm
                      formData={currentScan}
                      onFormChange={(data) =>
                        setCurrentScan({ ...data, precedence: currentScan.precedence })
                      }
                      onSubmit={handleUpdateScan}
                      onCancel={() => setEditScan(false)}
                      submitLabel="Update Scan"
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex flex-row gap-x-4 my-6">
                    <button
                      className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-700 rounded-lg md:p-3 p-1 px-2"
                      onClick={() => setStartScan(true)}
                    >
                      Start Scan
                    </button>
                    {user.permissions.includes('super_admin') && (
                      <>
                        <button
                          className="font-bold bg-gray-200 hover:bg-gray-300 border border-gray-500 rounded-lg md:p-3 p-1 px-2"
                          onClick={() => setEditScan(true)}
                        >
                          Edit
                        </button>
                        <button
                          className="font-bold text-red-700 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2"
                          onClick={() => setShowDeleteScanDialog(true)}
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
                )}
              </>
            )}

            {!currentScan &&
              !editScan &&
              !showDeleteScanDialog &&
              !startScan &&
              user.permissions.includes('super_admin') && (
                <div className="mx-auto my-5">
                  <button
                    className="py-3 px-4 font-bold rounded-lg hover:bg-secondary bg-primaryDark text-white hover:text-primaryDark border-[1px] border-transparent hover:border-primaryDark transition duration-300 ease-in-out"
                    onClick={() => setShowNewScanForm(true)}
                  >
                    Add a new Scan
                  </button>
                </div>
              )}
          </div>
        </>
      )}

      <Dialog
        open={showDeleteScanDialog}
        onClose={() => setShowDeleteScanDialog(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="rounded-2xl relative bg-white flex flex-col justify-between p-4 max-w-sm mx-auto">
            <Dialog.Title>
              Delete <span className="font-bold">{currentScan?.name}</span>
            </Dialog.Title>

            <div className="my-7 flex flex-col gap-y-4">
              <Dialog.Description>
                This will permanently delete <span className="font-bold">{currentScan?.name}</span>
              </Dialog.Description>
              <p>Are you sure you want to delete this scan? This action cannot be undone.</p>
            </div>

            <div className="flex flex-row justify-end gap-x-2">
              <button
                className="rounded-lg p-3 text-red-800 bg-red-100 hover:bg-red-200 border border-red-400"
                onClick={handleDeleteScan}
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
    </div>
  );
}
