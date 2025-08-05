import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';

export default function PropertieScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Propertie Feature</Title>
          <Text style={styles.subtitle}>
            This feature is coming soon! Your comprehensive super app includes:
          </Text>
          <Text style={styles.feature}>• Advanced property management</Text>
          <Text style={styles.feature}>• Smart booking system</Text>
          <Text style={styles.feature}>• Real-time messaging</Text>
          <Text style={styles.feature}>• Payment processing</Text>
          <Text style={styles.feature}>• AI-powered recommendations</Text>
          <Button mode="contained" style={styles.button}>
            Explore Features
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
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2d3748',
  },
  button: {
    marginTop: 24,
  },
});
