import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ApiService from '../services/api';
import { getCurrentUser } from '../utils/storage';

export default function CreateFeature({ navigation }) {
  const [featureName, setFeatureName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const handleCreate = async () => {
    if (!featureName.trim()) {
      Alert.alert('Error', 'Please enter a feature name');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);

    try {
      await ApiService.createFeature(featureName.trim(), currentUser.id);
      setFeatureName('');
      Alert.alert(
        'Success', 
        'Feature created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to MyFeatures tab to see the created feature
              navigation.navigate('MyFeatures');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create feature');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create New Feature</Text>
        <Text style={styles.subtitle}>What feature would you like to see?</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Feature name"
          value={featureName}
          onChangeText={setFeatureName}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!loading}
          maxLength={200}
        />
        
        <Text style={styles.characterCount}>
          {featureName.length}/200 characters
        </Text>
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading || !featureName.trim()}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Feature'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>
          Once created, other users will be able to vote on your feature.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
});