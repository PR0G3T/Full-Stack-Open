import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
import useRepository from '../hooks/useRepository';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mainBackground,
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d73a4a',
    fontFamily: theme.fontFamily,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fontFamily,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily,
    padding: 16,
    backgroundColor: theme.colors.repositoryItem,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepository = ({ repositoryId }) => {
  const { repository, reviews, loading, error, fetchMore, hasNextPage } = useRepository(repositoryId);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleOpenInGitHub = async () => {
    if (repository?.url) {
      const supported = await Linking.canOpenURL(repository.url);
      if (supported) {
        await Linking.openURL(repository.url);
      }
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasNextPage) return;
    
    setLoadingMore(true);
    try {
      await fetchMore();
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && !repository) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading repository...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading repository: {error.message}</Text>
      </View>
    );
  }

  if (!repository) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Repository not found</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      <RepositoryItem item={repository} />
      <TouchableOpacity style={styles.button} onPress={handleOpenInGitHub}>
        <Text style={styles.buttonText}>Open in GitHub</Text>
      </TouchableOpacity>
      <Text style={styles.reviewsHeader}>Reviews</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <Text style={styles.loadingMoreText}>Loading more reviews...</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => <ReviewItem review={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default SingleRepository;
