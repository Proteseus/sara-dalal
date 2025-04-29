import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Sun, Moon, Star, Clock, ChevronRight, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../api/dashboard';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { DashboardData } from '../types/dashboard';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await getDashboardData(authState.user!.token);
      setData(dashboardData);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">
              {error || 'Failed to load dashboard'}
            </h1>
            <Button onClick={fetchDashboardData}>
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-gray-800">
              {t('dashboard.title', { name: data?.user.firstName })}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <Link to="/questionnaire">
            <Button>
              {t('dashboard.updateAssessment')}
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.quickStats.activeRoutines')}</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <Calendar size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data?.routines.filter(r => r.isActive).length}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.quickStats.upcomingSteps')}</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <Clock size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data?.upcomingSteps.length}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.quickStats.recentUpdates')}</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <TrendingUp size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data?.recentResponses.length}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.quickStats.newRecommendations')}</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <Star size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data?.recentRecommendations.length}
            </p>
          </Card>
        </div>
        {/* Recent Recommendations */}
        <div className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-800">{t('dashboard.recentRecommendations.title')}</h2>
              <Link to="/routines">
                <Button variant="outline" size="sm">
                  {t('dashboard.recentRecommendations.viewAll')}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.recentRecommendations.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors"
                >
                  <h3 className="font-medium text-gray-800 mb-2">{product?.brand} {product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">﷼{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;