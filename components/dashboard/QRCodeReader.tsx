import { useRef, useState, useEffect } from 'react';
import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';
import Loading from '../icon/Loading';

export interface Props {
  callback?: (
    data: string,
    video: HTMLVideoElement,
    setVideoReady: (state: boolean) => void,
    setPaused: (state: boolean) => void,
    tick: () => void,
  ) => void;
  /**
   * Width & height in pixels.
   */
  width: number;
  height: number;
}

export const drawLine = (begin: Point, end: Point, context: CanvasRenderingContext2D) => {
  context.beginPath();
  context.moveTo(begin.x, begin.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 4;
  context.stroke();
};

export default function QRCodeReader({ callback, width, height }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const tick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      setVideoReady(true);
      const canvasElement = canvas.current;
      if (!canvasElement) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      canvasElement.width = videoRef.current.videoWidth;
      canvasElement.height = videoRef.current.videoHeight;
      const context = canvasElement.getContext('2d');
      if (!context) return;

      context.drawImage(videoRef.current, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (qrCode) {
        drawLine(qrCode.location.topLeftCorner, qrCode.location.topRightCorner, context);
        drawLine(qrCode.location.topRightCorner, qrCode.location.bottomRightCorner, context);
        drawLine(qrCode.location.bottomRightCorner, qrCode.location.bottomLeftCorner, context);
        drawLine(qrCode.location.bottomLeftCorner, qrCode.location.topLeftCorner, context);
        if (videoRef.current) videoRef.current.pause();
        setPaused(true);
        setVideoReady(false);
        if (callback && videoRef.current) {
          callback(qrCode.data, videoRef.current, setVideoReady, setPaused, tick);
        }
        return;
      }
    }

    animationRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    // Initialize video element only once
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.playsInline = true;
    }

    // Start/stop video based on paused state
    const startVideo = async () => {
      if (paused || streamRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width, height },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          animationRef.current = requestAnimationFrame(tick);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startVideo();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [paused, width, height]);

  return (
    <div className="flex items-center justify-center">
      {videoReady && !paused ? <canvas ref={canvas} /> : <Loading width={width} height={height} />}
    </div>
  );
}
