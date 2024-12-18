import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './lazy.css';

interface LazyComponentProps {
  importComponent: () => Promise<{ default: React.ComponentType }>;
  name?: string;
  componentHeight?: number; // Height in pixels
  preloadDistance?: number; // Distance in pixels
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  importComponent, 
  name, 
  componentHeight = 300, 
  preloadDistance 
}) => {
  const [calculatedPreloadDistance, setCalculatedPreloadDistance] = useState(preloadDistance);

  useEffect(() => {
    if (preloadDistance === undefined) {
      const dynamicPreloadDistance = Math.max(componentHeight * 1.5, 200);
      setCalculatedPreloadDistance(dynamicPreloadDistance);
    }
  }, [preloadDistance, componentHeight]);

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: `${calculatedPreloadDistance}px 0px ${calculatedPreloadDistance}px 0px`,
    threshold: 0,
  });

  const LazyLoadedComponent = lazy(importComponent);

  useEffect(() => {
    if (inView) {
      console.log(`Component ${name} is in view and loading`);
      console.log(`Preload Distance: ${calculatedPreloadDistance}px`);
    }
  }, [inView, name, calculatedPreloadDistance]);

  return (
    <div 
      ref={ref} 
      className={`lazy-component ${inView ? 'lazy-component-visible' : 'lazy-component-hidden'}`}
      style={{ minHeight: `${componentHeight}px` }}
    >
      {inView ? (
        <Suspense fallback={
          <div className="lazy-loading">
            Loading {name}...
          </div>
        }>
          <div className="lazy-content">
            <LazyLoadedComponent />
          </div>
        </Suspense>
      ) : (
        <div className="lazy-placeholder">
          Placeholder for {name}
        </div>
      )}
    </div>
  );
};

export default LazyComponent;
