import React from 'react';
import Layout from '../components/layout/Layout';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString();

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-6">
              {t('privacy.title')}
            </h1>
            
            <div className="mb-8">
              <p className="text-gray-600">
                {t('privacy.lastUpdated', { date: currentDate })}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.informationCollection.title')}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t('privacy.sections.informationCollection.description')}
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  {(t('privacy.sections.informationCollection.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.informationUsage.title')}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t('privacy.sections.informationUsage.description')}
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  {(t('privacy.sections.informationUsage.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.dataSecurity.title')}
                </h2>
                <p className="text-gray-600">
                  {t('privacy.sections.dataSecurity.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.medicalData.title')}
                </h2>
                <p className="text-gray-600">
                  {t('privacy.sections.medicalData.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.thirdParty.title')}
                </h2>
                <p className="text-gray-600">
                  {t('privacy.sections.thirdParty.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.policyChanges.title')}
                </h2>
                <p className="text-gray-600">
                  {t('privacy.sections.policyChanges.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('privacy.sections.contact.title')}
                </h2>
                <p className="text-gray-600">
                  {t('privacy.sections.contact.description')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy; 