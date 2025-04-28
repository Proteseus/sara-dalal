import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { authState, login, clearError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  // Form validation
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t('auth.login.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.login.validation.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.login.validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.login.validation.passwordLength');
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
      await login(formData);
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
            <h1 className="font-serif text-3xl font-semibold text-gray-800">{t('auth.login.title')}</h1>
            <p className="mt-2 text-gray-600">{t('auth.login.subtitle')}</p>
          </div>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            {authState.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">
                {authState.error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('auth.login.email')}
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={20} className="text-gray-500" />}
                required
              />
              
              <Input
                label={t('auth.login.password')}
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder={t('auth.login.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={20} className="text-gray-500" />}
                required
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {t('auth.login.rememberMe')}
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
                    {t('auth.login.forgotPassword')}
                  </a>
                </div>
              </div>
              
              <Button
                type="submit"
                fullWidth
                isLoading={authState.isLoading}
              >
                {t('auth.login.signIn')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.login.noAccount')}{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  {t('auth.login.signUp')}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;