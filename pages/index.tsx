import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import HackCountdown from '../components/homeComponents/HackCountdown';
import HomeAboutPhotos from '../components/homeComponents/HomeAboutPhotos';
import HomeAboutText from '../components/homeComponents/HomeAboutText';
import HomeFaq from '../components/homeComponents/HomeFaq';
import HomeFooter from '../components/homeComponents/HomeFooter';
import HomeHero2 from '../components/homeComponents/HomeHero2';
import HomeSchedule from '../components/homeComponents/HomeSchedule';
import HomeSponsors from '../components/homeComponents/HomeSponsors';
import HomeVideoStats from '../components/homeComponents/HomeVideoStats';
import Wave from '../components/homeComponents/Wave';
import { RequestHelper } from '../lib/request-helper';
import cloud from '../public/assets/cloud.png';
import countdownClouds from '../public/assets/countdown_clouds.png';
import hackutdBg from '../public/assets/hackutd-bg.png';
import topBg from '../public/assets/topBg.png';
import HomeChallengesComponent from '@/components/homeComponents/HomeChallenges';
import HomeSpeakers from '@/components/homeComponents/HomeSpeakers';
export default function Home(props: {
  answeredQuestion: AnsweredQuestion[];
  sponsorCard: Sponsor[];
  scheduleCard: ScheduleEvent[];
  dateCard: Dates;
  challenges: Challenge[];
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>HackPortal</title>
        <meta name="description" content="A default HackPortal instance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-x-hidden w-full">
        {/* <HomeNotif /> */}
        <HomeHero2 />
        <HackCountdown />
        <HomeAboutText />
        <HomeAboutPhotos />
        <HomeSchedule scheduleCard={props.scheduleCard} dateCard={props.dateCard} />
        <HomeChallengesComponent challenges={props.challenges} />
        {/* include HomePrizes in HomeChallenges */}
        {/* <HomePrizes prizes={props.prizeData} /> */}
        <HomeVideoStats />
        <HomeFaq answeredQuestion={props.answeredQuestion} />
        <HomeSponsors />
        <HomeFooter />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data: keynoteData } = await RequestHelper.get<KeynoteSpeaker[]>(
    `${protocol}://${context.req.headers.host}/api/keynotespeakers`,
    {},
  );
  const { data: challengeData } = await RequestHelper.get<Challenge[]>(
    `${protocol}://${context.req.headers.host}/api/challenges/`,
    {},
  );
  const { data: answeredQuestion } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
    {},
  );
  const { data: scheduleData } = await RequestHelper.get<ScheduleEvent[]>(
    `${protocol}://${context.req.headers.host}/api/schedule`,
    {},
  );
  const { data: dateData } = await RequestHelper.get<ScheduleEvent[]>(
    `${protocol}://${context.req.headers.host}/api/dates`,
    {},
  );
  return {
    props: {
      keynoteSpeakers: keynoteData,
      challenges: challengeData,
      answeredQuestion: answeredQuestion,
      scheduleCard: scheduleData,
      dateCard: dateData,
    },
  };
};
