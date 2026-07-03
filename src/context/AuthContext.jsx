import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: 100,
    username: 'john_doe',
    password: 'password123',
    email: 'john.doe@gmail.com',
    name: { firstname: 'John', lastname: 'Doe' },
    phone: '1-570-236-7033',
    address: {
      city: 'New York',
      street: '8685 El Camino Real',
      number: 12,
      zipcode: '10001'
    }
  },
  {
    id: 101,
    username: 'johnd',
    password: 'm38rmF_',
    email: 'john@gmail.com',
    name: { firstname: 'John', lastname: 'D.' },
    phone: '1-570-236-7033',
    address: {
      city: 'Kilcoole',
      street: 'new road',
      number: 7832,
      zipcode: '12926-125'
    }
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Initialize users list and active session
  useEffect(() => {
    // Load all registered users
    const localUsers = localStorage.getItem('trendora_users');
    let loadedUsers = DEFAULT_USERS;
    if (localUsers) {
      loadedUsers = JSON.parse(localUsers);
    } else {
      localStorage.setItem('trendora_users', JSON.stringify(DEFAULT_USERS));
    }
    setUsers(loadedUsers);

    // Load current active session
    const currentUser = localStorage.getItem('trendora_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  // Register a new user locally
  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const existingUser = users.find(
            (u) => u.username.toLowerCase() === userData.username.toLowerCase() || u.email.toLowerCase() === userData.email.toLowerCase()
          );

          if (existingUser) {
            return reject(new Error('Username or Email already exists.'));
          }

          const newUser = {
            id: Date.now(),
            username: userData.username,
            password: userData.password,
            email: userData.email,
            name: {
              firstname: userData.firstname,
              lastname: userData.lastname,
            },
            phone: userData.phone || '',
            address: {
              city: userData.city || '',
              street: userData.street || '',
              number: parseInt(userData.number) || 0,
              zipcode: userData.zipcode || '',
            },
            orderHistory: []
          };

          const updatedUsers = [...users, newUser];
          setUsers(updatedUsers);
          localStorage.setItem('trendora_users', JSON.stringify(updatedUsers));
          resolve(newUser);
        } catch (error) {
          reject(new Error('Failed to register user.'));
        }
      }, 800);
    });
  };

  // Login handler
  const login = async (username, password) => {
    setLoading(true);
    try {
      // 1. First search local storage registered users
      const matchedUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (matchedUser) {
        setUser(matchedUser);
        localStorage.setItem('trendora_current_user', JSON.stringify(matchedUser));
        setLoading(false);
        return matchedUser;
      }

      // 2. Fall back to Fake Store API call (for fake store accounts)
      try {
        const authData = await api.login(username, password);
        if (authData && authData.token) {
          // Token is mock, but represents successful login
          // Fetch user profiles from api to find the one matching
          const apiUsers = await api.getUsers();
          const matchedApiUser = apiUsers.find((u) => u.username === username);

          if (matchedApiUser) {
            // Store matching api user locally
            const cleanUser = {
              ...matchedApiUser,
              password, // store password locally for persistence matching
              orderHistory: []
            };
            
            setUser(cleanUser);
            localStorage.setItem('trendora_current_user', JSON.stringify(cleanUser));

            // Save to local users database if not present
            if (!users.find((u) => u.username === username)) {
              const updatedUsers = [...users, cleanUser];
              setUsers(updatedUsers);
              localStorage.setItem('trendora_users', JSON.stringify(updatedUsers));
            }
            
            setLoading(false);
            return cleanUser;
          }
        }
      } catch (apiErr) {
        console.error('API login fallback failed:', apiErr);
      }

      throw new Error('Invalid username or password.');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('trendora_current_user');
  };

  // Update profile handler
  const updateProfile = (updatedProfile) => {
    const updatedUser = { ...user, ...updatedProfile };
    setUser(updatedUser);
    localStorage.setItem('trendora_current_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem('trendora_users', JSON.stringify(updatedUsers));
  };

  // Add order to history
  const addOrderToHistory = (order) => {
    const updatedUser = {
      ...user,
      orderHistory: [order, ...(user.orderHistory || [])]
    };
    setUser(updatedUser);
    localStorage.setItem('trendora_current_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem('trendora_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, addOrderToHistory }}>
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
