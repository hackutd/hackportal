import { CSSProperties, FC, useEffect } from 'react';
import { ISourceOptions, tsParticles, type Container } from '@tsparticles/engine';
import { loadRotateUpdater } from '@tsparticles/updater-rotate';

interface Props {
  id?: string;
  options?: ISourceOptions;
  url?: string;
  style?: CSSProperties;
  className?: string;
  particlesLoaded?: (container?: Container) => Promise<void>;
}

const Particles: FC<Props> = (props) => {
  const id = props.id ?? 'tsparticles';

  useEffect(() => {
    let container: Container | undefined;

    loadRotateUpdater(tsParticles)
      .then(async () => {
        await tsParticles.load({ id, url: props.url, options: props.options }).then((c) => {
          container = c;
          props.particlesLoaded?.(c);
        });
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      container?.destroy();
    };
  }, [id, props, props.url, props.options]);

  return <div id={id} className={props.className}></div>;
};

export default Particles;
