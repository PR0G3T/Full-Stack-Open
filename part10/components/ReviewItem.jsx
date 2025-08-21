import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const ReviewItem = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>{review.rating}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.username}>{review.user.username}</Text>
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.repositoryItem,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fontFamily,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily,
  },
  date: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily,
  },
  text: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    fontFamily: theme.fontFamily,
  },
});

export default ReviewItem;
