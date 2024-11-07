import React from "react";
import LazyComponent from "../components/Home/LazyComponent";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Home: React.FC = () => {
  console.log(useSelector((state:RootState) => state.auth.userId))
  return (
    <>
      <LazyComponent 
        importComponent={() => import('../components/Home/Banner')} 
        name="Banner"
        componentHeight={880}
        preloadDistance={550} // Ensure Banner loads early
      />
      <LazyComponent 
        importComponent={() => import('../components/Home/Propose')} 
        name="Propose"
        componentHeight={350}
        preloadDistance={20} // Adjust to load after Banner
      />
      <LazyComponent 
        importComponent={() => import('../components/Home/Footer')} 
        name="Footer"
        componentHeight={250}
        preloadDistance={1} // Adjust to load after other components
      />
    </>
  );
};

export default Home;
