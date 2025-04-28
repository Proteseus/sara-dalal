import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProgressReport } from '../../api/progress';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const Progress: React.FC = () => {
  const { t } = useTranslation();
  const { authState } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getProgressReport(authState.user!.token);
      setReport(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load progress data');
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

  if (!report) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">
              {'No progress data available'}
            </h1>
            <Link to="/questionnaire">
              <Button>
                {t('progress.retry')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-gray-800">
            {t('progress.title')}
          </h1>
        </div>

        {/* Skin Type Changes */}
        <Card className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {t('progress.skinTypeChanges')}
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('progress.previous')}</p>
              <p className="text-lg font-medium">{report.skinType.previous}</p>
            </div>
            <div className="flex items-center">
              {report.skinType.changed ? (
                <TrendingUp className="text-primary w-6 h-6" />
              ) : (
                <div className="w-6 h-0.5 bg-gray-300" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('progress.current')}</p>
              <p className="text-lg font-medium">{report.skinType.current}</p>
            </div>
          </div>
        </Card>

        {/* Concerns Changes */}
        <Card className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {t('progress.concernChanges')}
          </h2>
          <div className="space-y-6">
            {/* Current Concerns */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">{t('progress.currentConcerns')}</h3>
              <div className="flex flex-wrap gap-2">
                {report.concerns.current.map((concern: string) => (
                  <span
                    key={concern}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {/* Removed Concerns */}
            {report.concerns.removed.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">{t('progress.resolvedConcerns')}</h3>
                <div className="flex flex-wrap gap-2">
                  {report.concerns.removed.map((concern: string) => (
                    <span
                      key={concern}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Lifestyle Changes */}
        <Card className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {t('progress.lifestyleChanges')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(report.lifestyleFactors).map(([factor, data]: [string, any]) => (
              <div
                key={factor}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800 capitalize">{factor}</h3>
                  {data.improved ? (
                    <ArrowUpRight className="text-green-500 w-5 h-5" />
                  ) : (
                    data.previous !== data.current && (
                      <ArrowDownRight className="text-red-500 w-5 h-5" />
                    )
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('progress.previous')}:</span>
                    <span className="font-medium">{data.previous}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('progress.current')}:</span>
                    <span className="font-medium">{data.current}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card>
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {t('progress.recommendations')}
          </h2>
          <div className="space-y-6">
            {/* Previous Lifestyle Recommendations */}
            {report.recommendations.previous.lifestyle.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  {t('progress.previousRecommendations')}
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.previous.lifestyle.map((rec: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-600"
                    >
                      <TrendingDown className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Current Lifestyle Recommendations */}
            {report.recommendations.current.lifestyle.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  {t('progress.currentRecommendations')}
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.current.lifestyle.map((rec: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-600"
                    >
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* New Recommendations */}
            {report.recommendations.new.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  {t('progress.newRecommendations')}
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.new.map((rec: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-600"
                    >
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Progress;