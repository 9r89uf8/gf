# Integration Examples

Practical code examples for integrating with the NextAI GF authentication system.

## 📋 Table of Contents

1. [Frontend Integration](#frontend-integration)
2. [API Endpoint Protection](#api-endpoint-protection)
3. [Client-side Authentication](#client-side-authentication)
4. [Error Handling](#error-handling)
5. [Premium Feature Integration](#premium-feature-integration)
6. [Profile Management](#profile-management)
7. [Testing Examples](#testing-examples)

---

## 🖥️ Frontend Integration

### React Login Component

```jsx
'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v2/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - user is logged in
        // Session cookie is automatically set
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### React Registration Component

```jsx
'use client';
import { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    country: 'ES'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v2/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - user is registered and logged in
        window.location.href = '/welcome';
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        required
      />
      <select
        value={formData.country}
        onChange={(e) => setFormData({...formData, country: e.target.value})}
      >
        <option value="ES">España</option>
        <option value="MX">México</option>
        <option value="AR">Argentina</option>
        {/* Add more countries */}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Profile Image Upload Component

```jsx
'use client';
import { useState } from 'react';

export default function ProfileImageUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !turnstileToken) {
      alert('Please select an image and complete CAPTCHA');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('turnstileToken', turnstileToken);

    try {
      const response = await fetch('/api/v2/auth/edit-user', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profile image updated successfully!');
        window.location.reload();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      {/* Turnstile CAPTCHA component would go here */}
      <button type="submit" disabled={loading || !file || !turnstileToken}>
        {loading ? 'Uploading...' : 'Update Profile Image'}
      </button>
    </form>
  );
}
```

---

## 🔒 API Endpoint Protection

### Basic Protected Endpoint

```javascript
// app/api/v2/protected-endpoint/route.js
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const authResult = await authMiddleware(req);
    
    if (!authResult.authenticated) {
      return NextResponse.json({ 
        error: "Authentication required" 
      }, { status: 401 });
    }

    // Protected logic here
    const userData = {
      userId: authResult.user.uid,
      email: authResult.user.email,
      message: "Welcome to the protected endpoint!"
    };

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ 
      error: "Server error" 
    }, { status: 500 });
  }
}
```

### User-specific Data Endpoint

```javascript
// app/api/v2/user-data/route.js
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { adminDb } from "@/app/utils/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const authResult = await authMiddleware(req);
    
    if (!authResult.authenticated) {
      return NextResponse.json({ 
        error: "Authentication required" 
      }, { status: 401 });
    }

    const userId = authResult.user.uid;
    
    // Fetch user-specific data from Firestore
    const userRef = adminDb.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // Remove sensitive data before sending
    delete userData.profilePicDescription;
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('User data fetch error:', error);
    return NextResponse.json({ 
      error: "Failed to fetch user data" 
    }, { status: 500 });
  }
}
```

### Premium-only Endpoint

```javascript
// app/api/v2/premium-feature/route.js
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { adminDb } from "@/app/utils/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authResult = await authMiddleware(req);
    
    if (!authResult.authenticated) {
      return NextResponse.json({ 
        error: "Authentication required" 
      }, { status: 401 });
    }

    const userId = authResult.user.uid;
    
    // Check premium status
    const userRef = adminDb.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData.premium) {
      return NextResponse.json({ 
        error: "Premium subscription required",
        upgradeUrl: "/premium"
      }, { status: 403 });
    }

    // Check if premium is expired
    if (userData.expirationDate) {
      const now = adminDb.firestore.Timestamp.now();
      if (now.toMillis() > userData.expirationDate.toMillis()) {
        // Update user to non-premium
        await userRef.update({
          premium: false,
          expirationDate: null,
          expired: true
        });

        return NextResponse.json({ 
          error: "Premium subscription expired",
          upgradeUrl: "/premium"
        }, { status: 403 });
      }
    }

    // Premium feature logic here
    const premiumData = {
      message: "Welcome to premium feature!",
      data: "Premium exclusive content"
    };

    return NextResponse.json(premiumData);
  } catch (error) {
    console.error('Premium feature error:', error);
    return NextResponse.json({ 
      error: "Server error" 
    }, { status: 500 });
  }
}
```

---

## 🎯 Client-side Authentication

### Authentication Context Provider

```jsx
// contexts/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/v2/auth/verify');
      const data = await response.json();

      if (response.ok && data.isAuthenticated) {
        setUser(data.userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('/api/v2/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/v2/auth/signout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Protected Route Component

```jsx
// components/ProtectedRoute.js
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return children;
}
```

### Premium Feature Guard

```jsx
// components/PremiumGuard.js
'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function PremiumGuard({ children, fallback }) {
  const { user } = useAuth();

  if (!user?.premium) {
    return fallback || (
      <div className="premium-required">
        <h3>Premium Feature</h3>
        <p>This feature requires a premium subscription.</p>
        <a href="/premium">Upgrade Now</a>
      </div>
    );
  }

  return children;
}
```

---

## 🚨 Error Handling

### Comprehensive Error Handler

```javascript
// utils/authErrorHandler.js
export function handleAuthError(error, response) {
  const statusCode = response?.status || 500;
  
  switch (statusCode) {
    case 401:
      return {
        message: "Authentication required. Please log in.",
        action: "redirect_to_login",
        severity: "warning"
      };
      
    case 403:
      return {
        message: "Access denied. Premium subscription required.",
        action: "show_upgrade_modal",
        severity: "info"
      };
      
    case 400:
      if (error.includes('CAPTCHA')) {
        return {
          message: "Please complete the CAPTCHA verification.",
          action: "retry_with_captcha",
          severity: "warning"
        };
      }
      return {
        message: "Invalid request. Please check your input.",
        action: "show_form_errors",
        severity: "error"
      };
      
    case 500:
      return {
        message: "Server error. Please try again later.",
        action: "retry_later",
        severity: "error"
      };
      
    default:
      return {
        message: "An unexpected error occurred.",
        action: "contact_support",
        severity: "error"
      };
  }
}
```

### API Call with Error Handling

```javascript
// utils/apiClient.js
import { handleAuthError } from './authErrorHandler';

export async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorInfo = handleAuthError(data.error, response);
      
      // Handle different error actions
      switch (errorInfo.action) {
        case 'redirect_to_login':
          window.location.href = '/login';
          break;
          
        case 'show_upgrade_modal':
          // Show premium upgrade modal
          break;
          
        case 'retry_with_captcha':
          // Show CAPTCHA and retry
          break;
      }
      
      throw new Error(errorInfo.message);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

---

## 💎 Premium Feature Integration

### Premium Status Checker

```javascript
// utils/premiumChecker.js
export async function checkPremiumStatus() {
  try {
    const response = await fetch('/api/v2/auth/verify');
    const data = await response.json();

    if (!data.isAuthenticated) {
      return { premium: false, reason: 'not_authenticated' };
    }

    const user = data.userData;
    
    if (!user.premium) {
      return { premium: false, reason: 'not_premium' };
    }

    // Check expiration
    if (user.expirationDate) {
      const now = new Date();
      const expiration = new Date(user.expirationDate.seconds * 1000);
      
      if (now > expiration) {
        return { premium: false, reason: 'expired' };
      }
    }

    return { 
      premium: true, 
      expirationDate: user.expirationDate 
    };
  } catch (error) {
    console.error('Premium check failed:', error);
    return { premium: false, reason: 'error' };
  }
}
```

### Conditional Feature Rendering

```jsx
// components/ConditionalFeature.js
'use client';
import { useState, useEffect } from 'react';
import { checkPremiumStatus } from '@/utils/premiumChecker';

export default function ConditionalFeature({ children, premiumOnly = false }) {
  const [premiumStatus, setPremiumStatus] = useState(null);

  useEffect(() => {
    if (premiumOnly) {
      checkPremiumStatus().then(setPremiumStatus);
    }
  }, [premiumOnly]);

  if (premiumOnly && premiumStatus && !premiumStatus.premium) {
    return (
      <div className="premium-required">
        <h4>Premium Feature</h4>
        <p>Upgrade to access this feature.</p>
        <button onClick={() => window.location.href = '/premium'}>
          Upgrade Now
        </button>
      </div>
    );
  }

  return children;
}
```

---

## 🧪 Testing Examples

### API Endpoint Testing

```javascript
// tests/auth.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Authentication API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    username: 'testuser',
    country: 'ES'
  };

  afterEach(async () => {
    // Cleanup test user if created
    try {
      await fetch('/api/v2/auth/delete', { method: 'GET' });
    } catch (error) {
      // User may not exist
    }
  });

  it('should register a new user', async () => {
    const response = await fetch('/api/v2/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.user.email).toBe(testUser.email);
    expect(data.user.name).toBe(testUser.username);
  });

  it('should login with valid credentials', async () => {
    // First register
    await fetch('/api/v2/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    // Then login
    const response = await fetch('/api/v2/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.user.email).toBe(testUser.email);
  });

  it('should reject bot-like usernames', async () => {
    const botUser = {
      ...testUser,
      username: 'abcd1234' // 8 random characters
    };

    const response = await fetch('/api/v2/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botUser),
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid registration');
  });
});
```

### Frontend Component Testing

```jsx
// tests/LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '@/components/LoginForm';

// Mock fetch
global.fetch = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should submit login form with correct data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { email: 'test@example.com' } }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/v2/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
    });
  });

  it('should display error on failed login', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```

---

## 📱 Usage Patterns

### Complete Authentication Flow

```jsx
// pages/Dashboard.js
'use client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PremiumGuard from '@/components/PremiumGuard';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="dashboard">
        <header>
          <h1>Welcome, {user?.name}</h1>
          <button onClick={logout}>Logout</button>
        </header>

        <div className="features">
          <div className="basic-features">
            <h2>Basic Features</h2>
            {/* Available to all users */}
          </div>

          <PremiumGuard>
            <div className="premium-features">
              <h2>Premium Features</h2>
              {/* Only for premium users */}
            </div>
          </PremiumGuard>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

This documentation provides comprehensive examples for integrating with the NextAI GF authentication system, covering both frontend and backend implementations with proper error handling and security considerations.