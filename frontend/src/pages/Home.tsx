import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Clock, Heart } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-light via-background to-primary-light">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Your Personalized <span className="text-primary">Skincare</span> Journey Starts Here
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Discover custom skincare routines tailored specifically to your skin's unique needs and concerns.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register">
                  <Button size="lg">
                    Get Started <ChevronRight size={18} className="ml-1" />
                  </Button>
                </Link>
                <Link to="/questionnaire/initial">
                  <Button variant="outline" size="lg">
                    Take Skin Quiz
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3762892/pexels-photo-3762892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
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
            <h2 className="font-serif text-3xl font-semibold text-gray-800">How Dalal Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get personalized skincare routines in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Complete Assessment</h3>
              <p className="text-gray-600">
                Answer questions about your skin type, concerns, and lifestyle factors to help us understand your unique needs.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Get Personalized Routines</h3>
              <p className="text-gray-600">
                Receive custom morning and evening skincare routines with product recommendations tailored to your skin profile.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your skin's improvement over time and receive updated recommendations as your skin evolves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-secondary-light to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-semibold text-gray-800">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600">
              Real results from real people
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
                "After struggling with acne for years, Dalal created a routine that actually works for me. My skin is clearer than it's been in a decade!"
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Sarah M." 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">Sarah M.</p>
                  <p className="text-sm text-gray-500">Customer for 6 months</p>
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
                "The personalized recommendations have saved me so much money on products that weren't right for my skin type. My redness is gone and my skin has never looked better!"
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Jessica K." 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">Jessica K.</p>
                  <p className="text-sm text-gray-500">Customer for 1 year</p>
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
                "As someone with sensitive skin, finding products that don't cause irritation has been challenging. Dalal recommended gentle products that have transformed my skin!"
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Michael T." 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">Michael T.</p>
                  <p className="text-sm text-gray-500">Customer for 3 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">Ready to Transform Your Skincare Routine?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of users who have discovered their perfect skincare routine with Dalal.
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-secondary text-background hover:bg-primary focus:ring-white"
            >
              Start Your Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;