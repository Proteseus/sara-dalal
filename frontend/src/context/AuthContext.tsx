import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { loginUser, registerUser } from '../api/auth';

enum AuthActionType {
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  REGISTER_START = 'REGISTER_START',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',
  CLEAR_ERROR = 'CLEAR_ERROR',
}

type AuthAction =
  | { type: AuthActionType.LOGIN_START }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: AuthState['user'] }
  | { type: AuthActionType.LOGIN_FAILURE; payload: string }
  | { type: AuthActionType.REGISTER_START }
  | { type: AuthActionType.REGISTER_SUCCESS; payload: AuthState['user'] }
  | { type: AuthActionType.REGISTER_FAILURE; payload: string }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.CLEAR_ERROR };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.LOGIN_START:
    case AuthActionType.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthActionType.LOGIN_SUCCESS:
    case AuthActionType.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AuthActionType.LOGIN_FAILURE:
    case AuthActionType.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case AuthActionType.LOGOUT:
      return {
        ...initialState,
      };
    case AuthActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Check for stored user data on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: AuthActionType.LOGIN_START });
    try {
      const user = await loginUser(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: user });
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: AuthActionType.LOGIN_FAILURE, payload: errorMessage });
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: AuthActionType.REGISTER_START });
    try {
      const user = await registerUser(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: AuthActionType.REGISTER_SUCCESS, payload: user });
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: AuthActionType.REGISTER_FAILURE, payload: errorMessage });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: AuthActionType.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AuthActionType.CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};