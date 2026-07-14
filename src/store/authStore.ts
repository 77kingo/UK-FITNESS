import { create } from 'zustand';
import { UserProfile, UserRole } from '../types';
import { supabase, isMockMode } from '../lib/supabaseClient';

interface AuthState {
  user: UserProfile | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, fullName: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Key for mock session storage
const MOCK_USER_KEY = 'uk_fitness_mock_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true, error: null });

    if (isMockMode) {
      // Load mock user from localStorage
      const stored = localStorage.getItem(MOCK_USER_KEY);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          set({ user, session: { user: { id: user.id, email: user.email } }, loading: false });
          return;
        } catch {
          localStorage.removeItem(MOCK_USER_KEY);
        }
      }
      set({ user: null, session: null, loading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        set({
          session,
          user: {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            role: profile.role,
            createdAt: profile.created_at,
          },
          loading: false,
        });
      } else {
        set({ user: null, session: null, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }

    // Set up auth state change listener
    if (!isMockMode) {
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            set({
              session,
              user: {
                id: profile.id,
                email: profile.email,
                fullName: profile.full_name,
                avatarUrl: profile.avatar_url,
                role: profile.role,
                createdAt: profile.created_at,
              },
            });
          }
        } else {
          set({ user: null, session: null });
        }
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });

    if (isMockMode) {
      // Mock login implementation
      // Admin bypass: if email contains admin, login as admin, else regular member
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'member';
      const fullName = email.split('@')[0].toUpperCase();
      const mockUser: UserProfile = {
        id: role === 'admin' ? 'mock-admin-id' : 'mock-member-id',
        email,
        fullName: fullName.charAt(0) + fullName.slice(1).toLowerCase() + ' Member',
        role,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      set({ user: mockUser, session: { user: { id: mockUser.id, email } }, loading: false });
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profile) {
          set({
            session: data.session,
            user: {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              avatarUrl: profile.avatar_url,
              role: profile.role,
              createdAt: profile.created_at,
            },
            loading: false,
          });
          return true;
        }
      }
      set({ loading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  signup: async (email, fullName, role = 'member') => {
    set({ loading: true, error: null });

    if (isMockMode) {
      // Mock signup implementation
      const mockUser: UserProfile = {
        id: role === 'admin' ? 'mock-admin-id' : 'mock-member-id',
        email,
        fullName,
        role,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      set({ user: mockUser, session: { user: { id: mockUser.id, email } }, loading: false });
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'Password123!', // Simple standard password for signup demo purposes
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) throw error;
      set({ loading: false });
      return !!data.user;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });

    if (isMockMode) {
      localStorage.removeItem(MOCK_USER_KEY);
      set({ user: null, session: null, loading: false });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
