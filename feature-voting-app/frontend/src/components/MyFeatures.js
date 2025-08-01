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

export default function MyFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        loadMyFeatures();
      }
    }, [currentUser])
  );

  const loadCurrentUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const loadMyFeatures = async () => {
    if (!loading) setLoading(true);
    
    try {
      const response = await ApiService.getUserFeatures(currentUser.id);
      setFeatures(response.features);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your features');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (feature) => {
    Alert.alert(
      'Delete Feature',
      `Are you sure you want to delete "${feature.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteFeature(feature.id),
        },
      ]
    );
  };

  const deleteFeature = async (featureId) => {
    try {
      await ApiService.deleteFeature(featureId, currentUser.id);
      setFeatures(features.filter(f => f.id !== featureId));
      Alert.alert('Success', 'Feature deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete feature');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (currentUser) {
      loadMyFeatures();
    }
  };

  const renderFeature = ({ item }) => {
    return (
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureName}>{item.name}</Text>
          <Text style={styles.featureDate}>
            Created: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.featureFooter}>
          <Text style={styles.voteCount}>{item.vote_count} votes</Text>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
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
            <Text style={styles.emptyText}>No features created yet</Text>
            <Text style={styles.emptySubtext}>Go to Create tab to add your first feature!</Text>
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
  featureDate: {
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
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    textAlign: 'center',
  },
});