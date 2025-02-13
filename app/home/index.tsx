import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? '#000000' : '#FFFFFF' }
    ]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[
          styles.title,
          { color: isDark ? '#FFFFFF' : '#000000' }
        ]}>
          Find Your Match
        </Text>
        
        <Text style={[
          styles.subtitle,
          { color: isDark ? '#CCCCCC' : '#666666' }
        ]}>
          Today's Potential Matches
        </Text>
        
        {/* Placeholder for match cards */}
        <View style={styles.matchesContainer}>
          <Text style={[
            styles.placeholder,
            { color: isDark ? '#888888' : '#999999' }
          ]}>
            New matches will appear here at your next matching window
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  matchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  placeholder: {
    textAlign: 'center',
    fontSize: 16,
  },
});