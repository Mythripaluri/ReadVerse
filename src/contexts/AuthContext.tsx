import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authAPI } from "@/services/api";

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        // Handle different user data structures
        setUser({
          id: parsedUser._id || parsedUser.id,
          _id: parsedUser._id,
          name: parsedUser.name,
          email: parsedUser.email,
        });
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.signUp({ name, email, password });

      if (response.success) {
        const userData = {
          id: response.data._id,
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        };

        setUser(userData);
        setToken(response.data.token);

        return { error: null };
      } else {
        return { error: response.message || "Signup failed" };
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Signup failed",
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.signIn({ email, password });

      if (response.success) {
        const userData = {
          id: response.data._id,
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        };

        setUser(userData);
        setToken(response.data.token);

        return { error: null };
      } else {
        return { error: response.message || "Login failed" };
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Login failed" };
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    authAPI.signOut(); // This handles localStorage cleanup
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signUp, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
