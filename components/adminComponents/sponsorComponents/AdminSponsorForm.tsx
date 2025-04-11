import React, { useState } from 'react';

// Adjust this interface so it matches your actual Sponsor fields
interface Sponsor {
  name: string;
  link: string;
  reference: string;
  tier: string;
}

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
          tier: '',
        },
  );

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

      <input
        type="text"
        placeholder="Sponsor image reference"
        className="border-2 p-3 rounded-lg"
        value={sponsorForm.reference}
        onChange={(e) => setSponsorForm((prev) => ({ ...prev, reference: e.target.value }))}
      />

      <select
        className="border-2 p-3 rounded-lg"
        value={sponsorForm.tier}
        onChange={(e) => setSponsorForm((prev) => ({ ...prev, tier: e.target.value }))}
      >
        <option value="">-- Select Sponsor Tier --</option>
        <option value="title">Title</option>
        <option value="platinum">Platinum</option>
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="bronze">Bronze</option>
      </select>

      <button
        disabled={disableSubmit}
        onClick={async () => {
          setDisableSubmit(true);
          try {
            // Pass the Sponsor object back to the parent via the callback
            await onSubmitClick(sponsorForm);
          } catch (error) {
            console.error('Error submitting sponsor data:', error);
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
