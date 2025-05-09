import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/images/logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };

  return (
    <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Dalal Logo" className="h-8 w-auto" />
            <span className="font-serif text-2xl font-semibold text-primary">Dalal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {authState.isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors px-3 py-2">
                  {t('nav.dashboard')}
                </Link>
                <Link to="/routines" className="text-gray-600 hover:text-primary transition-colors px-3 py-2">
                  {t('nav.routines')}
                </Link>
                <Link to="/questionnaire" className="text-gray-600 hover:text-primary transition-colors px-3 py-2">
                  {t('nav.assessment')}
                </Link>
                <Link to="/progress" className="text-gray-600 hover:text-primary transition-colors px-3 py-2">
                  {t('nav.progress')}
                </Link>
                <div className="relative group ml-4">
                  <button className="flex items-center text-gray-600 hover:text-primary transition-colors">
                    <span className="mr-1">{authState.user?.firstName}</span>
                    <User size={18} />
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-xl shadow-soft invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary-light hover:text-primary transition-colors">
                      {t('nav.profile')}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-secondary-light hover:text-primary transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">{t('nav.signUp')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            >
              <span className="sr-only">
                {isMenuOpen ? t('nav.menu.close') : t('nav.menu.open')}
              </span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {authState.isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary-light transition-colors"
                  onClick={closeMenu}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/routines"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary-light transition-colors"
                  onClick={closeMenu}
                >
                  {t('nav.routines')}
                </Link>
                <Link
                  to="/questionnaire"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary-light transition-colors"
                  onClick={closeMenu}
                >
                  {t('nav.assessment')}
                </Link>
                <Link
                  to="/progress"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary-light transition-colors"
                  onClick={closeMenu}
                >
                  {t('nav.progress')}
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary-light transition-colors"
                  onClick={closeMenu}
                >
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary-light transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" fullWidth>{t('nav.login')}</Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button fullWidth>{t('nav.signUp')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;