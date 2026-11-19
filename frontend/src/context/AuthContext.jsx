import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  EMPLOYEE: 'employee',
  HR_STAFF: 'hr_staff',
  HR_ADMIN: 'hr_admin',
};

export const ROLE_LABELS = {
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.HR_STAFF]: 'HR Staff',
  [ROLES.HR_ADMIN]: 'HR Admin',
};

const STORAGE_KEY = 'nirnaya_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved auth', e);
    }
    // Default to HR Staff for quick hackathon demo exploration
    return {
      username: 'hr_user',
      role: ROLES.HR_STAFF,
      name: 'Aditi Sharma',
      department: 'Human Resources'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (role, username = '') => {
    let name = 'User';
    let dept = 'Engineering';

    if (role === ROLES.EMPLOYEE) {
      name = username ? username : 'Rahul Verma';
      dept = 'Engineering';
    } else if (role === ROLES.HR_STAFF) {
      name = username ? username : 'Aditi Sharma';
      dept = 'Human Resources';
    } else if (role === ROLES.HR_ADMIN) {
      name = username ? username : 'Vikram Malhotra';
      dept = 'People Operations';
    }

    const newUser = {
      username: username || `${role}_user`,
      role,
      name,
      department: dept
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const canAccess = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  };

  const isEmployee = user?.role === ROLES.EMPLOYEE;
  const isHRStaff = user?.role === ROLES.HR_STAFF;
  const isHRAdmin = user?.role === ROLES.HR_ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        role: user?.role,
        login,
        logout,
        canAccess,
        isEmployee,
        isHRStaff,
        isHRAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
