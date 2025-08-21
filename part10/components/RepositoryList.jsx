import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import theme from '../theme';

const styles = StyleSheet.create({
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
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = ({ onRepositoryPress }) => {
  const { repositories, loading, error } = useRepositories();

  if (loading) {
    return (
      <View accessibilityLabel="repositoryList" style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading repositories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View accessibilityLabel="repositoryList" style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading repositories: {error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => <RepositoryItem item={item} onPress={onRepositoryPress} />;

  return (
    <FlatList
      accessibilityLabel="repositoryList"
      data={repositories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
};

export default RepositoryList;
