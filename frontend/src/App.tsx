import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Initial from './pages/questionnaire/Initial';
import RoutineList from './pages/routines/RoutineList';
import RoutineDetails from './pages/routines/RoutineDetails';
import CreateRoutine from './pages/routines/CreateRoutine';
import Progress from './pages/progress/Progress';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return authState.isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="/questionnaire/initial" element={<Initial />} />
      
      {/* Protected Routine Routes */}
      <Route 
        path="/routines" 
        element={
          <ProtectedRoute>
            <RoutineList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/routines/create" 
        element={
          <ProtectedRoute>
            <CreateRoutine />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/routines/:id" 
        element={
          <ProtectedRoute>
            <RoutineDetails />
          </ProtectedRoute>
        } 
      />
      
      {/* Progress Route */}
      <Route 
        path="/progress" 
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App