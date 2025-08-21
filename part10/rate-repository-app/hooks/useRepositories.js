import { useQuery, gql } from '@apollo/client';

const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`;

const useRepositories = () => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return { repositories: [], loading: true, error: null };
  if (error) return { repositories: [], loading: false, error };

  const repositories = data.repositories.edges.map(edge => edge.node);
  return { repositories, loading: false, error: null };
};

export default useRepositories;
