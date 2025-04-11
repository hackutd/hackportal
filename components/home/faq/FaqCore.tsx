import React, { useState, useEffect, useContext, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import gsap from 'gsap';

import { SectionReferenceContext } from '@/lib/context/section';
import { RequestHelper } from '@/lib/request-helper';

import FaqDisclosure from './FaqDisclosure';

/**
 * The FAQ page.
 *
 * This page contains frequently asked questions for the hackathon.
 *
 * Route: /about/faq
 */
export default function FaqCore({ fetchedFaqs }: { fetchedFaqs: AnsweredQuestion[] }) {
  const [faqs, setFaqs] = useState<AnsweredQuestion[]>(fetchedFaqs);
  const [disclosuresStatus, setDisclosureStatus] = useState<boolean[]>(
    fetchedFaqs.map(() => false),
  );
  const { faqRef } = useContext(SectionReferenceContext);
  const faqContainerRef = useRef(null); // Ref for the FAQ container

  // GSAP animation on FAQ items when they come into view
  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    if (faqContainerRef.current) {
      const faqBoxes = faqContainerRef.current.querySelectorAll('.faq-box');
      faqBoxes.forEach((box) => {
        gsap.set(box, { opacity: 0, y: 50 }); // Initial hidden state for each FAQ item
        observer.observe(box);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={faqRef} id="faq-section" className="flex flex-col flex-grow relative">
      <style>
        {`
          @keyframes moveUpDown {
            0% { transform: translateY(0); }
            100% { transform: translateY(-8px); }
          }

          @keyframes moveUpDownLeftRight {
            0% { transform: translate(0, 0); }
            25% { transform: translate(4px, -4px); }
            50% { transform: translate(8px, 0); }
            75% { transform: translate(4px, 4px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes moveLeftRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(8px); }
          }
        `}
      </style>
      <Head>
        <title>HackPortal</title>
        <meta name="description" content="HackPortal's Frequently Asked Questions" />
      </Head>
      <div className="top-6">
        <div className="pt-[8rem]">
          <div className="bg-white mx-[8vw] p-10 rounded-lg flex justify-between font-fredoka">
            <div className="pt-3">
              <h1 className="text-3xl mb-4 font-bold text-[#5D5A88]">FAQ</h1>
              <p>Can’t find what you’re looking for? Connect with our team at hello@hackutd.co</p>
            </div>
            <div className="flex items-center">
              <Link
                href="mailto:hello@hackutd.co"
                className="bg-[#EAE6F2] text-[#5D5A88] p-3 rounded-2xl"
              >
                Ask A Question!
              </Link>
            </div>
          </div>
          {/* FAQ for lg-md */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            <div className="w-full my-3 pl-[8vw] space-y-4">
              {faqs.map(
                ({ question, answer }, idx) =>
                  idx % 2 === 0 && (
                    <div key={idx} className="faq-box">
                      <FaqDisclosure
                        question={question}
                        answer={answer}
                        isOpen={disclosuresStatus[idx]}
                        toggleDisclosure={() => {
                          const currDisclosure = [...disclosuresStatus];
                          currDisclosure[idx] = !currDisclosure[idx];
                          setDisclosureStatus(currDisclosure);
                        }}
                      />
                    </div>
                  ),
              )}
            </div>
            <div className="w-full my-3 pr-[8vw] space-y-4">
              {faqs.map(
                ({ question, answer }, idx) =>
                  idx % 2 !== 0 && (
                    <div key={idx} className="faq-box">
                      <FaqDisclosure
                        question={question}
                        answer={answer}
                        isOpen={disclosuresStatus[idx]}
                        toggleDisclosure={() => {
                          const currDisclosure = [...disclosuresStatus];
                          currDisclosure[idx] = !currDisclosure[idx];
                          setDisclosureStatus(currDisclosure);
                        }}
                      />
                    </div>
                  ),
              )}
            </div>
          </div>
          {/* FAQ for mobile */}
          <div className="lg:hidden">
            <div className="mx-[8vw] my-3 space-y-4">
              {faqs.map(({ question, answer }, idx) => (
                <div key={idx} className="faq-box">
                  <FaqDisclosure
                    question={question}
                    answer={answer}
                    isOpen={disclosuresStatus[idx]}
                    toggleDisclosure={() => {
                      const currDisclosure = [...disclosuresStatus];
                      currDisclosure[idx] = !currDisclosure[idx];
                      setDisclosureStatus(currDisclosure);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fetch FAQ questions stored in the backend, which will be used as props by FaqPage component upon build time
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
    {},
  );
  return {
    props: {
      fetchedFaqs: data,
    },
  };
};
