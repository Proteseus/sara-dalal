import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Sun, Moon, Star, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../api/dashboard';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { DashboardData } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              Welcome back, {data.user.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your skincare journey
            </p>
          </div>
          <Link to="/questionnaire/initial">
            <Button>
              Update Assessment
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Routines</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <Calendar size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data.routines.filter(r => r.isActive).length}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Upcoming Steps</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <Clock size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data.upcomingSteps.length}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Recent Updates</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <TrendingUp size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data.recentResponses.length}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">New Recommendations</h3>
              <span className="p-2 bg-primary/10 rounded-full">
                <Star size={20} className="text-primary" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              {data.recentRecommendations.length}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-800">Progress Overview</h2>
                <Link to="/progress" className="text-primary hover:text-primary-dark transition-colors">
                  View Details
                </Link>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.progress.summary}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {Object.keys(data.progress.summary[0]?.averages || {}).map((metric, index) => (
                      <Line
                        key={metric}
                        type="monotone"
                        dataKey={`averages.${metric}`}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Upcoming Steps */}
          <div>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-800">Today's Steps</h2>
                <Link to="/routines" className="text-primary hover:text-primary-dark transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {data.upcomingSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-start p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors"
                  >
                    <span className="p-2 bg-primary/10 rounded-full mr-4">
                      {step.time.toLowerCase().includes('morning') ? (
                        <Sun size={20} className="text-yellow-500" />
                      ) : (
                        <Moon size={20} className="text-indigo-500" />
                      )}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-800">{step.product.name}</h3>
                      <p className="text-sm text-gray-600">{step.notes}</p>
                      <Link
                        to={`/routines/${step.routineId}`}
                        className="text-sm text-primary hover:text-primary-dark transition-colors inline-flex items-center mt-2"
                      >
                        {step.routineName}
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Recommendations */}
        <div className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-800">Recent Recommendations</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.recentRecommendations.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors"
                >
                  <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">${product.price}</span>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
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