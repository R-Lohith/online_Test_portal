import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * useAuth — single source of truth for authentication state.
 *
 * Priority:
 *  1. Firebase Auth (Google sign-in)
 *  2. Local token from MongoDB login (stored in localStorage)
 *
 * Returns { user, loading }
 *  - loading: true while Firebase is resolving (prevents flash redirects)
 *  - user: the authenticated user object OR null (never undefined)
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // ── 1. Firebase Google session ─────────────────────────
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: localStorage.getItem('role') || 'student',
          token: localStorage.getItem('token') || '',
          source: 'firebase',
        });
      } else {
        // ── 2. MongoDB session (local token) ───────────────────
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        if (token && userId) {
          setUser({
            uid: userId,
            _id: userId,
            role: role || 'student',
            username: username || 'Admin',
            email: 'user@local.db',
            token: token,
            source: 'local',
          });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
