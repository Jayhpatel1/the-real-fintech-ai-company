import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, ActivityIndicator } from 'react-native-paper';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

export default function VoiceSearchScreen() {
  const [isListening, setIsListening] = useState(false);
  const [searchResult, setSearchResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const startVoiceSearch = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone access is needed for voice search');
        return;
      }

      setIsListening(true);
      
      // Simulate voice recognition (in real app, integrate with speech-to-text API)
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        
        // Simulate AI processing
        setTimeout(() => {
          setIsProcessing(false);
          const mockResponse = "I found 15 properties matching your criteria in Bhavnagar. Would you like to see 2BHK apartments under ₹50 lakhs?";
          setSearchResult(mockResponse);
          
          // Text-to-speech response
          Speech.speak(mockResponse, {
            language: 'en-IN',
            pitch: 1.0,
            rate: 0.9,
          });
        }, 2000);
      }, 3000);
      
    } catch (error) {
      console.error('Voice search error:', error);
      setIsListening(false);
      setIsProcessing(false);
      Alert.alert('Error', 'Voice search failed. Please try again.');
    }
  };

  const clearSearch = () => {
    setSearchResult('');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>🎤 AI Voice Search</Title>
          <Text style={styles.subtitle}>
            Speak naturally to find properties, services, or get information
          </Text>

          <View style={styles.microphoneContainer}>
            {isListening ? (
              <View style={styles.listeningContainer}>
                <View style={[styles.microphoneButton, styles.listening]} />
                <Text style={styles.listeningText}>Listening...</Text>
                <ActivityIndicator size="large" color="#667eea" style={styles.loader} />
              </View>
            ) : isProcessing ? (
              <View style={styles.listeningContainer}>
                <View style={[styles.microphoneButton, styles.processing]} />
                <Text style={styles.listeningText}>Processing with AI...</Text>
                <ActivityIndicator size="large" color="#764ba2" style={styles.loader} />
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={startVoiceSearch}
                style={styles.microphoneButton}
                contentStyle={styles.microphoneButtonContent}
                icon={() => <Ionicons name="mic" size={40} color="white" />}
              >
                <Text style={styles.microphoneButtonText}>Start Voice Search</Text>
              </Button>
            )}
          </View>

          {searchResult ? (
            <Card style={styles.resultCard}>
              <Card.Content>
                <Title style={styles.resultTitle}>AI Assistant Response:</Title>
                <Text style={styles.resultText}>{searchResult}</Text>
                <View style={styles.resultActions}>
                  <Button mode="outlined" onPress={clearSearch} style={styles.actionButton}>
                    Clear
                  </Button>
                  <Button mode="contained" style={styles.actionButton}>
                    View Results
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ) : null}

          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Try saying:</Text>
            <Text style={styles.exampleText}>• "Show me 2BHK apartments under 50 lakhs"</Text>
            <Text style={styles.exampleText}>• "I need construction services in Bhavnagar"</Text>
            <Text style={styles.exampleText}>• "Find solar panels for my home"</Text>
            <Text style={styles.exampleText}>• "Book a property viewing for tomorrow"</Text>
          </View>
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
  },
  mainCard: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 8,
    color: '#2d3748',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#4a5568',
  },
  microphoneContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#667eea',
  },
  microphoneButtonContent: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  microphoneButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
  },
  listeningContainer: {
    alignItems: 'center',
  },
  listening: {
    backgroundColor: '#38a169',
    shadowColor: '#38a169',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  processing: {
    backgroundColor: '#764ba2',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  listeningText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  loader: {
    marginTop: 16,
  },
  resultCard: {
    marginVertical: 16,
    backgroundColor: '#e6fffa',
    borderLeftWidth: 4,
    borderLeftColor: '#38a169',
  },
  resultTitle: {
    fontSize: 16,
    color: '#2d3748',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2d3748',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  examplesContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f7fafc',
    borderRadius: 8,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d3748',
  },
  exampleText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4a5568',
  },
});