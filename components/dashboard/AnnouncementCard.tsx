import React from 'react';

/**
 * Announcement Cards Component
 *
 * Cards for announcements section in hack center
 */

interface Props {
  text: string;
  time: string;
}

function AnouncementCard({ text, time }: Props) {
  return (
    <>
      <div id="announcement-content" className="md:min-h-1/4 rounded-lg p-3 bg-secondary">
        {text}
      </div>
      <p className="text-right">{time}</p>
    </>
  );
}

export default AnouncementCard;
