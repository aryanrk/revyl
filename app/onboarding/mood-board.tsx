import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const MOOD_IMAGES = [
  {
    id: 'nature',
    url: 'http://images.unsplash.com/photo-1501854140801-50d01698950b',
    title: 'Nature',
  },
  {
    id: 'urban',
    url: 'http://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    title: 'Urban',
  },
  {
    id: 'adventure',
    url: 'http://images.unsplash.com/photo-1516939884455-1445c8652f83',
    title: 'Adventure',
  },
  {
    id: 'art',
    url: 'http://images.unsplash.com/photo-1547891654-e66ed7ebb968',
    title: 'Art',
  },
  {
    id: 'music',
    url: 'http://images.unsplash.com/photo-1511379938547-c1f69419868d',
    title: 'Music',
  },
  {
    id: 'food',
    url: 'http://images.unsplash.com/photo-1504674900247-0877df9cc836',
    title: 'Food',
  },
  {
    id: 'travel',
    url: 'http://images.unsplash.com/photo-1488646953014-85cb44e25828',
    title: 'Travel',
  },
  {
    id: 'fitness',
    url: 'http://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    title: 'Fitness',
  },
];

export default function MoodBoard() {
  const { user } = useAuth();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleMood = (moodId: string) => {
    setSelectedMoods((prev) =>
      prev.includes(moodId)
        ? prev.filter((id) => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleNext = async () => {
    if (selectedMoods.length < 3) {
      setError('Please select at least 3 moods');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          preferences: selectedMoods,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;
      router.push('/onboarding/interests');
    } catch (err) {
      setError('Failed to update preferences');
      console.error(err);
    }
  };

  return (
    <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressIndicator, { width: '66%' }]} />
          </View>
          <Text style={styles.step}>Step 2 of 3</Text>
          <Text style={styles.title}>Create Your Mood Board</Text>
          <Text style={styles.subtitle}>
            Select images that resonate with your personality
          </Text>
        </View>

        <ScrollView style={styles.moodGrid} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {MOOD_IMAGES.map((mood) => (
              <Pressable
                key={mood.id}
                style={[
                  styles.moodItem,
                  selectedMoods.includes(mood.id) && styles.selectedMoodItem,
                ]}
                onPress={() => toggleMood(mood.id)}
              >
                <Image
                  source={{ uri: mood.url }}
                  style={styles.moodImage}
                  resizeMode="cover"
                />
                <View style={styles.moodOverlay}>
                  <Text style={styles.moodTitle}>{mood.title}</Text>
                  {selectedMoods.includes(mood.id) && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={[
            styles.nextButton,
            selectedMoods.length < 3 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedMoods.length < 3}
        >
          <Text style={styles.nextButtonText}>
            Continue ({selectedMoods.length}/3)
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FF6B6B" />
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
  moodGrid: {
    flex: 1,
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  moodItem: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedMoodItem: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  moodImage: {
    width: '100%',
    height: '100%',
  },
  moodOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  moodTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFE3E3',
    marginBottom: 16,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});