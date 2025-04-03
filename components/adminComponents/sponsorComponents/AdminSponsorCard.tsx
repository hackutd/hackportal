import React from 'react';
import Image from 'next/image';

interface AdminSponsorCardProps {
  tier: string;
  reference: string;
  link: string;
  alternativeReference?: string; // Probably not used
}

const AdminSponsorCard: React.FC<AdminSponsorCardProps> = ({
  tier,
  reference,
  link,
  alternativeReference,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-4 flex flex-col h-full">
        <div>
          <div className="text-lg font-semibold text-gray-800 mb-2 capitalize">{tier} Sponsor</div>
          <Image
            alt={`Sponsor Image ${reference}`}
            src={reference}
            width={tier === 'title' ? 600 : 200}
            height={tier === 'title' ? 600 : 200}
            className="rounded-md"
          />
          <a href={link} className="mt-2 text-sm text-blue-500 break-all">
            {link}
          </a>
        </div>
        <div className="mt-auto flex gap-2">
          <button
            // onClick={() => onSponsorEditClick(sponsor.originalIndex)}
            className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
            // formAction="Edit"
          >
            Edit Sponsor
          </button>
          <button
            // onClick={() => onSponsorDeleteClick(sponsor.originalIndex)}
            className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
          >
            Delete Sponsor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSponsorCard;
