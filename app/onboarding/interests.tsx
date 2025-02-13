import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const INTERESTS = [
  'Reading', 'Writing', 'Photography', 'Cooking', 'Gaming',
  'Movies', 'Music', 'Sports', 'Travel', 'Art',
  'Technology', 'Fashion', 'Fitness', 'Dancing', 'Hiking',
  'Yoga', 'Meditation', 'Languages', 'Science', 'History'
];

export default function Interests() {
  const { user } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (selectedInterests.length < 3) {
      setError('Please select at least 3 interests');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          interests: selectedInterests,
          onboarding_complete: true,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;
      router.replace('/(tabs)');
    } catch (err) {
      setError('Failed to update interests');
      console.error(err);
    }
  };

  return (
    <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressIndicator, { width: '100%' }]} />
          </View>
          <Text style={styles.step}>Step 3 of 3</Text>
          <Text style={styles.title}>What interests you?</Text>
          <Text style={styles.subtitle}>
            Select at least 3 interests to help us find your perfect match
          </Text>
        </View>

        <ScrollView style={styles.interestsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <Pressable
                key={interest}
                style={[
                  styles.interestItem,
                  selectedInterests.includes(interest) && styles.selectedInterest,
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText,
                  ]}
                >
                  {interest}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Complete Profile</Text>
          <Ionicons name="checkmark" size={20} color="#FF6B6B" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  step: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  interestsContainer: {
    flex: 1,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  interestItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedInterest: {
    backgroundColor: '#fff',
  },
  interestText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedInterestText: {
    color: '#FF6B6B',
  },
  errorText: {
    color: '#FFE3E3',
    marginBottom: 16,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  completeButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});