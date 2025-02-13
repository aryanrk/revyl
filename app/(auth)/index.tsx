import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export default function Welcome() {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={['#FF6B6B', '#4ECDC4']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Revyl</Text>
        <Text style={styles.subtitle}>
          Where personalities shine before faces reveal
        </Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/signup" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </Link>
          
          <Link href="/login" asChild>
            <Pressable style={[styles.button, styles.buttonOutline]}>
              <Text style={[styles.buttonText, styles.buttonTextOutline]}>
                I already have an account
              </Text>
            </Pressable>
          </Link>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextOutline: {
    color: '#fff',
  },
});