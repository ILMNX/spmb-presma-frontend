import { authStore, clearAuth, getToken } from '../stores/authStore';
import { validateTokenWithRole } from './tokenValidator';

/**
 * Initialize authentication guard with backend verification.
 * 
 * SECURITY: This function validates user roles from the backend,
 * NOT from localStorage. This prevents client-side role manipulation.
 */
export async function initAuthGuard() {
  if (typeof window === 'undefined') return;

  const { pathname } = window.location;
  const token = getToken();

  // Protected routes configuration
  const isAdminRoute = pathname.startsWith('/admin');
  const isValidatorRoute = pathname.startsWith('/validator');
  const isProtectedRoute = isAdminRoute || isValidatorRoute;
  const isLoginPage = pathname === '/login';

  // No token and trying to access protected route -> redirect to login
  if (!token && isProtectedRoute) {
    window.location.href = '/login';
    return;
  }

  // No token and on login page -> allow
  if (!token && isLoginPage) {
    return;
  }

  // No token and not protected -> allow
  if (!token) {
    return;
  }

  // Has token - MUST validate with backend before allowing access
  // This is the critical security fix - we verify roles from backend
  
  let allowedRoles: string[] = [];
  
  if (isAdminRoute) {
    allowedRoles = ['admin', 'superadmin'];
  } else if (isValidatorRoute) {
    allowedRoles = ['validator'];
  } else if (isLoginPage) {
    // Any authenticated user can be redirected from login
    allowedRoles = ['admin', 'superadmin', 'validator', 'student'];
  } else {
    // Public routes with token - just validate token is valid
    allowedRoles = ['admin', 'superadmin', 'validator', 'student'];
  }

  try {
    const result = await validateTokenWithRole(token, allowedRoles);

    // Token invalid - clear auth and redirect to login
    if (!result.valid) {
      clearAuth();
      if (isProtectedRoute) {
        window.location.href = '/login';
      }
      return;
    }

    const verifiedUser = result.user;
    
    if (!verifiedUser) {
      clearAuth();
      if (isProtectedRoute) {
        window.location.href = '/login';
      }
      return;
    }

    // Token valid but user doesn't have access to this route
    if (isProtectedRoute && !result.hasAccess) {
      // Redirect to appropriate dashboard based on VERIFIED role
      if (verifiedUser.role === 'validator') {
        window.location.href = '/validator/dashboard';
      } else if (verifiedUser.role === 'admin' || verifiedUser.role === 'superadmin') {
        window.location.href = '/admin/dashboard';
      } else {
        // Student or unknown role trying to access admin/validator routes
        clearAuth();
        window.location.href = '/login';
      }
      return;
    }

    // Redirect authenticated users away from login page
    if (isLoginPage && result.valid) {
      const redirectTo = getDashboardUrl(verifiedUser.role);
      window.location.href = redirectTo;
      return;
    }

    // Update auth store with verified data
    authStore.set({
      token,
      user: verifiedUser,
      isAuthenticated: true,
      isVerified: true,
    });

  } catch (error) {
    // Network error or other issue - fail secure
    if (import.meta.env.DEV) {
      console.error('Auth guard error:', error);
    }
    
    if (isProtectedRoute) {
      clearAuth();
      window.location.href = '/login';
    }
  }
}

/**
 * Get dashboard URL based on verified user role
 */
function getDashboardUrl(role: string): string {
  switch (role) {
    case 'validator':
      return '/validator/dashboard';
    case 'admin':
    case 'superadmin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

/**
 * Check if current user has specific role (must be verified first)
 * Use this for conditional UI rendering after auth guard has run
 */
export function hasVerifiedRole(allowedRoles: string[]): boolean {
  const state = authStore.get();
  
  // Only trust role if it's been verified with backend
  if (!state.isVerified || !state.user) {
    return false;
  }
  
  return allowedRoles.includes(state.user.role);
}