import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ServicesScreen() {
  const services = ['GitHub', 'Gmail', 'Discord', 'Google Drive', 'Weather', 'Timer'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Available Services</Text>
      
      <View style={styles.servicesGrid}>
        {services.map((service) => (
          <View key={service} style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service}</Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
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
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 5,
    width: '100%',
  },
  connectButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
