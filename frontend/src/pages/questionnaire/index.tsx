import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSkinProfile } from '../../api/questionnaire';
import Initial from './Initial';
import Feedback from './Feedback';
import Layout from '../../components/layout/Layout';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!authState.isAuthenticated) {
        navigate('/login', { state: { from: '/questionnaire' } });
        return;
      }

      try {
        const profile = await getSkinProfile(authState.user!.token);
        console.log(profile);
        if (profile && profile.error === 'Skin profile not found') {
          setHasProfile(false);
        } else {
          setHasProfile(!!profile);
        }
      } catch (err) {
        setError('Failed to check skin profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [authState.isAuthenticated, authState.user?.token, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  // If user has a profile, show feedback questionnaire
  if (hasProfile) {
    return <Feedback />;
  }

  // If user doesn't have a profile, show initial questionnaire
  return <Initial />;
};

export default Questionnaire; 