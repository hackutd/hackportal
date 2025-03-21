import Image from 'next/image';
import Track1Image from '../../public/assets/track_1.png';
import Track2Image from '../../public/assets/track_2.png';
import Track3Image from '../../public/assets/track_3.png';
import GrandPrize from '../../public/assets/mac.png';
import HomeChallengesCard from './HomeChallengeCard';

import styles from './HomeChallenges.module.css';
import HomeChallengeTrackCard from './HomeChallengeTrackCard';

const CHALLENGE_TRACKS = [
  {
    title: 'Mascot Prize',
    subtitle: 'Mascot Prize',
    description: 'Macbook Air',
    imgSrc: GrandPrize.src,
  },
  {
    title: 'First Place Software',
    subtitle: '1st place software',
    description: 'BenQ Monitor',
    imgSrc: Track1Image.src,
  },
  {
    title: 'Second Place Software',
    subtitle: '2nd place software',
    description: 'Oculus 3S',
    imgSrc: Track2Image.src,
  },
  {
    title: 'Third Place Software',
    subtitle: '3rd place software',
    description: 'Ninja Creami',
    imgSrc: Track3Image.src,
  },
];

export default function HomeChallengesComponent(props: { challenges: Challenge[] }) {
  return (
    props.challenges.length !== 0 && (
      <section className={`${styles.container} m-auto pb-[20rem] relative bg-white`}>
        <div className={styles.content}>
          <div className="flex flex-row items-center w-full ">
            <div className="h-0.5 w-full bg-black ml-28 hidden sm:block"></div>
            <div
              style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
              className="font-fredoka whitespace-nowrap font-bold text-4xl sm:text-5xl md:text-6xl text-center text-[#05149C] m-4 sm:m-6 mx-auto sm:mx-4"
            >
              Challenge Tracks
            </div>
            <div className="h-0.5 w-full bg-black mr-28 hidden sm:block"></div>
          </div>

          <div
            style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
            className="text-center text-lg sm:text-xl text-[#000000] px-4 py-2 sm:p-4 font-dmSans max-w-4xl mx-auto"
          >
            Hackathons are 24-hour gatherings where students collaborate to create innovative
            projects, forge new connections, and compete for prizes
          </div>

          <div className="flex flex-wrap w-full pt-14 px-4 justify-center lg:justify-start lg:px-16 lg:pl-32">
            {props.challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="w-full xs:w-4/5 sm:w-2/3 md:w-4/5 lg:w-1/3 mb-10 px-4 flex justify-center lg:justify-start lg:p-6"
              >
                <HomeChallengesCard challenge={challenge} blockType={idx % 3} />
              </div>
            ))}
          </div>

          <div className="flex pt-14 px-16 flex-wrap lg:flex-nowrap gap-4">
            {CHALLENGE_TRACKS.map((track, idx) => (
              <HomeChallengeTrackCard key={idx} challengeTrack={track} blockType={idx % 3} />
            ))}
          </div>
        </div>
      </section>
    )
  );
}
