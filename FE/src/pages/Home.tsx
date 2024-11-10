import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Banner from "../components/Home/Banner";
import Propose from "../components/Home/Propose";
import styled from "@emotion/styled";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
}

const ScrollContainer = styled.div`
  position: relative;
  padding: 2.5rem 0;
  background: rgb(249 250 251);
  overflow: hidden;
`;

const ScrollTrack = styled.div`
  display: flex;
  width: fit-content;
  gap: 2rem;
  padding: 1rem 0;
`;

const ScrollContent = styled(motion.div)`
  display: flex;
  gap: 2rem;
  flex-shrink: 0;
`;

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "UTH",
    logo: "https://tuyensinh.ut.edu.vn/wp-content/uploads/2022/07/logo-full.png",
  },
  {
    id: 2,
    name: "GCP",
    logo: "https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png",
  },
  {
    id: 3,
    name: "npm",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg",
  },
  {
    id: 4,
    name: "React",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
  },
  {
    id: 5,
    name: "Microsolf",
    logo: "https://blogs.microsoft.com/wp-content/uploads/prod/2012/08/8867.Microsoft_5F00_Logo_2D00_for_2D00_screen.jpg",
  },
  {
    id: 6,
    name: ".NET Core",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/.NET_Core_Logo.svg/2048px-.NET_Core_Logo.svg.png",
  },
  {
    id: 7,
    name: "Vite",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/2078px-Vitejs-logo.svg.png",
  },
  { id: 8, name: "Huy Gà", logo: "img/huyga.png" },
];

const InfiniteScroll: React.FC = () => {
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];
  return (
    <ScrollContainer className="select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Thanks for supported
          </h2>
        </div>
      </div>

      {/* First Row - Moving Left */}
      <ScrollTrack>
        <ScrollContent
          animate={{
            x: [0, -50 * sponsors.length],
          }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            },
          }}
          className="flex"
        >
          {duplicatedSponsors.map((sponsor, idx) => (
            <div
              key={`${sponsor.id}-${idx}`}
              className="flex-shrink-0 h-20 flex items-center justify-center bg-white rounded-lg shadow-sm px-8 hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-12 w-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </ScrollContent>
      </ScrollTrack>

      {/* Second Row - Moving Right */}
      <ScrollTrack className="mt-8">
        <ScrollContent
          animate={{
            x: [-50 * sponsors.length, 0],
          }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            },
          }}
          className="flex"
        >
          {duplicatedSponsors.map((sponsor, idx) => (
            <div
              key={`${sponsor.id}-${idx}-reverse`}
              className="flex-shrink-0 h-20 flex items-center justify-center bg-white rounded-lg shadow-sm px-8 hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-12 w-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </ScrollContent>
      </ScrollTrack>
    </ScrollContainer>
  );
};

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  yOffset?: number;
}> = ({ children, yOffset = 100 }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "-50px 0px",
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
        ease: "easeOut",
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

  return <motion.div style={{ y: smoothY }}>{children}</motion.div>;
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
        <path d="M18 15l-6-6-6 6" />
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
          <InfiniteScroll />
        </AnimatedSection>
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
