import LogoContext from '@/lib/context/logo';
import { useDelayUnmount } from '@/lib/hooks';
import clsx from 'clsx';
import 'firebase/compat/storage';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { Sponsor } from '@/pages/admin/sponsors';

const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
const unmountedStyle = {
  animation: 'outAnimation 270ms ease-out',
  animationFillMode: 'forwards',
};

/**
 * Keynote Speaker card for landing page.
 */
export default function SponsorCard(props: Sponsor) {
  const [hovering, setHovering] = useState(false);

  const { setCurrentHoveredLogo, currentHoveredLogo } = useContext(LogoContext);

  return (
    <div
      className={clsx(
        `my-4 p-3 flex justify-center items-center hover:scale-110 hover:duration-300  duration-500 opacity-100`,
        {
          ['opacity-30']: currentHoveredLogo.length !== 0 && currentHoveredLogo !== props.reference,
          ['w-[250px] h-[150px]']: props.tier !== 'title',
          ['w-[600px] h-[150px]']: props.tier === 'title',
        },
      )}
      onTouchStart={() => {
        if (currentHoveredLogo === props.reference) {
          setCurrentHoveredLogo('');
        } else {
          setCurrentHoveredLogo(props.reference);
        }
      }}
      onMouseOver={() => {
        setCurrentHoveredLogo(props.reference);
        setHovering(true);
      }}
      onMouseOut={() => {
        setCurrentHoveredLogo('');
        setHovering(false);
      }}
    >
      <a
        href={props.link.startsWith('http') ? props.link : `https://${props.link}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          alt={`Sponsor Image ${props.reference}`}
          src={props.reference}
          width={props.tier === 'title' ? 600 : 200}
          height={props.tier === 'title' ? 600 : 200}
          layout="fixed"
          objectFit="contain"
          className={clsx('object-contain', {
            ['w-[250px] h-[150px]']: props.tier !== 'title',
            ['w-[600px] h-[150px]']: props.tier === 'title',
          })}
        />
      </a>
    </div>
  );
}
