import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';

export default function PropertyDetailScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Property Details</Title>
          <Text style={styles.subtitle}>
            Comprehensive property information coming soon!
          </Text>
          <Button mode="contained" style={styles.button}>
            Contact Owner
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