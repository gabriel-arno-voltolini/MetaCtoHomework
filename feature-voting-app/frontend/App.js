import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/components/LoginScreen';
import FeatureList from './src/components/FeatureList';
import MyFeatures from './src/components/MyFeatures';
import CreateFeature from './src/components/CreateFeature';
import { getCurrentUser } from './src/utils/storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen 
        name="AllFeatures" 
        component={FeatureList} 
        options={{ 
          title: 'All Features',
          tabBarLabel: 'All Features'
        }} 
      />
      <Tab.Screen 
        name="MyFeatures" 
        component={MyFeatures} 
        options={{ 
          title: 'My Features',
          tabBarLabel: 'My Features'
        }} 
      />
      <Tab.Screen 
        name="CreateFeature" 
        component={CreateFeature} 
        options={{ 
          title: 'Create Feature',
          tabBarLabel: 'Create'
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // You could add a loading screen here
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLogin={setUser} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});