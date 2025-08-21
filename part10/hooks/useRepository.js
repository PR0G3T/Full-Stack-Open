import { useQuery, gql } from '@apollo/client';

const GET_REPOSITORY = gql`
  query GetRepository($repositoryId: ID!, $first: Int, $after: String) {
    repository(id: $repositoryId) {
      id
      fullName
      description
      language
      forksCount
      stargazersCount
      ratingAverage
      reviewCount
      ownerAvatarUrl
      url
      reviews(first: $first, after: $after) {
        totalCount
        edges {
          node {
            id
            text
            rating
            createdAt
            repositoryId
            user {
              id
              username
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
    }
  }
`;

const useRepository = (repositoryId, first = 3) => {
  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORY, {
    variables: { repositoryId, first },
    fetchPolicy: 'cache-and-network',
    skip: !repositoryId,
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        repositoryId,
        first,
      },
    });
  };

  return {
    repository: data?.repository,
    reviews: data?.repository?.reviews.edges.map(edge => edge.node) || [],
    loading,
    error,
    fetchMore: handleFetchMore,
    hasNextPage: data?.repository?.reviews.pageInfo.hasNextPage || false,
  };
};

export default useRepository;
