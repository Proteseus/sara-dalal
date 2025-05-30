import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
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
      newErrors.firstName = t('auth.register.validation.firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('auth.register.validation.lastNameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('auth.register.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.register.validation.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.register.validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.register.validation.passwordLength');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.validation.passwordsMatch');
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
            <h1 className="font-serif text-3xl font-semibold text-gray-800">{t('auth.register.title')}</h1>
            <p className="mt-2 text-gray-600">{t('auth.register.subtitle')}</p>
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
                  label={t('auth.register.firstName')}
                  type="text"
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder={t('auth.register.firstNamePlaceholder')}
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  icon={<User size={20} className="text-gray-500" />}
                  required
                />
                
                <Input
                  label={t('auth.register.lastName')}
                  type="text"
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder={t('auth.register.lastNamePlaceholder')}
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  icon={<User size={20} className="text-gray-500" />}
                  required
                />
              </div>
              
              <Input
                label={t('auth.register.email')}
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={20} className="text-gray-500" />}
                required
              />
              
              <Input
                label={t('auth.register.password')}
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={20} className="text-gray-500" />}
                required
              />
              
              <Input
                label={t('auth.register.confirmPassword')}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
                    {t('auth.register.terms')}{' '}
                    <a href="/terms" className="font-medium text-primary hover:text-primary-dark transition-colors">
                      {t('auth.register.termsLink')}
                    </a>{' '}
                    {t('auth.register.and')}{' '}
                    <a href="/privacy" className="font-medium text-primary hover:text-primary-dark transition-colors">
                      {t('auth.register.privacyLink')}
                    </a>
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="disclaimer"
                    name="disclaimer"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="disclaimer" className="text-gray-600">
                    {t('auth.register.disclaimer')}
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={authState.isLoading}
              >
                {t('auth.register.createAccount')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.register.hasAccount')}{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  {t('auth.register.signIn')}
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