import { Canvas } from "@react-three/fiber";
import { HeroSection } from "./components/Hero/HeroSection";
import WallectContainer from "./components/Wallet/WallectContainer";
import { useState } from "react";



function App() {
  const [active,setActive] = useState(false)

  useState(()=>{
    setTimeout(() => {
      setActive(true)
    }, 7000);
  },[])

  return (
    <main className="bg-black h-screen w-screen  flex justify-center items-center">
      <section className="h-screen w-full ">
        <Canvas>
          <HeroSection />
        </Canvas>
      </section>
      {active && <section
        className={
          `absolute text-white bg-transparent left-0 top-0 h-full  w-full grid grid-cols-2 grid-rows-[5rem,1fr] `
        }
      >
        <div className="col-span-2 px-5 flex  items-center">
          <p className="text-4xl ">
            <span className="text-blue-500">D</span>
            WALLECT
          </p>
        </div>
        <WallectContainer/>
      </section>}
    </main>
  );
}

export default App;
