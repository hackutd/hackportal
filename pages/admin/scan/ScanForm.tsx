import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import { NewScanForm, ScanType } from './types';

interface ScanFormProps {
  setShowNewScanForm: (show: boolean) => void;
  createNewScan: (newScan: NewScanForm) => Promise<void>;
}

export default function ScanForm({ setShowNewScanForm, createNewScan }: ScanFormProps) {
  const [newScanForm, setNewScanForm] = useState<NewScanForm>({
    name: '',
    isCheckIn: false,
    isPermanentScan: false,
    startTime: new Date(),
    endTime: new Date(),
  });

  return (
    <div className="px-6 py-4">
      <button
        className="text-primaryDark font-bold md:text-lg text-base flex items-center"
        onClick={() => {
          setShowNewScanForm(false);
        }}
      >
        <ChevronLeftIcon />
        Return to scanner
      </button>
      <div className="text-2xl font-black text-center">Add New Scan</div>
      <div className="w-3/5 my-5 mx-auto">
        <input
          className="p-3 rounded-lg w-full border-[1px] focus:border-primaryDark"
          type="text"
          name="name"
          value={newScanForm.name}
          onChange={(e) => {
            setNewScanForm((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
          placeholder="Enter name of scantype"
        />
        {!newScanForm.isPermanentScan && (
          <div className="flex flex-row gap-x-2 items-center my-4">
            <DateTimePicker
              label="Enter start date"
              value={newScanForm.startTime}
              onChange={(newValue) =>
                setNewScanForm((prev) => ({
                  ...prev,
                  startTime: newValue,
                }))
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="Enter end date"
              value={newScanForm.endTime}
              onChange={(newValue) =>
                setNewScanForm((prev) => ({
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
            checked={newScanForm.isCheckIn}
            onChange={(e) => {
              setNewScanForm((prev) => ({
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
            checked={newScanForm.isPermanentScan}
            onChange={(e) => {
              setNewScanForm((prev) => ({
                ...prev,
                isPermanentScan: e.target.checked,
              }));
            }}
          />
          <h1>Will this scan be available throughout the event?</h1>
        </div>
      </div>
      <div className="flex justify-around">
        <button
          className="mx-auto p-3 rounded-lg font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900"
          onClick={async () => {
            await createNewScan(newScanForm);
          }}
        >
          Add Scan
        </button>
      </div>
    </div>
  );
}
