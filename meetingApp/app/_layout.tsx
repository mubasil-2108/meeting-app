import 'expo-dev-client';
import 'react-native-gesture-handler';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo, User } from '@stream-io/video-react-native-sdk'
import { OverlayProvider } from 'stream-chat-expo';
import Toast from 'react-native-toast-message';

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY

const InitialLayout = () => {
  const { authState, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(inside)';

    if (authState?.authenticated && inAuthGroup) {
      router.replace('/(inside)');
    } else if (!authState?.authenticated && !inAuthGroup) {
      router.replace('/');
    }
  }, [authState, initialized]);

  useEffect(() => {
    if(authState?.authenticated && authState?.token){
      console.log('Creating Stream Video Client');
    }

    const user: User = { id : authState?.user_id!}

    try{
      const client = new StreamVideoClient({ 
        apiKey: STREAM_KEY!, 
        user, 
        token: authState?.token! 
      });
      setClient(client);

    }catch (error) {
      console.error('Error creating Stream Video Client:', error);
    }


  }, [authState]);

  return (
    <>
      {
        !client && (
          <Stack>
            <Stack.Screen
              name='index'
              options={{ headerShown: false }} />
          </Stack>
        )
      }
      {
        client && (
          <StreamVideo client={client}>
            <OverlayProvider>
              <Slot />
              <Toast />
            </OverlayProvider>
          </StreamVideo>
        )
      }
    </>
  )
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  )
}

export default RootLayout;
