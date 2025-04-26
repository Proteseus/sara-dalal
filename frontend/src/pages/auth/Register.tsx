import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { authState, register, clearError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Form validation
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearError();
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    }
  };
  
  // Redirect if already authenticated
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-semibold text-gray-800">Create Account</h1>
            <p className="mt-2 text-gray-600">Sign up to get personalized skincare routines</p>
          </div>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            {authState.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">
                {authState.error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  type="text"
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  icon={<User size={20} className="text-gray-500" />}
                  required
                />
                
                <Input
                  label="Last Name"
                  type="text"
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  icon={<User size={20} className="text-gray-500" />}
                  required
                />
              </div>
              
              <Input
                label="Email"
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={20} className="text-gray-500" />}
                required
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={20} className="text-gray-500" />}
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<Lock size={20} className="text-gray-500" />}
                required
              />
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              
              <Button
                type="submit"
                fullWidth
                isLoading={authState.isLoading}
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;