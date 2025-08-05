import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button, Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <Avatar.Text 
              size={80} 
              label={user?.displayName?.charAt(0) || 'U'} 
              style={styles.avatar}
            />
            <Title style={styles.name}>{user?.displayName || 'User'}</Title>
            <Text style={styles.email}>{user?.email}</Text>
            <Text style={styles.userType}>{user?.userType || 'Customer'}</Text>
          </View>
          
          <Button mode="outlined" style={styles.button}>
            Edit Profile
          </Button>
          <Button mode="outlined" style={styles.button}>
            Settings
          </Button>
          <Button mode="outlined" style={styles.button}>
            Help & Support
          </Button>
          <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
            Logout
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
  },
  card: {
    elevation: 4,
    marginTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    backgroundColor: '#667eea',
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
    color: '#2d3748',
  },
  email: {
    marginBottom: 4,
    color: '#4a5568',
  },
  userType: {
    fontSize: 12,
    color: '#667eea',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#e53e3e',
  },
});
