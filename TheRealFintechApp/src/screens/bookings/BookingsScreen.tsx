import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Bookings</Title>
          <Text style={styles.subtitle}>
            Service booking functionality coming soon!
          </Text>
          <Button mode="contained" style={styles.button}>
            Book Service
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#2d3748',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#4a5568',
  },
  button: {
    marginTop: 24,
  },
});
