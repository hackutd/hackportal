import React, { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';

import { SectionReferenceContext } from '@/lib/context/section';

const HomeAboutText = () => {
  const { aboutRef } = useContext(SectionReferenceContext);
  const titleRef = useRef(null); // Reference for title animation
  const explanationRef = useRef(null); // Reference for explanation animation
  const containerRef = useRef(null); // Reference for entire container to observe

  useEffect(() => {
    // TODO: update this to use the media query
    // const isDesktopView = window.matchMedia('(min-width: 1024px)').matches;
    const isDesktopView = true;

    if (isDesktopView) {
      const handleIntersection = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const titleText = titleRef.current;
            gsap.set(titleText, { opacity: 1 });
            const titleLetters = titleText.innerText.split('');
            titleText.innerHTML = titleLetters.map((letter) => `<span>${letter}</span>`).join('');
            gsap.fromTo(
              titleText.children,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                ease: 'power3.out',
                duration: 1,
              },
            );

            gsap.fromTo(
              explanationRef.current,
              { opacity: 0, y: 100 },
              { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 1.5 },
            );

            observer.unobserve(entry.target);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 1,
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    } else {
      gsap.set([titleRef.current, explanationRef.current], { opacity: 1, y: 0 });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative py-12 flex flex-col items-center justify-center font-jua"
      style={{
        background: '#F2F3FF',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      id="what-is-hackutd"
    >
      <h1
        ref={titleRef}
        className="text-5xl font-bold mb-3 text-center relative font-jua z-10 text-[#05149C] opacity-0"
      >
        About HackPortal?
      </h1>

      <div className="relative w-full flex justify-center items-center z-10">
        <p
          ref={explanationRef}
          className="text-xl text-center text-[#616161] max-w-2xl mb-16 font-fredoka relative z-10 px-6 md:px-0 opacity-0"
        >
          Hackathons are 24-hour gatherings where students collaborate to create innovative
          projects, forge new connections, and compete for prizes.
        </p>
      </div>
    </div>
  );
};

export default HomeAboutText;
