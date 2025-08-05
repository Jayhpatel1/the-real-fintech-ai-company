import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Title, Button, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '../../store';
import { fetchProperties } from '../../store/slices/propertySlice';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { properties } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const quickActions = [
    { title: 'Voice Search', icon: 'mic', screen: 'Search' },
    { title: 'Properties', icon: 'business', screen: 'Properties' },
    { title: 'Bookings', icon: 'calendar', screen: 'Bookings' },
    { title: 'Map View', icon: 'map', screen: 'Map' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>
              Welcome back, {user?.displayName || 'User'}!
            </Title>
            <Text style={styles.welcomeSubtitle}>
              Your AI-powered real estate assistant is ready
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{properties.length}</Text>
              <Text style={styles.statLabel}>Properties</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </Card.Content>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <Card
              key={index}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
            >
              <Card.Content style={styles.actionContent}>
                <Ionicons name={action.icon as any} size={32} color="#667eea" />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Properties</Text>
        {properties.slice(0, 3).map((property, index) => (
          <Card key={index} style={styles.propertyCard}>
            <Card.Content>
              <Title numberOfLines={1}>{property.title}</Title>
              <Text numberOfLines={2}>{property.description}</Text>
              <Text style={styles.priceText}>₹{property.price?.toLocaleString()}</Text>
            </Card.Content>
          </Card>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="mic"
        onPress={() => navigation.navigate('Search')}
        label="Voice Search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: '#667eea',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 24,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
    color: '#2d3748',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 48) / 2,
    margin: 4,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionTitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  propertyCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
});