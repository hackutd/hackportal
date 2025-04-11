import { motion } from 'framer-motion';
import React, { useState } from 'react';

const PRIZE_INDEX = ['1st', '2nd', '3rd'];

interface Props {
  challenge: Challenge;
  blockType: number;
}

export default function HomeChallengesCard({ challenge, blockType }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
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
      className="h-full w-full mx-auto bg-[#C1C8FF] rounded-lg mb-8 mt-8 relative"
    >
      <div className="w-4/5 md:w-full mx-auto">
        <div className="w-5/6 mx-auto">
          {/* Challenge Name */}
          <div className="flex justify-center">
            <h1 className="font-montserrat font-semibold text-xl mt-4 text-center border-b-2 border-[rgb(0,0,0,0.4)] w-fit">
              <span className="uppercase">presented by {challenge.organization}</span>
            </h1>
          </div>
          {/* Company Name */}
          <h1 className="font-dmSans text-2xl text-[#0514C9] my-4 uppercase text-center">
            {challenge.title}
          </h1>
          {/* Description */}
          <div className="mb-8 max-w-fit">
            {challenge.prizes.map((prize, idx) => (
              <p key={idx} className="text-md text-balance">
                {PRIZE_INDEX[idx]}: {challenge.prizes[idx]}
              </p>
            ))}
          </div>
          <div>{challenge.description}</div>
        </div>
      </div>
    </motion.div>
  );
}
