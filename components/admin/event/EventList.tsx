import { RequestHelper } from '@/lib/request-helper';
import { set } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface Props {
  events: ScheduleEvent[];
  onEventEditClick: (eventIndex: number) => void;
  onEventDeleteClick: (eventIndex: number) => void;
}

export default function EventList({ events, onEventEditClick, onEventDeleteClick }: Props) {
  const [dates, setDates] = useState<Dates[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      try {
        const { data: dateData } = await RequestHelper.get<Dates[]>('/api/dates', {});
        setDates(dateData);
      } catch (error) {
        console.error('Error fetching dates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  const day1Events =
    dates?.length > 0
      ? events
          .map((event, index) => ({ ...event, originalIndex: index }))
          .filter((event) => {
            const eventDate = new Date(event.startDate).toDateString();
            const day1Date = new Date(
              `${dates[0].year}-${dates[0].day1Month + 1}-${dates[0].day1}`,
            ).toDateString();
            return eventDate === day1Date;
          })
          .sort((a: any, b: any) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          })
      : [];

  const day2Events =
    dates?.length > 0
      ? events
          // Add original index to each event
          .map((event, index) => ({ ...event, originalIndex: index }))
          // Filter events based on the specified day2 date
          .filter((event) => {
            const eventDate = new Date(event.startDate).toDateString();
            const day2Date = new Date(
              `${dates[0].year}-${dates[0].day2Month + 1}-${dates[0].day2}`,
            ).toDateString();
            return eventDate === day2Date;
          })
          // Sort events in ascending order based on startDate
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      : [];

  const NotSeen =
    dates?.length > 0
      ? events
          // Add original index to each event
          .map((event, index) => ({ ...event, originalIndex: index }))
          // Filter events based on the specified day2 date
          .filter((event) => {
            const eventDate = new Date(event.startDate).toDateString();
            const day1Date = new Date(
              `${dates[0].year}-${dates[0].day1Month + 1}-${dates[0].day1}`,
            ).toDateString();
            const day2Date = new Date(
              `${dates[0].year}-${dates[0].day2Month + 1}-${dates[0].day2}`,
            ).toDateString();
            return eventDate !== day2Date && eventDate !== day1Date;
          })
          // Sort events in ascending order based on startDate
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      : [];

  return (
    <div className="p-5">
      <div className="flex gap-2 p-5">
        <div className="flex flex-col w-1/2">
          <h1 className="text-center">
            Day 1 :{' '}
            {dates
              ? new Date(
                  `${dates[0].year}-${dates[0].day1Month + 1}-${dates[0].day1}`,
                ).toDateString()
              : ''}
          </h1>
          {day1Events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border-2 my-4 rounded-xl"
            >
              <h1 className="md:text-lg text-base">{event.title}</h1>
              <div className="flex gap-4 items-center">
                <p>
                  {new Date(event.startDate).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                  })}
                </p>
                <button
                  onClick={() => onEventEditClick(event.originalIndex)}
                  className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
                >
                  Edit Event
                </button>
                <button
                  onClick={() => onEventDeleteClick(event.originalIndex)}
                  className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
                >
                  Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-1/2">
          <h1 className="text-center">
            Day 2 :{' '}
            {dates
              ? new Date(
                  `${dates[0].year}-${dates[0].day2Month + 1}-${dates[0].day2}`,
                ).toDateString()
              : ''}
          </h1>

          {day2Events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border-2 my-4 rounded-xl"
            >
              <h1 className="md:text-lg text-base">{event.title}</h1>
              <div className="flex gap-4 items-center">
                <p>
                  {new Date(event.startDate).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                  })}
                </p>
                <button
                  onClick={() => onEventEditClick(event.originalIndex)}
                  className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
                >
                  Edit Event
                </button>
                <button
                  onClick={() => onEventDeleteClick(event.originalIndex)}
                  className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
                >
                  Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {NotSeen?.length > 0 && (
        <div>
          <h1 className="text-red-400 text-center text-4xl border-b-[1px] border-black p-2">
            Events that cant be seen
          </h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {NotSeen.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border-2 my-4 rounded-xl w-[49%]"
              >
                <h1 className="md:text-lg text-base">{event.title}</h1>
                <div className="flex gap-4 items-center">
                  <p>
                    {new Date(event.startDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    })}
                  </p>
                  <button
                    onClick={() => onEventEditClick(event.originalIndex)}
                    className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
                  >
                    Edit Event
                  </button>
                  <button
                    onClick={() => onEventDeleteClick(event.originalIndex)}
                    className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
