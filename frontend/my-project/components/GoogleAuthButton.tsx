import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';

const GOOGLE_CLIENT_ID = '853434167999-0aj5opdatd6i58n6uifanipcchfkunqd.apps.googleusercontent.com';
const USER_API_BASE_URL = process.env.NEXT_PUBLIC_USER_API_BASE_URL || 'http://localhost:8000/api/users';

const GoogleAuthButton: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${USER_API_BASE_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      localStorage.setItem('token', data.access_token);
      // Store user info for profile display
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        fullName: data.full_name || data.name || ''
      }));
      window.location.href = '/';
    } catch (err: any) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            handleGoogleSuccess(credentialResponse.credential);
          } else {
            setError('Google sign-in failed. No credential.');
          }
        }}
        onError={() => setError('Google sign-in failed. Please try again.')}
        useOneTap
        text="continue_with"
      />
      {loading && <div>Signing in with Google...</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default GoogleAuthButton;
