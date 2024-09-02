import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { Globe } from "./Globe";

export const HeroSection = () => {
  return (
    <>
        <ambientLight />
        <Globe />
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={10}
            luminanceThreshold={0.25} 
            luminanceSmoothing={0.30}
          />
          <ToneMapping adaptive />
        </EffectComposer>
    </>
  );
};
