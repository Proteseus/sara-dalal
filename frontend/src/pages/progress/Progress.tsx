import React, { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProgressReport, getProgressSummary } from '../../api/progress';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ProgressReport, ProgressSummary } from '../../types/progress';

const Progress: React.FC = () => {
  const { authState } = useAuth();
  const [report, setReport] = useState<ProgressReport | null>(null);
  const [summary, setSummary] = useState<ProgressSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const startDate = format(startOfMonth(subMonths(new Date(), 3)), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      const [reportData, summaryData] = await Promise.all([
        getProgressReport(authState.user!.token, startDate, endDate),
        getProgressSummary(authState.user!.token)
      ]);

      setReport(reportData);
      setSummary(summaryData);
      
      // Set the first metric as selected by default
      if (summaryData.length > 0 && Object.keys(summaryData[0].averages).length > 0) {
        setSelectedMetric(Object.keys(summaryData[0].averages)[0]);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load progress data');
      setIsLoading(false);
    }
  };

  const getMetricTrend = (metric: string): { value: number; isPositive: boolean } => {
    if (summary.length < 2) return { value: 0, isPositive: true };
    
    const currentMonth = summary[summary.length - 1].averages[metric] || 0;
    const previousMonth = summary[summary.length - 2].averages[metric] || 0;
    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    
    return {
      value: Math.abs(change),
      isPositive: change >= 0
    };
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-gray-800">
            Progress Tracking
          </h1>
          <div className="flex gap-4">
            <Button variant="outline">
              <Calendar size={20} className="mr-2" />
              Last 3 Months
            </Button>
            <Button>
              <TrendingUp size={20} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summary.length > 0 && Object.entries(summary[summary.length - 1].averages).map(([metric, value]) => {
            const trend = getMetricTrend(metric);
            return (
              <Card 
                key={metric}
                className={`cursor-pointer transition-all ${
                  selectedMetric === metric ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{metric}</h3>
                  <span className={`flex items-center text-sm ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? (
                      <ArrowUpRight size={16} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={16} className="mr-1" />
                    )}
                    {trend.value.toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-800">
                  {value.toFixed(1)}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Progress Chart */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-800">Progress Over Time</h2>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={summary}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {selectedMetric && (
                  <Line
                    type="monotone"
                    dataKey={`averages.${selectedMetric}`}
                    stroke="#FF69B4"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <h2 className="text-xl font-medium text-gray-800 mb-6">Progress Timeline</h2>
          <div className="space-y-6">
            {report?.timeline.map((entry) => (
              <div key={entry.date} className="border-l-2 border-primary pl-4">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="text-primary mr-2" />
                  <span className="font-medium text-gray-800">
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="space-y-2">
                  {entry.responses.map((response) => (
                    <div key={response.id} className="text-gray-600">
                      <span className="font-medium">{response.question.text}:</span>{' '}
                      {response.answer}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Progress;