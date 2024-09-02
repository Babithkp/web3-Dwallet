/* eslint-disable react/no-unknown-property */import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import { TextureLoader } from "three";
import gobalImage from "../../assets/planet-earth.jpg";
import globeCloudeImg from "../../assets/planet-earth-cloud.jpg";
import * as THREE from "three";
import { Stars } from "@react-three/drei";

export const Globe = () => {
  const [globeRadius, setGlobeRadius] = useState(0);
  const [position, setPoisition] = useState(0);
  const [stableState,setStableState] = useState(false)
  const glbRef = useRef(null);
  const cldRef = useRef(null);
  const [colorMap, cloudMap] = useLoader(TextureLoader, [
    gobalImage,
    globeCloudeImg,
  ]);



  useFrame(() => {
    glbRef.current.rotation.y += 0.002;
    cldRef.current.rotation.y += 0.0015;

    if (globeRadius < 2) {
      setGlobeRadius(globeRadius + 0.03);
      glbRef.current.rotation.y += 0.18;
      cldRef.current.rotation.y += 0.18;
    }
    if (globeRadius > 2 && stableState === false) {
      setTimeout(()=>{
        setStableState(true)
      },[1000])
    }
    if(stableState === true && position > -3.3){
        setPoisition(position-0.1)
        glbRef.current.rotation.y += 0.2;
      cldRef.current.rotation.y += 0.2;
    }
    
  });

  return (
    <group>
      <Stars radius={500} depth={60} count={200} factor={7} fade={true} />
      <mesh ref={cldRef} position={[position, 0, 0]}>
        <sphereGeometry args={[globeRadius + 0.01, 50, 50, 10]} />
        <meshStandardMaterial
          map={cloudMap}
          opacity={0.4}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={glbRef} rotation={[0.1, 0, 0]} position={[position, 0, 0]}>
        <sphereGeometry args={[globeRadius, 50, 50, 10]} />
        <meshStandardMaterial map={colorMap} metalness={0.2} roughness={0.7} />
      </mesh>
    </group>
  );
};
