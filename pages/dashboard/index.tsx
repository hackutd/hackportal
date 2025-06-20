import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import 'firebase/compat/firestore';
import { GetServerSideProps } from 'next';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { useAuthContext } from '@/lib/user/AuthContext';
import { useUser } from '@/lib/profile/user-data';
import { RequestHelper } from '@/lib/request-helper';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SpotlightCard from '@/components/dashboard/SpotlightCard';
import ChallengeCard from '@/components/dashboard/ChallengeCard';
import AnnouncementCard from '@/components/dashboard/AnnouncementCard';

/**
 * The dashboard / hack center.
 *
 *
 * Landing: /dashboard
 *
 */

export default function Dashboard(props: {
  announcements: Announcement[];
  scheduleEvents: ScheduleEvent[];
  challenges: Challenge[];
}) {
  const { isSignedIn, hasProfile } = useAuthContext();
  const user = useUser();
  const role = user.permissions?.length > 0 ? user.permissions[0] : '';
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dateTime, setdateTime] = useState(new Date());
  const [eventCount, setEventCount] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    setAnnouncements(props.announcements);
    // ordering challenges as speficied in firebase
    setChallenges(props.challenges.sort((a, b) => (a.rank > b.rank ? 1 : -1)));
    if (firebase.messaging.isSupported()) {
      firebase.messaging().onMessage((payload) => {
        setAnnouncements((prev) => [
          JSON.parse(payload.data.notification) as Announcement,
          ...prev,
        ]);
      });
    }

    setdateTime(new Date());
    setEventCount(
      props.scheduleEvents.reduce(
        (total, event, idx) =>
          validTimeDate(event.startTimestamp, event.endTimestamp) ? total + 1 : total,
        0,
      ),
    );
  }, []);

  // Check if spotlight time/date interval encompasses current time/date
  const validTimeDate = (startDate, endDate) => {
    const currDate = firebase.firestore.Timestamp.now();
    if (currDate.seconds > startDate._seconds && currDate.seconds < endDate._seconds) {
      return true;
    } else {
      return false;
    }
  };

  var eventCountString;
  if (eventCount === 1) {
    eventCountString = 'There is 1 event is happening right now!';
  } else {
    eventCountString = `There are ${eventCount} events are happening right now!`;
  }

  if (!isSignedIn)
    return (
      <div className="text-2xl font-black text-center">Please sign-in to view your dashboard</div>
    );

  return (
    <>
      <div className="flex flex-wrap flex-grow">
        <Head>
          <title>HackUTD 2024 - Dashboard</title> {/* !change */}
          <meta name="description" content="HackPortal's Dashboard" />
        </Head>

        <section id="mainContent" className="2xl:px-32 md:px-16 px-6 bg-white">
          <DashboardHeader />
          {/* Spotlight & Announcements */}
          <div className="flex flex-wrap md:my-16 my-10">
            {/* Spotlight Events */}
            {/* Hides spotlight if no events are going on */}
            {eventCount > 0 && (
              <div className="lg:w-3/5 w-full h-96">
                <h1 className="md:text-3xl text-xl font-black">Spotlight</h1>
                <div>{eventCountString}</div>
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  loop={false}
                  pagination={{ clickable: true }}
                >
                  {props.scheduleEvents.map(
                    ({ title, speakers, startTimestamp, endTimestamp, location, page }, idx) =>
                      validTimeDate(startTimestamp, endTimestamp) && (
                        <SwiperSlide key={idx}>
                          <div className="h-[19rem] w-full">
                            {/* Customize Spotlight card design for carousel in  SpotlightCard component file*/}
                            <SpotlightCard
                              title={title}
                              speakers={speakers}
                              startDateTS={startTimestamp}
                              endDateTS={endTimestamp}
                              location={location}
                              page={page}
                            />
                          </div>
                        </SwiperSlide>
                      ),
                  )}
                </Swiper>
                <div />
              </div>
            )}
            {/* Announcements */}
            <div className={`${eventCount > 0 ? 'lg:w-2/5' : 'lg:w-full'} w-full h-96`}>
              <h1 className="md:text-3xl text-xl font-black">Announcements</h1>
              <div id="announcement-items" className="overflow-y-scroll h-9/10">
                {announcements.map((announcement, idx) => {
                  const dateObj = new Date(announcement.timestamp!);
                  const hour = dateObj.getHours(),
                    minutes = dateObj.getMinutes();

                  const time = `${hour < 10 ? '0' : ''}${hour}:${
                    minutes < 10 ? '0' : ''
                  }${minutes}`;

                  return (
                    <AnnouncementCard key={idx} text={announcement.announcement} time={time} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Challenges */}
          <div className="flex flex-col items-center my-8">
            <h1 className="md:text-3xl text-xl font-black">Challenges</h1>
            {/* Cards */}
            <div className="challengeGrid my-8">
              {challenges.map(({ title, description, prizes }, idx) => (
                <ChallengeCard key={idx} title={title} description={description} prizes={prizes} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data: announcementData } = await RequestHelper.get<Announcement[]>(
    `${protocol}://${context.req.headers.host}/api/announcements/`,
    {},
  );
  const { data: eventData } = await RequestHelper.get<ScheduleEvent[]>(
    `${protocol}://${context.req.headers.host}/api/schedule/`,
    {},
  );
  const { data: challengeData } = await RequestHelper.get<Challenge[]>(
    `${protocol}://${context.req.headers.host}/api/challenges/`,
    {},
  );

  return {
    props: {
      announcements: announcementData,
      scheduleEvents: eventData,
      challenges: challengeData,
    },
  };
};
