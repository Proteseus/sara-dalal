import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-6">
              Privacy Policy
            </h1>
            
            <div className="mb-8">
              <p className="text-gray-600">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-600 mb-4">
                  We collect information that you provide directly to us, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Personal information (name, email address)</li>
                  <li>Health-related information you choose to share</li>
                  <li>Usage data and preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-4">
                  We use the collected information to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Personalize your experience</li>
                  <li>Communicate with you about our services</li>
                  <li>Ensure the security of our application</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Data Security
                </h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Medical Data Disclaimer
                </h2>
                <p className="text-gray-600">
                  While we take measures to protect your health-related information, we cannot guarantee the security of medical data transmitted through our application. You acknowledge that any health-related information you choose to share is done at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Third-Party Services
                </h2>
                <p className="text-gray-600">
                  Our application may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Changes to Privacy Policy
                </h2>
                <p className="text-gray-600">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  7. Contact Us
                </h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at privacy@dalal.com.
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