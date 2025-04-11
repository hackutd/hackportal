import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export const ParticlesContext = createContext<{
  state: { init: boolean };
  actions: { setInit: Dispatch<SetStateAction<boolean>> };
}>({ state: { init: false }, actions: { setInit: () => {} } });

export function useParticles() {
  return useContext(ParticlesContext);
}
