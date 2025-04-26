import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Edit, ChevronRight, Droplets, Moon, Sun, Wind, Utensils, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, UserProfile } from '../api/profile';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Profile: React.FC = () => {
  const { authState } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await getUserProfile(authState.user!.token);
      setProfile(profileData);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load profile');
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

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">
              {error || 'Failed to load profile'}
            </h1>
            <Button onClick={fetchProfile}>
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <User size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/settings">
              <Button variant="outline">
                <Settings size={20} className="mr-2" />
                Settings
              </Button>
            </Link>
            <Link to="/questionnaire/initial">
              <Button>
                <Edit size={20} className="mr-2" />
                Update Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skin Profile */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-medium text-gray-800 mb-6">Skin Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Skin Type</h3>
                  <p className="text-gray-800 bg-secondary-light/50 px-4 py-2 rounded-lg inline-block">
                    {profile.skinProfile.skinType}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Concerns</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skinProfile.concerns.map((concern) => (
                      <span
                        key={concern}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skinProfile.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Current Routine</h3>
                  <p className="text-gray-600">{profile.skinProfile.currentRoutine}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Lifestyle Factors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Droplets size={20} className="text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Hydration</p>
                        <p className="font-medium">{profile.skinProfile.lifestyleFactors.hydration}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Moon size={20} className="text-indigo-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Sleep</p>
                        <p className="font-medium">{profile.skinProfile.lifestyleFactors.sleep}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Sun size={20} className="text-yellow-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Sun Exposure</p>
                        <p className="font-medium">{profile.skinProfile.lifestyleFactors.sunExposure}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Wind size={20} className="text-teal-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Environment</p>
                        <p className="font-medium">{profile.skinProfile.lifestyleFactors.environment}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Utensils size={20} className="text-orange-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Diet</p>
                        <p className="font-medium">{profile.skinProfile.lifestyleFactors.diet}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <div>
            <Card>
              <h2 className="text-xl font-medium text-gray-800 mb-6">Recommendations</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Immediate Actions</h3>
                  <ul className="space-y-2">
                    {profile.skinProfile.recommendations.immediate.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Lifestyle Changes</h3>
                  <ul className="space-y-2">
                    {profile.skinProfile.recommendations.lifestyle.map((change, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Recommended Products</h3>
                  <div className="space-y-4">
                    {profile.skinProfile.recommendations.products.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                          </div>
                          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                            {product.score ? `${Math.round(product.score * 100)}% Match` : 'No match score'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.keyIngredients.map((ingredient) => (
                            <span
                              key={ingredient}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-medium">
                            ${product.price}
                          </span>
                          <Button variant="outline" size="sm">
                            Learn More
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;