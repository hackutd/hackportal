import React, { useState, useEffect } from 'react';
import NumberTicker from '../NumberTicker';
import Image from 'next/image';

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
        <div className="w-full h-[320px] flex flex-row gap-4 order-1 lg:order-2 text-center text-[#05149C] lg:ml-8">
          <div className="flex flex-col w-3/5 gap-4">
            <div className="flex flex-row h-2/5 gap-4">
              <div className="bg-primary w-2/5 rounded-tr-[158px] flex items-center justify-center pr-3 pt-1">
                <p className="text-4xl font-bold">
                  <NumberTicker value={24} /> hours
                </p>
              </div>
              <div className="bg-primary w-3/5 rounded-bl-[158px] flex items-center justify-center pl-9 pb-2">
                <p className="text-5xl font-bold stroke-rose-700">
                  <NumberTicker value={1000} />+ Hackers
                </p>
              </div>
            </div>
            <div className="bg-primary h-3/5 rounded-tr-[158px] rounded-bl-[158px] flex items-center justify-center">
              <p className="text-6xl font-bold">
                <NumberTicker value={200} />+ projects
              </p>
            </div>
          </div>
          <div className="bg-primary w-2/5 rounded-tr-[158px] flex flex-col items-center justify-center">
            <p className="text-7xl font-bold">
              $<NumberTicker value={120000} />
            </p>
            <p className="text-5xl font-bold">in prizes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAboutPhotos;
