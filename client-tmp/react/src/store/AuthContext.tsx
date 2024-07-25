import {
  createContext,
  useState,
  useContext,
  ReactNode,
  FunctionComponent,
} from 'react';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  checkAuthStatus: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  authorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    const isUserAuthenticated = await authService.isUserAuthenticated();

    if (isUserAuthenticated) {
      const user = {
        authorized: isUserAuthenticated,
      };

      setUser(user);
    }
  };



  const value = { user, setUser, checkAuthStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
