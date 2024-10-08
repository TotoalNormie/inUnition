import { Stack } from 'expo-router/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../components/auth/authContext';
import '../global.css';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'offlineFirst',
        },
        mutations: {
            networkMode: 'offlineFirst',
            throwOnError: false
        },
    }
});

export default function Layout () {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                </Stack>
            </AuthProvider>
        </QueryClientProvider>
    );
}