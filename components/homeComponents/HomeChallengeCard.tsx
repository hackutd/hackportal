'use client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import HomeChallengeDescription from './HomeChallengeDescription';
import styles from './HomeChallenges.module.css';

const PRIZE_INDEX = ['1st', '2nd', '3rd'];

export default function HomeChallengesCard(props: { challenge: Challenge; blockType: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { blockType } = props;
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  const getShape = (type) => {
    switch (type) {
      case 0:
        return <div className={styles['challenge-block']}></div>;
      case 1:
        return (
          <div className={`${styles['challenge-block']} ${styles['challenge-block-1']}`}></div>
        );
      case 2:
        return (
          <div className={`${styles['challenge-block']} ${styles['challenge-block-2']}`}></div>
        );
      default:
        return null;
    }
  };
  {
    /*This displays all the content as a laptop/desktop version*/
  }
  return (
    <div className="w-full px-4 mb-12 justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        style={{
          transform: isHovering
            ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
            : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
          transition: 'transform 0.1s ease-out',
        }}
        className="flex flex-col w-full"
      >
        <div className="w-full">{getShape(blockType)}</div>

        <div className="w-full pt-6 px-2">
          <h1 className="font-dmSans font-bold text-2xl text-black uppercase">
            {props.challenge.title || 'CHALLENGE'}
          </h1>
          <h2 className="font-bold text-2xl text-blue-700 uppercase mb-4">
            {props.challenge.organization || 'INSERT COMPANY'}
          </h2>
          <div className="text-base">
            {props.challenge.description ||
              'Hackathons are 24-hour gatherings where students collaborate to create innovative projects, forge new connections, and compete for prizes.'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
