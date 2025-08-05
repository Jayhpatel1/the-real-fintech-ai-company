import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';

export default function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Payments</Title>
          <Text style={styles.subtitle}>
            Multi-payment gateway integration coming soon!
          </Text>
          <Text style={styles.feature}>• UPI Payments</Text>
          <Text style={styles.feature}>• Card Payments</Text>
          <Text style={styles.feature}>• Net Banking</Text>
          <Text style={styles.feature}>• Cryptocurrency (DOGE)</Text>
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
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2d3748',
  },
});