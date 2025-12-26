import { atom } from 'nanostores';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'superadmin' | 'student' | 'validator';
  school_type?: 'sma' | 'smk' | 'both';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean; // Flag to indicate if user data is verified from backend
}

// In-memory token storage (more secure than localStorage for sensitive tokens)
let memoryToken: string | null = null;

/**
 * Get token from memory first, fallback to sessionStorage
 * Using sessionStorage instead of localStorage for better security:
 * - sessionStorage is cleared when the browser tab is closed
 * - Reduces window of token exposure
 */
function getStoredToken(): string | null {
  if (memoryToken) return memoryToken;
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

/**
 * Store token securely
 * Primary storage is in memory, with sessionStorage as backup for page refreshes
 */
function storeToken(token: string): void {
  memoryToken = token;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('token', token);
    // Also store in localStorage for backward compatibility during transition
    // TODO: Remove localStorage storage after full migration
    localStorage.setItem('token', token);
  }
}

/**
 * Clear all token storage
 */
function clearTokenStorage(): void {
  memoryToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Initialize from storage if available (but mark as unverified)
function getInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      isVerified: false,
    };
  }

  try {
    const token = getStoredToken();
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        token,
        user,
        isAuthenticated: true,
        isVerified: false, // IMPORTANT: Not verified until backend confirms
      };
    }
  } catch (error) {
    // Silently fail - don't expose error details
    clearTokenStorage();
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
    isVerified: false,
  };
}

export const authStore = atom<AuthState>(getInitialState());

/**
 * Helper to update auth state after successful login
 * @param token - JWT token from backend
 * @param user - User data from backend (should be from /api/auth/me response)
 */
export function setAuth(token: string, user: User) {
  storeToken(token);
  
  if (typeof window !== 'undefined') {
    // Store minimal user data for UI purposes only
    // Role-based decisions should always verify with backend
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_type: user.school_type
    }));
  }
  
  authStore.set({
    token,
    user,
    isAuthenticated: true,
    isVerified: true, // Verified because it came from login response
  });
}

/**
 * Update auth state with verified user data from backend
 * Call this after validating token with /api/auth/me
 */
export function setVerifiedUser(user: User) {
  const currentState = authStore.get();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_type: user.school_type
    }));
  }
  
  authStore.set({
    ...currentState,
    user,
    isVerified: true,
  });
}

/**
 * Helper to clear auth state (logout)
 */
export function clearAuth() {
  clearTokenStorage();
  
  authStore.set({
    token: null,
    user: null,
    isAuthenticated: false,
    isVerified: false,
  });
}

/**
 * Get the current token (use this instead of direct localStorage access)
 */
export function getToken(): string | null {
  return getStoredToken();
}

// Initialize auth from localStorage on app start
export function initAuth() {
  if (typeof window === 'undefined') return;
  
  const state = getInitialState();
  authStore.set(state);
}