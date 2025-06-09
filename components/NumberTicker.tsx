import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Props {
  value: number;
  delay?: number;
}

export default function NumberTicker({ value, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });
  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
  }, [motionValue, isInView, delay, value]);
  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Number(latest.toFixed(0)));
        }
      }),
    [springValue],
  );
  return <span className="inline-block tabular-nums text-[#05149C] tracking-wider" ref={ref} />;
}
