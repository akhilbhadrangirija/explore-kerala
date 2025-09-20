// Simple authentication utilities
export const auth = {
  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('adminAuth') === 'true';
  },

  // Get admin email
  getAdminEmail: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminEmail');
  },

  // Login
  login: (email, password) => {
    if (typeof window === 'undefined') return false;
    console.log('Login attempt:', email, password);
    console.log('Admin email:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    console.log('Admin password:', process.env.NEXT_PUBLIC_ADMIN_PASSWORD);
    // Simple authentication check
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    // if (email === 'admin@exploremykerala.com' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminEmail', email);
      return true;
    }
    return false;
  },

  // Logout
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
  }
};
