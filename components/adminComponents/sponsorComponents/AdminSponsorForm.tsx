import React, { useState, useRef } from 'react';
import { Sponsor } from '@/pages/admin/sponsors';

interface SponsorFormProps {
  sponsor?: Sponsor;
  onSubmitClick: (sponsorData: Sponsor) => Promise<void>;
  formAction: 'Add' | 'Edit';
}

export default function SponsorForm({ sponsor, onSubmitClick, formAction }: SponsorFormProps) {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [sponsorForm, setSponsorForm] = useState<Sponsor>(
    formAction === 'Edit' && sponsor
      ? sponsor
      : {
          name: '',
          link: '',
          reference: '',
          tier: 'bronze',
        },
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    setImageError(null);
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setImageError('Logo file cannot be larger than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setSponsorForm({ ...sponsorForm, reference: event.target.result as string });
        setImageError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="my-3 flex flex-col gap-y-4">
      <input
        type="text"
        placeholder="Sponsor name"
        className="border-2 p-3 rounded-lg"
        value={sponsorForm.name}
        onChange={(e) => setSponsorForm((prev) => ({ ...prev, name: e.target.value }))}
      />

      <input
        type="text"
        placeholder="Sponsor link (website)"
        className="border-2 p-3 rounded-lg"
        value={sponsorForm.link}
        onChange={(e) => setSponsorForm((prev) => ({ ...prev, link: e.target.value }))}
      />

      <div className="flex flex-col gap-2">
        <label className="font-medium">Sponsor Logo</label>
        <div
          onClick={handleImageClick}
          className="border-2 p-3 rounded-lg cursor-pointer flex flex-col items-center justify-center h-48 bg-gray-50 hover:bg-gray-100"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {sponsorForm.reference ? (
            <div className="w-full h-full flex justify-center">
              <img
                src={sponsorForm.reference}
                alt="Sponsor logo"
                className="max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
              <p className="mt-1 text-xs text-gray-400">Maximum file size: 1MB</p>
            </div>
          )}
        </div>
        {imageError && <div className="text-red-500 text-sm mt-1">{imageError}</div>}
      </div>

      <select
        className="border-2 p-3 rounded-lg"
        value={sponsorForm.tier}
        onChange={(e) =>
          setSponsorForm((prev) => ({ ...prev, tier: e.target.value as Sponsor['tier'] }))
        }
      >
        <option value="">-- Select Sponsor Tier --</option>
        <option value="title">Title</option>
        <option value="platinum">Platinum</option>
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="bronze">Bronze</option>
      </select>

      <button
        disabled={disableSubmit || !!imageError}
        onClick={async () => {
          setDisableSubmit(true);
          try {
            await onSubmitClick(sponsorForm);
          } catch (error) {
            console.error('Error submitting sponsor data:', error);
            if (error.message && error.message.includes('Body exceeded')) {
              setImageError('Logo file is too large. Please use a file smaller than 1MB.');
            }
          } finally {
            setDisableSubmit(false);
          }
        }}
        className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg p-3"
      >
        {formAction === 'Edit' ? 'Save Changes' : 'Add Sponsor'}
      </button>
    </div>
  );
}
