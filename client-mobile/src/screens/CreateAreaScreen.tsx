import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreateAreaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Area</Text>
      <Text style={styles.subtitle}>Build your automation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
