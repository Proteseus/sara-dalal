import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Clock, Heart } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-light via-background to-primary-light">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                {t('home.hero.subtitle')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register">
                  <Button size="lg">
                    {t('home.hero.getStarted')} <ChevronRight size={18} className="ml-1" />
                  </Button>
                </Link>
                <Link to="/questionnaire">
                  <Button variant="outline" size="lg">
                    {t('home.hero.takeQuiz')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://static1.squarespace.com/static/5c4f037236099b8a1c70e3bd/5c5058f0b8a045c91dc0cc65/5e73a73b4201be4501226750/1584904237026/Screenshot+2020-03-22+at+16.08.22.png?format=1500w" 
                alt="Skincare Products" 
                className="w-full h-auto rounded-2xl shadow-soft"
              />
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent-light/30 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-primary-light/20 rounded-full filter blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-semibold text-gray-800">{t('home.features.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('home.features.step1.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.step1.description')}
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('home.features.step2.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.step2.description')}
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('home.features.step3.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-secondary-light to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-semibold text-gray-800">{t('home.testimonials.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="italic text-gray-600 mb-6">
                {t('home.testimonials.testimonial1.text')}
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt={t('home.testimonials.testimonial1.name')} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{t('home.testimonials.testimonial1.name')}</p>
                  <p className="text-sm text-gray-500">{t('home.testimonials.testimonial1.duration')}</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="italic text-gray-600 mb-6">
                {t('home.testimonials.testimonial2.text')}
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt={t('home.testimonials.testimonial2.name')} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{t('home.testimonials.testimonial2.name')}</p>
                  <p className="text-sm text-gray-500">{t('home.testimonials.testimonial2.duration')}</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="italic text-gray-600 mb-6">
                {t('home.testimonials.testimonial3.text')}
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt={t('home.testimonials.testimonial3.name')} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{t('home.testimonials.testimonial3.name')}</p>
                  <p className="text-sm text-gray-500">{t('home.testimonials.testimonial3.duration')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">{t('home.cta.title')}</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-secondary text-background hover:bg-primary focus:ring-white"
            >
              {t('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;