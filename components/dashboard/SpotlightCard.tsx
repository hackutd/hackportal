import React, { useState, useEffect } from 'react';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import PinDrop from '@mui/icons-material/PinDrop';
import ClockIcon from '@mui/icons-material/AccessTime';
import Backpack from '@mui/icons-material/LocalMall';
import firebase from 'firebase/compat/app';

/**
 * HackCenter Spotlight Card Component
 *
 * Cards for the Spotlight Carousel under HackCenter page
 */
interface Props {
  startDateTS: firebase.firestore.Timestamp;
  endDateTS: firebase.firestore.Timestamp;
  speakers?: string[];
  title: string;
  location: string;
  page: string;
}

function SpotlightCard({ startDateTS, endDateTS, speakers, title, location, page }: Props) {
  const startDate = startDateTS.toDate();
  const endDate = endDateTS.toDate();

  const speakersData = speakers
    ? speakers.filter((speaker: string) => speaker.length !== 0)
    : undefined;

  var speakerString = '';
  if (speakersData !== undefined && speakersData !== null && speakersData.length !== 0) {
    if (speakersData.length == 2) {
      speakerString = `Hosted by ${speakersData[0]} & ${speakersData[1]}`;
    } else if (speakersData.length == 1) {
      speakerString = `Hosted by ${speakersData[0]}`;
    } else {
      speakerString = 'Hosted by ';
      for (var i = 0; i < speakersData.length; i++) {
        if (i === speakersData.length - 1) {
          speakerString += 'and ' + speakersData[i];
        } else {
          speakerString += speakersData[i] + ', ';
        }
      }
    }
  }

  //first match extracts day abbreviation
  //second match extracts month abbreviation and the number day of the month
  var dayString =
    startDate.toString().match(/^[\w]{3}/)[0] +
    ', ' +
    startDate.toString().match(/^\w+ (\w{3} \d{1,2})/)[1];

  return (
    <>
      <div className="scrollItem flex flex-col justify-between min-w-3/4 h-[90%] bg-secondary rounded-lg p-3 my-4 mx-12">
        <h1 className="lg:text-4xl text-xl font-black">{title}</h1>
        <h3 className="md:text-md text-sm font-black">{speakerString}</h3>
        {/* info section */}
        <div className="flex flex-col justify-around w-full min-h-1/2 rounded-lg bg-secondary p-3">
          {/* top row info */}
          <div className="flex justify-around">
            <div className="flex items-center lg:text-lg sm:text-md text-xs">
              {<CalendarIcon style={{ fontSize: 'medium', margin: '2px' }} />}
              <p>{dayString}</p>
            </div>
            <div className="flex items-center lg:text-lg sm:text-md text-xs">
              {<PinDrop style={{ fontSize: 'medium', margin: '2px' }} />}
              <p>{location}</p>
            </div>
          </div>
          {/* botton row info */}
          <div className="flex justify-around">
            <div className="flex items-center lg:text-lg sm:text-md text-xs">
              {<ClockIcon style={{ fontSize: 'large', margin: '2px' }} />}
              <p>
                {(startDate.getHours() + 24) % 12 || 12}:{startDate.getMinutes() < 10 ? '0' : ''}
                {startDate.getMinutes()} {startDate.getHours() < 12 ? 'AM' : 'PM'} -{' '}
                {(endDate.getHours() + 24) % 12 || 12}:{endDate.getMinutes() < 10 ? '0' : ''}
                {endDate.getMinutes()} {endDate.getHours() < 12 ? 'AM' : 'PM'}
              </p>
            </div>
            <div className="flex items-center lg:text-lg sm:text-md text-xs">
              {<Backpack style={{ fontSize: 'medium', margin: '2px' }} />}
              <p>{page}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpotlightCard;
