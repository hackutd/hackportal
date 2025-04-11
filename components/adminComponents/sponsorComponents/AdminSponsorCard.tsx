import React from 'react';

interface AdminSponsorCardProps {
  tier: string;
  reference: string;
  link: string;
}

const AdminSponsorCard: React.FC<AdminSponsorCardProps> = ({ tier, reference, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-4 flex flex-col h-full">
        <div>
          <div className="text-lg font-semibold text-gray-800 mb-2 capitalize">{tier} Sponsor</div>
          <div className="text-center text-gray-600 break-all">{reference}</div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-blue-500 break-all"
          >
            {link}
          </a>
        </div>
        <div className="mt-auto flex gap-2">
          <button className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm">
            Edit Sponsor
          </button>
          <button className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm">
            Delete Sponsor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSponsorCard;
