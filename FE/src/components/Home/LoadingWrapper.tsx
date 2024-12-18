import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import { useEffect, useState } from "react";

const LoadingWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const excludedPaths = ["/dashboard", "/welcome", "/login", "/admin"];

  useEffect(() => {
    if (!excludedPaths.includes(location.pathname)) {
      setIsLoading(true);

      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [location]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && children}
    </>
  );
};

export default LoadingWrapper;
