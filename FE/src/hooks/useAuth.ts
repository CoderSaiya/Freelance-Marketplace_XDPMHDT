import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const useAuth = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated based on token presence
  const isAuthenticated = Boolean(user && token);

  return {
    user,
    token,
    isAuthenticated,
  };
};

export default useAuth;
