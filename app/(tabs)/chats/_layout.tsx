import { Stack } from 'expo-router';

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#FF6B6B',
        }}
      />
    </Stack>
  );
}