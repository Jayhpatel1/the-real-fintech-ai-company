import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  RadioButton,
  Snackbar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUser, clearError } from '../../store/slices/authSlice';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    userType: 'customer',
    phone: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const userTypes = [
    { label: 'Customer', value: 'customer' },
    { label: 'Property Broker', value: 'broker' },
    { label: 'Builder', value: 'builder' },
    { label: 'Service Provider', value: 'service_provider' },
    { label: 'Shop Owner', value: 'shop_owner' },
  ];

  const handleRegister = async () => {
    const { email, password, confirmPassword, displayName, userType, phone, city } = formData;

    if (!email || !password || !displayName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await dispatch(registerUser({
        email,
        password,
        userData: {
          displayName,
          userType,
          profile: { phone, city },
        },
      })).unwrap();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create Account</Title>
            <Paragraph style={styles.subtitle}>
              Join The Real Fintech AI Company
            </Paragraph>

            <TextInput
              label="Full Name *"
              value={formData.displayName}
              onChangeText={(value) => updateFormData('displayName', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              label="Phone"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="City"
              value={formData.city}
              onChangeText={(value) => updateFormData('city', value)}
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.sectionTitle}>Account Type</Text>
            <RadioButton.Group
              onValueChange={(value) => updateFormData('userType', value)}
              value={formData.userType}
            >
              {userTypes.map((type) => (
                <RadioButton.Item
                  key={type.value}
                  label={type.label}
                  value={type.value}
                  style={styles.radioItem}
                />
              ))}
            </RadioButton.Group>

            <TextInput
              label="Password *"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Confirm Password *"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Already have an account? Sign In
            </Button>
          </Card.Content>
        </Card>

        <Snackbar
          visible={!!error}
          onDismiss={() => dispatch(clearError())}
          duration={4000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#2d3748',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#4a5568',
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    color: '#2d3748',
  },
  radioItem: {
    paddingVertical: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 8,
  },
  snackbar: {
    backgroundColor: '#e53e3e',
  },
});