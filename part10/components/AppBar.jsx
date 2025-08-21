import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';
import useMe from '../hooks/useMe';
import useSignOut from '../hooks/useSignOut';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    paddingBottom: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fontFamily,
  },
});

const AppBar = ({ selectedTab, onTabPress }) => {
  const { me } = useMe();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
    onTabPress('repositories');
  };

  const tabs = [
    { id: 'repositories', label: 'Repositories' },
    { 
      id: me ? 'signout' : 'signin', 
      label: me ? 'Sign out' : 'Sign in',
      onPress: me ? handleSignOut : () => onTabPress('signin')
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.tabActive,
              ]}
              onPress={tab.onPress || (() => onTabPress(tab.id))}
            >
              <Text style={styles.tabText}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AppBar;
