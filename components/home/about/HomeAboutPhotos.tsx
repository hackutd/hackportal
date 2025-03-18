import React from 'react';
import NumberTicker from '../../NumberTicker';

const HomeAboutPhotos = () => {
  return (
    <div className="relative flex flex-col items-center justify-center font-jua bg-[#F2F3FF]">
      {/* About Section */}
      <div
        className="relative flex flex-col-reverse lg:flex-row items-center mb-5 font-fredoka z-10 space-y-8 lg:space-y-0 lg:space-x-15 mt-10"
        style={{
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="order-2 lg:order-1 flex justify-center items-center z-20 lg:justify-end"></div>
        <div className="w-[600px] order-1 lg:order-2 text-center text-[#05149C] lg:ml-8">
          <p className="text-5xl font-bold stroke-rose-700">
            <NumberTicker value={1000} />+ Hackers
          </p>

          <p className="text-5xl font-bold">
            <NumberTicker value={24} /> hours
          </p>

          <p className="text-5xl font-bold">
            $<NumberTicker value={120000} /> in prizes
          </p>

          <p className="text-5xl font-bold">
            <NumberTicker value={200} />+ projects
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeAboutPhotos;
