import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import { useEffect, useState } from "react";

const LoadingWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };
    const handleRouteChangeEnd = () => {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    handleRouteChangeStart();
    handleRouteChangeEnd();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  return (
    <>
      {isLoading && <Loading />}
      {children}
    </>
  );
};

export default LoadingWrapper;
