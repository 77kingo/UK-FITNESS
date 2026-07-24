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
  signup: (email: string, password: string, fullName: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Key for mock session storage
const MOCK_USER_KEY = 'uk_fitness_mock_user';

// Helper function to get or create profile on session load (fallback self-healing)
const getOrCreateProfile = async (session: any): Promise<UserProfile> => {
  const fallbackName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Gym Member';
  const fallbackRole = session.user.user_metadata?.role || 'member';

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (!error && profile) {
      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        role: profile.role,
        createdAt: profile.created_at,
      };
    }

    // Try to auto-create the row if missing
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        email: session.user.email,
        full_name: fallbackName,
        role: fallbackRole,
      })
      .select('*')
      .maybeSingle();

    if (!insertError && newProfile) {
      return {
        id: newProfile.id,
        email: newProfile.email,
        fullName: newProfile.full_name,
        avatarUrl: newProfile.avatar_url,
        role: newProfile.role,
        createdAt: newProfile.created_at,
      };
    }
  } catch (e) {
    console.error('Failed to get/create profile:', e);
  }

  // Graceful fallback to avoid locking the UI if database triggers lag
  return {
    id: session.user.id,
    email: session.user.email || '',
    fullName: fallbackName,
    role: fallbackRole,
    createdAt: new Date().toISOString(),
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true, error: null });

    if (isMockMode) {
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
        const userProfile = await getOrCreateProfile(session);
        set({
          session,
          user: userProfile,
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
          const userProfile = await getOrCreateProfile(session);
          set({
            session,
            user: userProfile,
          });
        } else {
          set({ user: null, session: null });
        }
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });

    if (isMockMode) {
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
        const userProfile = await getOrCreateProfile(data.session);
        set({
          session: data.session,
          user: userProfile,
          loading: false,
        });
        return true;
      }
      set({ loading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  signup: async (email, password, fullName, role = 'member') => {
    set({ loading: true, error: null });

    if (isMockMode) {
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
        password,
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
