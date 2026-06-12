import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'gerente' | 'agente';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerUser: (email: string, pass: string, name: string, rol: 'admin' | 'gerente' | 'agente') => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session and users database
    const session = localStorage.getItem('movi_session');
    const existingUsers = localStorage.getItem('movi_users');

    if (!existingUsers) {
      // Seed default admin user and additional agents
      const defaultUsers = [
        {
          id: 'admin-cc',
          email: 'ccjimenez@jiro.com.mx',
          password: 'Movi2024!',
          nombre: 'Carlos C. Jiménez',
          rol: 'admin',
        },
        {
          id: 'agent-mariela',
          email: 'mariela@jiro.com.mx',
          password: 'Movi2024!',
          nombre: 'Mariela Rodríguez',
          rol: 'agente',
        },
      ];
      localStorage.setItem('movi_users', JSON.stringify(defaultUsers));
    }

    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('movi_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const usersStr = localStorage.getItem('movi_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const found = users.find(
        (u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === pass
      );

      if (found) {
        const sessionUser: User = {
          id: found.id,
          email: found.email,
          nombre: found.nombre,
          rol: found.rol,
        };
        localStorage.setItem('movi_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales inválidas. Por favor verifique correo y contraseña.' };
      }
    } catch (e) {
      return { success: false, error: 'Error durante el inicio de sesión.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('movi_session');
    setUser(null);
  };

  const registerUser = async (email: string, pass: string, name: string, rol: 'admin' | 'gerente' | 'agente') => {
    try {
      const usersStr = localStorage.getItem('movi_users');
      let users = usersStr ? JSON.parse(usersStr) : [];

      const exists = users.some((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
      if (exists) {
        return { success: false, error: 'El usuario ya se encuentra registrado.' };
      }

      const newUser = {
        id: 'user-' + Date.now().toString(36),
        email: email.toLowerCase().trim(),
        password: pass,
        nombre: name,
        rol: rol,
      };

      users.push(newUser);
      localStorage.setItem('movi_users', JSON.stringify(users));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Error al registrar el usuario.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerUser }}>
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
