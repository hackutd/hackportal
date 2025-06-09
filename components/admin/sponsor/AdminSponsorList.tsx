import React, { useState } from 'react';
import AdminSponsorCard from './AdminSponsorCard';
import type { Sponsor } from '@/pages/admin/sponsors';

interface Props {
  sponsors: Sponsor[];
}
const tierOrder = ['title', 'platinum', 'gold', 'silver', 'bronze'];

const AdminSponsorList: React.FC<Props> = ({ sponsors: initialSponsors }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);

  const sponsorTiers = sponsors.reduce<Record<string, Sponsor[]>>((acc, s) => {
    acc[s.tier] = acc[s.tier] ? [...acc[s.tier], s] : [s];
    return acc;
  }, {});

  const handleDeleteSponsor = (deletedSponsor: Sponsor) => {
    setSponsors(sponsors.filter((s) => s.name !== deletedSponsor.name));
  };

  if (sponsors.length === 0) return null;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {tierOrder.map(
          (tier) =>
            sponsorTiers[tier] && (
              <div key={tier} className="mb-12">
                <h2 className="text-3xl font-bold text-[#5D5A88] text-center mb-8 capitalize">
                  {tier} Sponsors
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sponsorTiers[tier]!.map((s, idx) => (
                    <AdminSponsorCard
                      key={idx}
                      tier={tier}
                      reference={s.reference}
                      link={s.link}
                      name={s.name}
                      onDelete={() => handleDeleteSponsor(s)}
                    />
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default AdminSponsorList;
