import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import { verifyLogin } from '../api/auth';

const TOKEN_KEY = 'vtop_jwt_token';
const USERNAME_KEY = 'vtop_username';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  username: string | null;
  login: (params: {
    login_session_id: string;
    username: string;
    password: string;
    captcha: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for storage across Native and Web
async function saveSecureItem(key: string, value: string) {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch {
    // Ignore storage errors in non-standard environments
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch {
    return null;
  }
}

async function removeSecureItem(key: string) {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch {
    // Ignore removal errors
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored token on launch
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await getSecureItem(TOKEN_KEY);
        const storedUsername = await getSecureItem(USERNAME_KEY);

        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (e) {
        console.warn('Failed to restore authentication session:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();

    // Register 401 Unauthorized handler to reset session gracefully
    setUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  const login = async (params: {
    login_session_id: string;
    username: string;
    password: string;
    captcha: string;
  }) => {
    const res = await verifyLogin(params);
    const jwt = res.token;

    setToken(jwt);
    setUsername(params.username);
    setAuthToken(jwt);

    await saveSecureItem(TOKEN_KEY, jwt);
    await saveSecureItem(USERNAME_KEY, params.username);
  };

  const logout = async () => {
    setToken(null);
    setUsername(null);
    setAuthToken(null);

    await removeSecureItem(TOKEN_KEY);
    await removeSecureItem(USERNAME_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isLoading,
        token,
        username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
