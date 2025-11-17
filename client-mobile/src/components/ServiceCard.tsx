import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ServiceCardProps {
  name: string;
  isConnected: boolean;
  onConnect: () => void;
}

export default function ServiceCard({ name, isConnected, onConnect }: ServiceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity
        style={[styles.button, isConnected ? styles.connected : styles.disconnected]}
        onPress={onConnect}
      >
        <Text style={styles.buttonText}>
          {isConnected ? 'Connected' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    width: '100%',
  },
  connected: {
    backgroundColor: '#22c55e',
  },
  disconnected: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
