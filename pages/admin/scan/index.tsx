import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';

import AppHeaderCoreMobile from '@/components/AppHeader/AppHeaderCoreMobile';
import { checkUserPermission } from '@/lib/util';
import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';
import ScanType from '@/components/ScanType';
import Loading from '@/components/icon/Loading';

import { allowedRoles, successStrings } from './constants';
import { UserProfile, ScanType as ScanTypeInterface, NewScanForm } from './types';
import ScanDialog from './ScanDialog';
import ScanForm from './ScanForm';
import ScanResult from './ScanResult';
import ScanControls from './ScanControls';

/**
 * The admin scanning page.
 *
 * Landing: /admin/scan
 */
export default function Admin() {
  const { user, isSignedIn } = useAuthContext();

  // List of scan types fetched from backend
  const [scanTypes, setScanTypes] = useState<ScanTypeInterface[]>([]);

  // Flag whether scan-fetching process is completed
  const [scansFetched, setScansFetched] = useState(false);

  // Current scan
  const [currentScan, setCurrentScan] = useState<ScanTypeInterface | undefined>(undefined);
  const [currentScanIdx, setCurrentScanIdx] = useState(-1);

  // Process data from QR code
  const [scanData, setScanData] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  // CRUD scantypes and use scan
  const [showNewScanForm, setShowNewScanForm] = useState(false);
  const [startScan, setStartScan] = useState(false);

  const [editScan, setEditScan] = useState(false);
  const [currentEditScan, setCurrentEditScan] = useState<ScanTypeInterface | undefined>(undefined);

  const [showDeleteScanDialog, setShowDeleteScanDialog] = useState(false);
  const [scannedUserInfo, setScannedUserInfo] = useState<UserProfile | undefined>(undefined);

  const handleScanClick = (data: ScanTypeInterface, idx: number) => {
    setCurrentScan(data);
    setCurrentScanIdx(idx);
  };

  const handleScan = async (data: string) => {
    if (!data.startsWith('hack:')) {
      setScanData(data);
      setSuccess(successStrings.invalidFormat);
      return;
    }
    const query = new URL(`http://localhost:3000/api/scan`);
    query.searchParams.append('id', data.replaceAll('hack:', ''));
    await fetch(query.toString().replaceAll('http://localhost:3000', ''), {
      mode: 'cors',
      headers: { Authorization: user.token },
      method: 'POST',
      body: JSON.stringify({
        id: data.replaceAll('hack:', ''),
        scan: currentScan.name,
      }),
    })
      .then(async (result) => {
        setScanData(data);
        const userId = data.split(':')[1];
        const userPayload = await RequestHelper.get<UserProfile>(`/api/userinfo?id=${userId}`, {
          headers: {
            Authorization: user.token!,
          },
        });
        setScannedUserInfo(userPayload.data);
        if (result.status === 404) {
          return setSuccess(successStrings.invalidUser);
        } else if (result.status === 201) {
          return setSuccess(successStrings.alreadyClaimed);
        } else if (result.status === 403) {
          return setSuccess(successStrings.notCheckedIn);
        } else if (result.status === 400) {
          return setSuccess(successStrings.lateCheckinIneligible);
        } else if (result.status !== 200) {
          return setSuccess(successStrings.unexpectedError);
        }
        setSuccess(successStrings.claimed);
      })
      .catch((err) => {
        console.log(err);
        setScanData(data);
        setSuccess('Unexpected error...');
      });
  };

  const updateScan = async () => {
    if (!user.permissions.includes('super_admin')) {
      alert('You do not have the required permission to use this functionality');
      return;
    }
    if (
      !currentEditScan.isPermanentScan &&
      currentEditScan.startTime.getTime() > currentEditScan.endTime.getTime()
    ) {
      alert('Invalid date range');
      return;
    }
    const updatedScanData = { ...currentEditScan };
    try {
      const { status, data } = await RequestHelper.post<any, any>(
        '/api/scan/update',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        },
        {
          scanData: updatedScanData,
        },
      );
      if (status >= 400) {
        alert(data.msg);
      } else {
        alert(data.msg);
        const newScanTypes = [...scanTypes];
        newScanTypes[currentScanIdx] = updatedScanData;
        setScanTypes(newScanTypes);
        setCurrentScan(updatedScanData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewScan = async (newScan: NewScanForm) => {
    if (!user.permissions.includes('super_admin')) {
      alert('You do not have the required permission to use this functionality');
      return;
    }
    if (!newScan.isPermanentScan && newScan.startTime.getTime() > newScan.endTime.getTime()) {
      alert('Invalid date range');
      return;
    }
    try {
      const newScanData = {
        ...newScan,
        precedence: scanTypes.length,
      };
      const { status, data } = await RequestHelper.post<any, any>(
        '/api/scan/create',
        {
          headers: {
            Authorization: user.token,
          },
        },
        {
          ...newScan,
          precedence: scanTypes.length,
        },
      );
      if (status >= 400) {
        alert(data.msg);
      } else {
        alert('Scan added');
        setScanTypes((prev) => [...prev, newScanData]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteScan = async () => {
    if (!user.permissions.includes('super_admin')) {
      alert('You do not have the required permission to use this functionality');
      return;
    }
    try {
      const { status, data } = await RequestHelper.post<any, any>(
        '/api/scan/delete',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        },
        {
          scanData: currentScan,
        },
      );
      setShowDeleteScanDialog(false);
      if (status >= 400) {
        alert(data.msg);
      } else {
        alert(data.msg);
        const newScanTypes = [...scanTypes];
        newScanTypes.splice(currentScanIdx, 1);
        setScanTypes(newScanTypes);
        setCurrentScan(undefined);
        setCurrentScanIdx(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchScanTypes = () => {
    if (!isSignedIn || scansFetched) return;
    const query = new URL(`http://localhost:3000/api/scantypes`);
    query.searchParams.append('id', user.id);
    fetch(query.toString().replaceAll('http://localhost:3000', ''), {
      mode: 'cors',
      headers: { Authorization: user.token },
      method: 'GET',
    })
      .then(async (result) => {
        if (result.status !== 200) {
          return console.error('Fetch failed for scan-types...');
        }
        const data = await result.json();
        setScanTypes(data);
        setScansFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchScanTypes();
  });

  if (!isSignedIn || !checkUserPermission(user, allowedRoles))
    return <div className="text-2xl font-black text-center">Unauthorized</div>;

  return (
    <div className="relative flex flex-col flex-grow">
      <Head>
        <title>HackUTD 2024 - Admin</title>
        <meta name="description" content="HackPortal's Admin Page" />
      </Head>
      <div className="z-10 md:hidden md:mt-10 mt-10">
        <AppHeaderCoreMobile />
      </div>
      {currentScan && (
        <ScanDialog
          currentScan={currentScan}
          showDeleteScanDialog={showDeleteScanDialog}
          setShowDeleteScanDialog={setShowDeleteScanDialog}
          deleteScan={deleteScan}
        />
      )}
      {showNewScanForm ? (
        <ScanForm setShowNewScanForm={setShowNewScanForm} createNewScan={createNewScan} />
      ) : (
        <>
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center md:h-auto max-h-[26rem] max-w-full overflow-y-auto p-2">
              {scansFetched ? (
                scanTypes.map((d, idx) => (
                  <ScanType
                    key={d.name}
                    data={d}
                    name={d.name}
                    onClick={() => handleScanClick(d, idx)}
                  />
                ))
              ) : (
                <div className="w-full flex justify-center">
                  <Loading width={150} height={150} />
                </div>
              )}
            </div>

            {currentScan && (
              <div className="my-6">
                <div className="flex flex-col gap-y-4">
                  <div className="text-center text-xl font-black">
                    {currentScan ? currentScan.name : ''}
                  </div>
                  {startScan ? (
                    <ScanResult
                      scanData={scanData}
                      success={success}
                      scannedUserInfo={scannedUserInfo}
                      setScanData={setScanData}
                      setCurrentScan={setCurrentScan}
                      setStartScan={setStartScan}
                      currentScan={currentScan}
                      handleScan={handleScan}
                    />
                  ) : editScan ? (
                    <>
                      <div className="px-6 py-4">
                        <div className="w-3/5 my-5 mx-auto">
                          <input
                            className="p-3 rounded-lg w-full border-[1px] focus:border-primaryDark"
                            type="text"
                            name="name"
                            value={currentEditScan.name}
                            onChange={(e) => {
                              setCurrentEditScan((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }));
                            }}
                            placeholder="Enter name of scantype"
                          />
                          {!currentEditScan.isPermanentScan && (
                            <div className="flex flex-row gap-x-2 items-center my-4">
                              <DateTimePicker
                                label="Enter start date"
                                value={currentEditScan.startTime}
                                onChange={(newValue) =>
                                  setCurrentEditScan((prev) => ({
                                    ...prev,
                                    startTime: newValue,
                                  }))
                                }
                                renderInput={(params) => <TextField {...params} />}
                              />
                              <DateTimePicker
                                label="Enter end date"
                                value={currentEditScan.endTime}
                                onChange={(newValue) =>
                                  setCurrentEditScan((prev) => ({
                                    ...prev,
                                    endTime: newValue,
                                  }))
                                }
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </div>
                          )}
                          <div className="flex flex-row gap-x-2 items-center my-4">
                            <input
                              type="checkbox"
                              id="isCheckin"
                              name="isCheckin"
                              checked={currentEditScan.isCheckIn}
                              onChange={(e) => {
                                setCurrentEditScan((prev) => ({
                                  ...prev,
                                  isCheckIn: e.target.checked,
                                }));
                              }}
                            />
                            <h1>Is this for check-in event?</h1>
                          </div>
                          <div className="flex flex-row gap-x-2 items-center my-4">
                            <input
                              type="checkbox"
                              id="isPermanent"
                              name="isPermanent"
                              checked={currentEditScan.isPermanentScan}
                              onChange={(e) => {
                                setCurrentEditScan((prev) => ({
                                  ...prev,
                                  isPermanentScan: e.target.checked,
                                }));
                              }}
                            />
                            <h1>Will this scan be available throughout the event?</h1>
                          </div>
                        </div>
                        <div className="flex justify-around">
                          <div className="flex flex-row gap-x-3">
                            <button
                              className="bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 p-3 rounded-lg font-bold"
                              onClick={async () => {
                                await updateScan();
                              }}
                            >
                              Update Scan Info
                            </button>
                            <button
                              className="font-bold p-3 rounded-lg text-red-800 bg-red-100 hover:bg-red-200 border border-red-400"
                              onClick={() => {
                                setEditScan(false);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <ScanControls
                      currentScan={currentScan}
                      user={user}
                      setStartScan={setStartScan}
                      setEditScan={setEditScan}
                      setCurrentEditScan={setCurrentEditScan}
                      setShowDeleteScanDialog={setShowDeleteScanDialog}
                      setCurrentScan={setCurrentScan}
                      setCurrentScanIdx={setCurrentScanIdx}
                    />
                  )}
                </div>
              </div>
            )}

            {!currentScan &&
              !editScan &&
              !showDeleteScanDialog &&
              !startScan &&
              user.permissions.includes('super_admin') && (
                <div className="mx-auto my-5">
                  <button
                    className="py-3 px-4 font-bold rounded-lg hover:bg-secondary bg-primaryDark text-white hover:text-primaryDark border-[1px] border-transparent hover:border-primaryDark transition duration-300 ease-in-out"
                    onClick={() => {
                      if (!user.permissions.includes('super_admin')) {
                        alert('You do not have the required permission to use this functionality');
                        return;
                      }
                      setShowNewScanForm(true);
                    }}
                  >
                    Add a new Scan
                  </button>
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
}
