const useAuth = () => {
  // const { user, token } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('access_token')

  // Check if user is authenticated based on token presence
  const isAuthenticated = Boolean(token);

  return {
    token,
    isAuthenticated,
  };
};

export default useAuth;
