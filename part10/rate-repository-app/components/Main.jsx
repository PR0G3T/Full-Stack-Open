import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RepositoryList from './RepositoryList';
import SingleRepository from './SingleRepository';
import SignIn from './SignIn';
import AppBar from './AppBar';
import theme from '../theme';

const Main = () => {
  const [selectedTab, setSelectedTab] = useState('repositories');
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(null);

  const handleRepositoryPress = (repositoryId) => {
    setSelectedRepositoryId(repositoryId);
    setSelectedTab('repository');
  };

  const handleBackToRepositories = () => {
    setSelectedRepositoryId(null);
    setSelectedTab('repositories');
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'signin':
        return <SignIn onTabPress={setSelectedTab} />;
      case 'repository':
        return <SingleRepository repositoryId={selectedRepositoryId} />;
      case 'repositories':
      default:
        return <RepositoryList onRepositoryPress={handleRepositoryPress} />;
    }
  };

  const handleTabPress = (tab) => {
    if (tab === 'repositories') {
      handleBackToRepositories();
    } else {
      setSelectedTab(tab);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar selectedTab={selectedTab === 'repository' ? 'repositories' : selectedTab} onTabPress={handleTabPress} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mainBackground,
  },
});

export default Main;
