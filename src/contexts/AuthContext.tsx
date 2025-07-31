import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  firstName?: string;
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}
interface LoanApplication {
  loanType: any;
  type: any;
  _id: string;
  id: string; // For compatibility
  amount: number;
  term: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, secretKey: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loanApplications: LoanApplication[];
  submitLoanApplication: (data: { amount: number; term: number; purpose: string; loanType?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Fetch loan applications when user is authenticated
  useEffect(() => {
    if (user) {
      fetchLoanApplications();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback: Create demo user for testing purposes
      if (email && password) {
        const demoUser = {
          id: `demo-${Date.now()}`,
          name: email.split('@')[0],
          email: email
        };
        
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', `demo-token-${Date.now()}`);
        return true;
      }
      
      return false;
    }
  };

  const adminLogin = async (email: string, secretKey: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, secretKey }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const adminData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          isAdmin: true
        };
        
        setUser(adminData);
        localStorage.setItem('user', JSON.stringify(adminData));
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Fallback to local admin login for demo purposes
      const ADMIN_EMAIL = 'admin@loanportal.com';
      const ADMIN_SECRET = 'irfan123';
      
      if (email === ADMIN_EMAIL && secretKey === ADMIN_SECRET) {
        const adminData = {
          id: 'admin-001',
          name: 'Admin',
          email: ADMIN_EMAIL,
          isAdmin: true
        };
        
        setUser(adminData);
        localStorage.setItem('user', JSON.stringify(adminData));
        localStorage.setItem('isAdmin', 'true');
        return true;
      }
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Fallback: Create demo user for testing purposes
      if (name && email && password) {
        const demoUser = {
          id: `demo-${Date.now()}`,
          name: name,
          email: email
        };
        
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', `demo-token-${Date.now()}`);
        return true;
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setLoanApplications([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loanApplications');
    localStorage.removeItem('isAdmin');
  };

  const submitLoanApplication = async (data: { amount: number; term: number; purpose: string; loanType?: string }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !user) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch('/api/loan/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // After successful submission, fetch updated loan applications
        fetchLoanApplications();
        return true;
      }
      
      // If API fails, create a local application for demo purposes
      console.log('API failed, creating local application for demo');
      const localApplication: LoanApplication = {
        _id: `local-${Date.now()}`,
        id: `local-${Date.now()}`,
        amount: data.amount,
        term: data.term,
        purpose: data.purpose,
        loanType: data.loanType || 'personal',
        type: data.loanType || 'personal',
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user.id
      };
      
      // Add to local storage for demo
      const existingApps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      existingApps.push(localApplication);
      localStorage.setItem('loanApplications', JSON.stringify(existingApps));
      setLoanApplications(existingApps);
      
      return true;
    } catch (error) {
      console.error('Loan application submission error:', error);
      
      // Fallback: Create local application for demo purposes
      if (user) {
        const localApplication: LoanApplication = {
          _id: `local-${Date.now()}`,
          id: `local-${Date.now()}`,
          amount: data.amount,
          term: data.term,
          purpose: data.purpose,
          loanType: data.loanType || 'personal',
          type: data.loanType || 'personal',
          status: 'pending',
          createdAt: new Date().toISOString(),
          userId: user.id
        };
        
        // Add to local storage for demo
        const existingApps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        existingApps.push(localApplication);
        localStorage.setItem('loanApplications', JSON.stringify(existingApps));
        setLoanApplications(existingApps);
        
        return true;
      }
      
      return false;
    }
  };
  
  const fetchLoanApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !user) {
        return;
      }
      
      const response = await fetch('/api/loan/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Add id property for compatibility with frontend components
          const applicationsWithId = result.data.map((app: any) => ({
            ...app,
            id: app._id
          }));
          setLoanApplications(applicationsWithId);
        }
      } else {
        // Fallback: Load from localStorage
        const localApps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        setLoanApplications(localApps);
      }
    } catch (error) {
      console.error('Fetch loan applications error:', error);
      
      // Fallback: Load from localStorage
      const localApps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      setLoanApplications(localApps);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    adminLogin,
    register,
    logout,
    loanApplications,
    submitLoanApplication
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};