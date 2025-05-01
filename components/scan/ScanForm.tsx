import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import { ScanFormData } from '@/types/scan';

interface ScanFormProps {
  formData: ScanFormData;
  onFormChange: (data: ScanFormData) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function ScanForm({
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  submitLabel,
}: ScanFormProps) {
  const handleInputChange = (field: keyof ScanFormData, value: any) => {
    onFormChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="px-6 py-4">
      <div className="w-3/5 my-5 mx-auto">
        <input
          className="p-3 rounded-lg w-full border-[1px] focus:border-primaryDark"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter name of scantype"
        />
        {!formData.isPermanentScan && (
          <div className="flex flex-row gap-x-2 items-center my-4">
            <DateTimePicker
              label="Enter start date"
              value={formData.startTime}
              onChange={(newValue) => handleInputChange('startTime', newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="Enter end date"
              value={formData.endTime}
              onChange={(newValue) => handleInputChange('endTime', newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        )}
        <div className="flex flex-row gap-x-2 items-center my-4">
          <input
            type="checkbox"
            id="isCheckin"
            name="isCheckin"
            checked={formData.isCheckIn}
            onChange={(e) => handleInputChange('isCheckIn', e.target.checked)}
          />
          <h1>Is this for check-in event?</h1>
        </div>
        <div className="flex flex-row gap-x-2 items-center my-4">
          <input
            type="checkbox"
            id="isPermanent"
            name="isPermanent"
            checked={formData.isPermanentScan}
            onChange={(e) => handleInputChange('isPermanentScan', e.target.checked)}
          />
          <h1>Will this scan be available throughout the event?</h1>
        </div>
      </div>
      <div className="flex justify-around">
        <div className="flex flex-row gap-x-3">
          <button
            className="bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 p-3 rounded-lg font-bold"
            onClick={onSubmit}
          >
            {submitLabel}
          </button>
          <button
            className="font-bold p-3 rounded-lg text-red-800 bg-red-100 hover:bg-red-200 border border-red-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
