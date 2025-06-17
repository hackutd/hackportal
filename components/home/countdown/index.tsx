import React, { useState, useEffect, CSSProperties } from 'react';
// TODO: convert styles to tailwind
import styles from './HackCountdown.module.css';
import { config } from '../../../hackportal.config';

interface Props {
  targetDate: string;
}

const HackCountdown: React.FC<Props> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div
      className={styles.countdownContainer}
      style={{ padding: '10vh', backgroundColor: '#F2F3FF' }}
    >
      <div className={styles.timeSection}>
        {Object.entries(timeLeft).map(([unit, value]) => {
          const digits = value.toString().padStart(2, '0').split('');
          return (
            <div key={unit} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex' }}>
                {digits.map((digit, index) => (
                  <div key={`${unit}-${index}`} className={styles.digitBox}>
                    <span className={styles.digit}>{digit}</span>
                  </div>
                ))}
              </div>
              <div className={styles.label}>{unit.toUpperCase()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HackUTDCountdown: React.FC = () => {
  return <HackCountdown targetDate={config.targetDate} />;
};

export default HackUTDCountdown;
