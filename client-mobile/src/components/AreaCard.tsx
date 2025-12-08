import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AreaCardProps {
  name: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
}

export default function AreaCard({ name, description, isActive, onPress }: AreaCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={[styles.badge, isActive ? styles.active : styles.inactive]}>
          <Text style={styles.badgeText}>{isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: '#22c55e',
  },
  inactive: {
    backgroundColor: '#ef4444',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
