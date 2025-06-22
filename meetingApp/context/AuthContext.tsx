import * as SecureStore from 'expo-secure-store';
import {createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthProps {
    authState: { token: string | null; authenticated: boolean | null; user_id: string | null };
    onRegister: (email: string, password: string) => Promise<any>;
    onLogin: (email: string, password: string) => Promise<any>;
    onLogout: () => Promise<any>;
    initialized: boolean;
}

const TOKEN_KEY = 'my-stream-token';
export const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        user_id: string | null;
    }>({
        token: null,
        authenticated: null,
        user_id: null
    });
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const loadToken = async () => {
            const data = await SecureStore.getItemAsync(TOKEN_KEY);
            if (data) {
                const object = JSON.parse(data);
                setAuthState({
                    token: object.token,
                    authenticated: true,
                    user_id: object.user.id
                });
            }
            setInitialized(true);
        }
        loadToken();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Login response:', response.data);
            setAuthState({
                token: response.data.token,
                authenticated: true,
                user_id: response.data.user.id
            })

            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({
                response: response.data
            }))

            return response.data;

        } catch (e) {
            console.error('Login error:', e);
            return { error: true, msg: (e as any).response.data.msg };
        }
    }

    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                email,
                password
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Register response:', response.data);
            setAuthState({
                token: response.data.token,
                authenticated: true,
                user_id: response.data.user.id
            })
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({
                response: response.data
            }))
            return response.data;
        }
        catch (e) {
            console.error('Register error:', e);
            return { error: true, msg: (e as any).response.data.msg };
        }
    }

    const logout = async () => {
        SecureStore.deleteItemAsync(TOKEN_KEY)
        setAuthState({
            token: null,
            authenticated: false,
            user_id: null
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
        initialized
    }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}
