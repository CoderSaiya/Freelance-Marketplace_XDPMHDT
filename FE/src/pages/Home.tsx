import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Banner from "../components/Home/Banner";
import Propose from "../components/Home/Propose";
import Footer from "../components/Home/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  yOffset?: number;
}> = ({ children, yOffset = 100 }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "-50px 0px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={{
        opacity: inView ? 1 : 0,
        y: inView ? 0 : yOffset,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
};

const ParallaxSection: React.FC<{
  children: React.ReactNode;
  speed?: number;
}> = ({ children, speed = 0.5 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <motion.button
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-blue-500 
                 flex items-center justify-center text-white shadow-lg"
      style={{ opacity }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </motion.button>
  );
};

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll progress animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />

      {/* Hero section */}
      <ParallaxSection speed={-0.2}>
        <AnimatedSection yOffset={0}>
          <Banner />
        </AnimatedSection>
      </ParallaxSection>

      {/* Main content */}
      <div className="space-y-12">
        <AnimatedSection yOffset={50}>
          <Propose />
        </AnimatedSection>

        <AnimatedSection yOffset={30}>
          <Footer />
        </AnimatedSection>
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Home;