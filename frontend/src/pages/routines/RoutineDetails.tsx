import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sun, Moon, GripVertical, Plus, Trash2, Save, ChevronDown, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoutineById, updateRoutine } from '../../api/routines';
import { submitRoutineFeedback } from '../../api/feedback';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import RoutineFeedbackForm from '../../components/feedback/RoutineFeedbackForm';
import { Routine, RoutineStep, StepAlternative, RoutineFeedback } from '../../types/skincare';
import { StarIcon } from '@heroicons/react/24/solid';

const RoutineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);
  const [expandedAlternatives, setExpandedAlternatives] = useState<Record<number, boolean>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchRoutine();
  }, [id]);

  const fetchRoutine = async () => {
    if (!id) return;
    try {
      const fetchedRoutine = await getRoutineById(id, authState.user!.token);
      setRoutine(fetchedRoutine);
      setEditedName(fetchedRoutine.name);
      setSteps(fetchedRoutine.steps);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load routine');
      setIsLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedStep(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedStep === null) return;

    const newSteps = [...steps];
    const draggedItem = newSteps[draggedStep];
    newSteps.splice(draggedStep, 1);
    newSteps.splice(index, 0, draggedItem);

    // Update order numbers
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });

    setSteps(newSteps);
    setDraggedStep(index);
  };

  const handleDragEnd = () => {
    setDraggedStep(null);
  };

  const handleSave = async () => {
    if (!routine) return;

    setIsSaving(true);
    try {
      const updatedRoutine = await updateRoutine(
        routine.id.toString(),
        {
          ...routine,
          name: editedName,
          steps: steps,
        },
        authState.user!.token
      );
      setRoutine(updatedRoutine);
      setSteps(updatedRoutine.steps);
      setError(null);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStep = (stepId: number) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    // Update order numbers
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });
    setSteps(newSteps);
  };

  const toggleAlternatives = (stepId: number) => {
    setExpandedAlternatives(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleRating = async (productId: number, rating: number) => {
    try {
      const response = await fetch('/api/products/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId.toString(), rating }),
      });

      if (response.ok) {
        setRatings(prev => ({ ...prev, [productId]: rating }));
      }
    } catch (error) {
      console.error('Error rating product:', error);
    }
  };

  const handleFeedbackSubmit = async (feedback: {
    satisfaction: 'Very satisfied' | 'Satisfied' | 'Neutral' | 'Unsatisfied' | 'Very unsatisfied';
    skinChanges: boolean;
    easeOfUse: 'Yes' | 'Somewhat' | 'No';
    unnecessaryProductId?: number;
    primaryConcern: string;
    routinePreference: 'Keep the same routine' | 'Make small adjustments' | 'Start a new routine';
  }) => {
    if (!routine || !authState.user) return;

    try {
      const feedbackData: Omit<RoutineFeedback, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        routineId: routine.id,
        ...feedback
      };
      await submitRoutineFeedback(feedbackData, authState.user.token);
      setShowFeedbackForm(false);
    } catch (err) {
      setError('Failed to submit feedback');
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

  if (!routine) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">
              Routine not found
            </h1>
            <Button onClick={() => navigate('/routines')}>
              Back to Routines
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            {routine.steps.length > 0 && routine.steps[0].time && routine.steps[0].time.toLowerCase().includes('morning') ? (
              <Sun size={32} className="text-yellow-500 mr-4" />
            ) : (
              <Moon size={32} className="text-indigo-500 mr-4" />
            )}
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-serif font-semibold !py-1 !px-2 min-w-[300px]"
            />
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackForm(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Give Feedback
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/routines')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
            >
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {showFeedbackForm && (
          <div className="mb-6">
            <RoutineFeedbackForm
              routine={routine}
              onSubmit={handleFeedbackSubmit}
              onCancel={() => setShowFeedbackForm(false)}
            />
          </div>
        )}

        <Card>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                layout
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex flex-col p-4 rounded-xl border ${
                  draggedStep === index
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className="cursor-move p-2">
                    <GripVertical size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="flex items-center mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mr-3">
                        {step.order}
                      </span>
                      <h3 className="font-medium text-gray-800">
                        {step.product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-9">
                      {step.notes}
                    </p>
                    <div className="flex items-center mt-2">
                      <h4 className="font-semibold text-sm text-gray-500">
                        {step.categoryName}
                      </h4>
                      {step.alternatives && step.alternatives.length > 0 && (
                        <button
                          onClick={() => toggleAlternatives(step.id)}
                          className="ml-2 flex items-center text-sm text-primary hover:text-primary-dark"
                        >
                          Show Alternatives
                          <ChevronDown
                            size={16}
                            className={`ml-1 transition-transform ${
                              expandedAlternatives[step.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Primary Product Details */}
                <div className="ml-9 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{step.product.name}</p>
                      <p className="text-sm text-gray-500">{step.product.brand}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (ratings[step.product.id] || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onClick={() => handleRating(step.product.id, star)}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step.product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.product.keyIngredients.map((ingredient: string) => (
                      <span
                        key={ingredient}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Alternatives */}
                {expandedAlternatives[step.id] && step.alternatives && (
                  <div className="mt-4 ml-9 space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">Alternative Products:</h5>
                    {step.alternatives.map((alternative: StepAlternative) => (
                      <div
                        key={alternative.id}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-800">{alternative.name}</p>
                            <p className="text-sm text-gray-500">{alternative.brand}</p>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= (ratings[alternative.productId] || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                onClick={() => handleRating(alternative.productId, star)}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alternative.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {alternative.keyIngredients.map((ingredient: string) => (
                            <span
                              key={ingredient}
                              className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RoutineDetails;