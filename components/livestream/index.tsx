import clsx from 'clsx';

const Livestream = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <div className={clsx('relative z-[1]', 'w-[90%] max-w-7xl')}>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/60 shadow-lg">
          <iframe
            style={{ width: '100%', height: '100%' }}
            //src="https://www.youtube.com/watch?v=Rc6xBsiI6y8"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; Fullscreen; allow-same-origin"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Livestream;
