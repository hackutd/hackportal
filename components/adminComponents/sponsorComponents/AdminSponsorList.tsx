import React from 'react';
import { SPONSOR_LIST } from '@/lib/sponsors';
import AdminSponsorCard from './AdminSponsorCard';

const SponsorList = () => {
  const sponsorTiers: { [key: string]: Sponsor[] } = SPONSOR_LIST.reduce((acc, curr) => {
    const tier = curr.tier;
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(curr);
    return acc;
  }, {} as { [key: string]: Sponsor[] });

  const tierOrder = ['title', 'platinum', 'gold', 'silver', 'bronze'];

  return (
    SPONSOR_LIST.length != 0 && (
      <div className="py-12 ">
        <div className="container mx-auto px-4">
          {tierOrder.map(
            (tier) =>
              sponsorTiers[tier] &&
              sponsorTiers[tier].length > 0 && (
                <div key={tier} className="mb-12">
                  <h2 className="text-3xl font-bold text-[#5D5A88] text-center mb-8 capitalize">
                    {tier} Sponsors
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sponsorTiers[tier].map(({ link, reference, alternativeReference }, idx) => (
                      <AdminSponsorCard
                        key={idx}
                        tier={tier}
                        reference={reference}
                        link={link}
                        alternativeReference={alternativeReference}
                      />
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    )
  );
};

export default SponsorList;
