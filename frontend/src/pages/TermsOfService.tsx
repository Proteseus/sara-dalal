import React from 'react';
import Layout from '../components/layout/Layout';

const TermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-6">
              Terms of Service
            </h1>
            
            <div className="mb-8">
              <p className="text-gray-600">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600">
                  By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Medical Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  The recommendations and information provided by this application are for informational purposes only and are not intended as medical advice. The content is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
                <p className="text-gray-600">
                  Never disregard professional medical advice or delay in seeking it because of something you have read or received through this application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. User Responsibility
                </h2>
                <p className="text-gray-600">
                  You acknowledge that you are solely responsible for your use of this application and any decisions or actions you take based on the information provided. We shall not be liable for any direct, indirect, incidental, consequential, or exemplary damages resulting from your use of this application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Limitation of Liability
                </h2>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, we disclaim all liability for any loss, damage, or injury resulting from your use of this application. This includes, but is not limited to, any errors or omissions in the content, any loss or damage of any kind incurred as a result of the use of any content posted, transmitted, or otherwise made available via the application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Changes to Terms
                </h2>
                <p className="text-gray-600">
                  We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last Updated" date of these terms. Your continued use of the application following the posting of revised terms means that you accept and agree to the changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Contact Information
                </h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at support@dalal.com.
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