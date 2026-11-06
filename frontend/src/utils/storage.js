// Utility for LocalStorage (User Profile) & Cookie-based Authentication

const USER_KEY = 'traveltrail_user';
const LEGACY_TOKEN_KEY = 'traveltrail_token';

// Automatically clean up any legacy token stored in localStorage for maximum security
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
} catch {
  // Ignore in SSR / restricted environments
}

export const storage = {
  /**
   * Token is handled securely via HttpOnly Cookies by the browser.
   * We do NOT persist token in localStorage to prevent XSS theft.
   */
  getToken: () => null,

  setToken: (_token) => {
    // No-op: Token is kept in HttpOnly Cookie for security
    try {
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    } catch {
      // Ignore
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    } catch {
      // Ignore
    }
  },

  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Storage setUser error:', e);
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Storage removeUser error:', e);
    }
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Storage clearAuth error:', e);
    }
  },
};

export default storage;
