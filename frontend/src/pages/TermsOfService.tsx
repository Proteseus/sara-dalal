import React from 'react';
import Layout from '../components/layout/Layout';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString();

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-6">
              {t('terms.title')}
            </h1>
            
            <div className="mb-8">
              <p className="text-gray-600">
                {t('terms.lastUpdated', { date: currentDate })}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('terms.sections.acceptance.title')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.sections.acceptance.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('terms.sections.medicalDisclaimer.title')}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t('terms.sections.medicalDisclaimer.description')}
                </p>
                <p className="text-gray-600">
                  {t('terms.sections.medicalDisclaimer.additional')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('terms.sections.userResponsibility.title')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.sections.userResponsibility.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('terms.sections.liability.title')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.sections.liability.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('terms.sections.changes.title')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.sections.changes.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('terms.sections.contact.title')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.sections.contact.description')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService; 