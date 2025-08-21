import { useQuery, gql } from '@apollo/client';

const ME = gql`
  query {
    me {
      id
      username
    }
  }
`;

const useMe = () => {
  const { data, error, loading } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    me: data?.me,
    loading,
    error,
  };
};

export default useMe;
