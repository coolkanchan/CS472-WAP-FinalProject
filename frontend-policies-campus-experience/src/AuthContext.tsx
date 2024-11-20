import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { IUser } from "./Types/IUser";

interface AuthState extends IUser {
  isAuth: boolean;
}

const initialState: AuthState = {
  isAuth: false,
  id: -1,
  name: "",
  email: "",
  password: "",
};

interface AuthContextType {
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            import.meta.env.VITE_API + "/auth/user",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();
          setState({
            isAuth: true,
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: "",
          });
        } catch (err) {
          console.error("Error fetching user details:", err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const { token, id } = await response.json();
      saveAccessToken(token);
      setState((prevState) => ({
        ...prevState,
        isAuth: true,
        id,
        name,
        email,
        password,
      }));
    } catch (err) {
      handleError(err);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API + "/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "signin failed");
      }

      const { id, name, token } = await response.json();
      saveAccessToken(token);
      setState({
        isAuth: true,
        id,
        name,
        email,
        password: "",
      });
    } catch (err) {
      handleError(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState(initialState);
  };

  const saveAccessToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  };

  return (
    <AuthContext.Provider value={{ state, setState, signup, signin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
