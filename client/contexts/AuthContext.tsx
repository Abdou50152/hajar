import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { UsersService } from '../services/users.service';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: false,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        // Vérifier d'abord si un token existe
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Aucun token d\'authentification trouvé');
          setLoading(false);
          return;
        }
        
        try {
          // Utiliser le service utilisateur pour récupérer le profil
          const userData = await UsersService.getUserProfile();
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        } catch (error) {
          console.log('Erreur lors de la récupération du profil:', error);
          // Si l'API échoue, essayer de récupérer l'utilisateur du localStorage
          const localUser = UsersService.getCurrentUser();
          if (localUser) {
            setUser(localUser);
            setIsAdmin(localUser.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await UsersService.login({ email, password });
      setUser(response.user);
      const isAdminUser = response.user.role === 'admin';
      setIsAdmin(isAdminUser);
      
      // Stocker le token dans un cookie pour la persistance entre les sessions
      setCookie('token', response.token, { maxAge: 60 * 60 * 24 * 7 }); // 7 jours
      
      // Rediriger vers l'interface d'administration si c'est un admin
      if (isAdminUser) {
        // Redirection vers l'interface d'administration
        window.location.href = UsersService.getAdminUrl();
      } else {
        // Redirection vers le profil utilisateur normal
        router.push('/profile');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    UsersService.logout();
    setUser(null);
    deleteCookie('token');
    router.push('/connexion');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);