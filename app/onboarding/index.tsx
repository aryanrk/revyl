import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];

export default function BasicProfile() {
  const { user } = useAuth();
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [error, setError] = useState('');

  const handleNext = async () => {
    if (!age || !selectedGender) {
      setError('Please fill in all fields');
      return;
    }

    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge < 18 || numAge > 120) {
      setError('Please enter a valid age (18+)');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          age: numAge,
          gender: selectedGender,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;
      router.push('/onboarding/mood-board');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  return (
    <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressIndicator, { width: '33%' }]} />
          </View>
          <Text style={styles.step}>Step 1 of 3</Text>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Let's start with the basics</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="rgba(255,255,255,0.7)"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              maxLength={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
              {GENDER_OPTIONS.map((gender) => (
                <Pressable
                  key={gender}
                  style={[
                    styles.genderOption,
                    selectedGender === gender && styles.selectedGender,
                  ]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedGender === gender && styles.selectedGenderText,
                    ]}
                  >
                    {gender}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FF6B6B" />
          </Pressable>
        </View>
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
    marginBottom: 40,
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
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genderOption: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedGender: {
    backgroundColor: '#fff',
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedGenderText: {
    color: '#FF6B6B',
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
    marginTop: 'auto',
  },
  nextButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});