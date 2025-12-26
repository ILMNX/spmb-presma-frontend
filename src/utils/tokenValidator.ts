import { setVerifiedUser, getToken, type User } from '../stores/authStore';

const API_BASE_URL = import.meta.env.PUBLIC_API_URL;

export interface TokenValidationResult {
  valid: boolean;
  user?: User;
}

/**
 * Validates token with backend and returns verified user data.
 * IMPORTANT: This should be the source of truth for user data, not localStorage.
 * 
 * @param token - JWT token to validate
 * @returns Object containing validation status and verified user data
 */
export async function validateToken(token: string): Promise<TokenValidationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.status === 401) {
      // Don't redirect here - let the caller (authGuard) handle redirects
      // This prevents race conditions and double redirects
      return { valid: false };
    }

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    
    // Backend returns { success: true, user: {...} }
    if (data.success && (data.user || data.data)) {
      const userData = data.user || data.data;
      // Update store with backend-verified user data
      setVerifiedUser(userData);
      return { 
        valid: true, 
        user: userData 
      };
    }

    return { valid: false };
  } catch (error) {
    // Don't log sensitive error details in production
    if (import.meta.env.DEV) {
      console.error('Token validation error:', error);
    }
    return { valid: false };
  }
}

/**
 * Validates token and checks if user has required role.
 * Use this for role-based access control with backend verification.
 * 
 * @param token - JWT token to validate
 * @param allowedRoles - Array of roles allowed to access
 * @returns Object with validation result and verified user
 */
export async function validateTokenWithRole(
  token: string, 
  allowedRoles: string[]
): Promise<TokenValidationResult & { hasAccess: boolean }> {
  const result = await validateToken(token);
  
  if (!result.valid || !result.user) {
    return { ...result, hasAccess: false };
  }
  
  const hasAccess = allowedRoles.includes(result.user.role);
  
  return {
    ...result,
    hasAccess
  };
}

/**
 * Setup periodic token validation
 * Validates every 5 minutes and on tab focus
 */
export function setupTokenValidation() {
  if (typeof window === 'undefined') return;

  const VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  let validationTimer: ReturnType<typeof setInterval> | null = null;
  
  const runValidation = async () => {
    const token = getToken();
    if (token) {
      await validateToken(token);
    }
  };
  
  // Validate periodically
  validationTimer = setInterval(runValidation, VALIDATION_INTERVAL);

  // Validate on tab focus (when user returns to tab)
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      await runValidation();
    }
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (validationTimer) {
      clearInterval(validationTimer);
    }
  });
}