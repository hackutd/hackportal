import React, { useState } from 'react';

interface SponsorFormProps {
  sponsor?: Sponsor;
  onSubmitClick: (newSponsor: Sponsor) => Promise<void>;
  formAction: 'Add' | 'Edit';
}

interface Sponsor {
  link: string;
  reference: string;
  alternativeReference?: string;
  tier: string;
}

export default function SponsorForm({ sponsor, onSubmitClick, formAction }: SponsorFormProps) {
  // fill form if sponsor is passed otherwise default to empty sponsor
  const [link, setLink] = useState(sponsor?.link || '');
  const [reference, setReference] = useState(sponsor?.reference || '');
  const [alternativeReference, setAlternativeReference] = useState(
    sponsor?.alternativeReference || '',
  );
  const [tier, setTier] = useState(sponsor?.tier || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSponsor: Sponsor = {
      link,
      reference,
      alternativeReference,
      tier,
    };
    await onSubmitClick(newSponsor);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-4 border rounded-lg space-y-4">
      <h1 className="text-xl font-bold">{formAction} Sponsor</h1>

      <div>
        <label className="block mb-1 font-medium">Sponsor Link (Website)</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Sponsor Image - CHANGE THIS TO TAKE IMGs</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Alternative Image (optional)</label>
        <input
          type="text"
          value={alternativeReference}
          onChange={(e) => setAlternativeReference(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Sponsor Tier</label>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Select Tier --</option>
          <option value="title">Title</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
      </div>

      <button
        type="submit"
        className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg py-2 px-4"
      >
        {formAction} Sponsor
      </button>
    </form>
  );
}
