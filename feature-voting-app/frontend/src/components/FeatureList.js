import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ApiService from '../services/api';
import { getCurrentUser } from '../utils/storage';

export default function FeatureList() {
  const [features, setFeatures] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFeatures();
      if (currentUser) {
        loadUserVotes();
      }
    }, [currentUser])
  );

  const loadCurrentUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const loadFeatures = async () => {
    if (!loading) setLoading(true);
    
    try {
      const response = await ApiService.getAllFeatures();
      setFeatures(response.features);
    } catch (error) {
      Alert.alert('Error', 'Failed to load features');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const response = await ApiService.getUserVotes(currentUser.id);
      setUserVotes(response.votedFeatures);
    } catch (error) {
      console.error('Failed to load user votes:', error);
    }
  };

  const handleVote = async (featureId) => {
    if (!currentUser) return;

    try {
      const response = await ApiService.toggleVote(currentUser.id, featureId);
      
      // Update local state
      if (response.voted) {
        setUserVotes([...userVotes, featureId]);
      } else {
        setUserVotes(userVotes.filter(id => id !== featureId));
      }
      
      // Refresh features to get updated vote counts
      loadFeatures();
    } catch (error) {
      Alert.alert('Error', 'Failed to vote');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFeatures();
    if (currentUser) {
      loadUserVotes();
    }
  };

  const renderFeature = ({ item }) => {
    const isVoted = userVotes.includes(item.id);
    const isOwner = currentUser && item.user_id === currentUser.id;

    return (
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureName}>{item.name}</Text>
          <Text style={styles.featureCreator}>by {item.creator_email}</Text>
        </View>
        
        <View style={styles.featureFooter}>
          <Text style={styles.voteCount}>{item.vote_count} votes</Text>
          
          {!isOwner && (
            <TouchableOpacity
              style={[styles.voteButton, isVoted && styles.voteButtonActive]}
              onPress={() => handleVote(item.id)}
            >
              <Text style={[styles.voteButtonText, isVoted && styles.voteButtonTextActive]}>
                {isVoted ? 'Voted' : 'Vote'}
              </Text>
            </TouchableOpacity>
          )}
          
          {isOwner && (
            <Text style={styles.ownerLabel}>Your feature</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No features yet</Text>
            <Text style={styles.emptySubtext}>Be the first to create one!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureHeader: {
    marginBottom: 12,
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureCreator: {
    fontSize: 14,
    color: '#666',
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  voteButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  voteButtonActive: {
    backgroundColor: '#34C759',
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  voteButtonTextActive: {
    color: '#fff',
  },
  ownerLabel: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});