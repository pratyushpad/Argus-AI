"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

export interface User {
  name: string;
  email: string;
  avatar: string;
  mode: "google" | "guest";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signInAsGuest: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signInWithGoogle: () => {},
  signInAsGuest: () => {},
  signOut: () => {},
});

const GUEST_STORAGE_KEY = "argus_guest";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [guestUser, setGuestUser] = useState<User | null>(null);
  const [guestLoaded, setGuestLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) setGuestUser(JSON.parse(stored));
    } catch {}
    setGuestLoaded(true);
  }, []);

  const googleUser: User | null = session?.user
    ? {
        name: session.user.name ?? "Google User",
        email: session.user.email ?? "",
        avatar: session.user.image ?? "",
        mode: "google",
      }
    : null;

  const isLoading = status === "loading" || !guestLoaded;
  const user = googleUser ?? guestUser;

  const signInWithGoogle = useCallback(() => {
    nextAuthSignIn("google", { callbackUrl: "/auth/welcome" });
  }, []);

  const signInAsGuest = useCallback(() => {
    const guest: User = {
      name: "Guest Operator",
      email: "guest@local.workspace",
      avatar: "",
      mode: "guest",
    };
    setGuestUser(guest);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
  }, []);

  const signOut = useCallback(() => {
    if (googleUser) {
      nextAuthSignOut({ callbackUrl: "/auth/login" });
    } else {
      setGuestUser(null);
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
  }, [googleUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
