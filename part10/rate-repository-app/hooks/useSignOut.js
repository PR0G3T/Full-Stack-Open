import { useApolloClient } from '@apollo/client';
import AuthStorage from '../utils/authStorage';

const useSignOut = () => {
  const apolloClient = useApolloClient();
  const authStorage = new AuthStorage();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  return signOut;
};

export default useSignOut;
