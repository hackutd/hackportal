import LogoContext from '@/lib/context/logo';
import Image from 'next/image';
import { useState } from 'react';
import PlaceholderMascot from '../../public/assets/Reveal.gif';
import styles from './HomeSponsors.module.css';
import SponsorCard from './SponsorCard';
import TierTitle from './TierTitle';
import { SPONSOR_LIST } from '@/lib/sponsors';

export default function HomeSponsors() {
  const [currentHoveredLogo, setCurrentHoveredLogo] = useState<string>('');

  const sponsorTiers: { [key: string]: Sponsor[] } = SPONSOR_LIST.reduce((acc, curr) => {
    const tier = curr.tier;
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(curr);
    return acc;
  }, {} as { [key: string]: Sponsor[] });

  return (
    SPONSOR_LIST.length != 0 && (
      <section className="relative pt-[10rem] bg-[#F2F3FF] font-fredoka">
        {/* TODO: will update styling better once get more assets and finalized content */}
        <div>
          <div className="text-center text-5xl text-[#5D5A88]">
            <h1 className="uppercase font-bold">see you there!</h1>
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <h4 className="text-[#5D5A88] font-bold md:text-5xl text-2xl my-4 text-center uppercase font-fredoka pt-32 pb-12">
            Sponsorship
          </h4>
          <h2 className="uppercase text-center text-[#5D5A88] text-3xl">
            interested in sponsoring?
          </h2>
          <h2 className="mt-1 text-center text-[#5D5A88]">
            If you would like to sponsor HackPortal,
          </h2>
          <h2 className="text-center text-[#5D5A88]">
            please reach out to us at&nbsp;
            <a
              href="mailto:hello@hackutd.co"
              rel="noopener noreferrer"
              target="_blank"
              className="underline"
            >
              hello@hackutd.co
            </a>
          </h2>
          <section className="flex flex-wrap justify-center p-4">
            <div className="p-4 w-full place-items-center">
              {['title', 'platinum', 'gold', 'silver', 'bronze'].map((tier) => (
                <div
                  key={tier}
                  className="flex flex-col gap-8 my-[3rem] text-center text-3xl text-[#5D5A88] font-bold"
                >
                  <TierTitle tierName={tier} />

                  <div className="flex flex-wrap gap-16 justify-center items-center">
                    <LogoContext.Provider value={{ currentHoveredLogo, setCurrentHoveredLogo }}>
                      {sponsorTiers[tier]?.map(({ link, reference, alternativeReference }, idx) => (
                        <SponsorCard
                          tier={tier}
                          alternativeReference={alternativeReference}
                          reference={reference}
                          key={idx}
                          link={link}
                        />
                      ))}
                    </LogoContext.Provider>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="mt-4">
          <p className="text-4xl text-center text-[#5D5A88] pb-28">and more to come!</p>
        </div>
      </section>
    )
  );
}
