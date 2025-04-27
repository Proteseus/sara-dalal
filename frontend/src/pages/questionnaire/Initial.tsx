import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getQuestions, submitResponses } from '../../api/questionnaire';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { QuestionnaireQuestion, QuestionnaireResponse } from '../../types/skincare';

const Initial: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numericalValue, setNumericalValue] = useState<string>('');
  const [numericalError, setNumericalError] = useState<string>('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Reset numerical value and error when question changes
    setNumericalValue('');
    setNumericalError('');
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSingleChoiceAnswer = (answer: string) => {
    const newResponses = [...responses];
    const existingResponseIndex = newResponses.findIndex(
      (r) => r.questionId === currentQuestion.id
    );

    if (existingResponseIndex !== -1) {
      newResponses[existingResponseIndex].answer = answer;
    } else {
      newResponses.push({
        questionId: currentQuestion.id,
        answer,
      });
    }

    setResponses(newResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleMultiChoiceAnswer = (option: string, checked: boolean) => {
    const newResponses = [...responses];
    const existingResponseIndex = newResponses.findIndex(
      (r) => r.questionId === currentQuestion.id
    );

    const currentAnswers = existingResponseIndex !== -1
      ? newResponses[existingResponseIndex].answer.split(',').filter(Boolean)
      : [];

    let updatedAnswers: string[];
    if (checked) {
      updatedAnswers = [...currentAnswers, option];
    } else {
      updatedAnswers = currentAnswers.filter(a => a !== option);
    }

    if (existingResponseIndex !== -1) {
      newResponses[existingResponseIndex].answer = updatedAnswers.join(',');
    } else {
      newResponses.push({
        questionId: currentQuestion.id,
        answer: updatedAnswers.join(','),
      });
    }

    setResponses(newResponses);
  };

  const handleNumericalSubmit = () => {
    const num = parseInt(numericalValue);
    if (isNaN(num)) {
      setNumericalError('Please enter a valid number');
      return;
    }
    if (num < 0) {
      setNumericalError('Age cannot be negative');
      return;
    }
    if (num > 120) {
      setNumericalError('Please enter a valid age');
      return;
    }
    
    const newResponses = [...responses];
    const existingResponseIndex = newResponses.findIndex(
      (r) => r.questionId === currentQuestion.id
    );

    if (existingResponseIndex !== -1) {
      newResponses[existingResponseIndex].answer = numericalValue;
    } else {
      newResponses.push({
        questionId: currentQuestion.id,
        answer: numericalValue,
      });
    }

    setResponses(newResponses);
    setNumericalError('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!authState.isAuthenticated) {
      navigate('/login', { state: { from: '/questionnaire/initial' } });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitResponses(responses, authState.user!.token);
      navigate(`/routines/${result.skinProfile.routine.id}`, { state: { skinProfile: result.skinProfile } });
    } catch (err) {
      setError('Failed to submit responses. Please try again.');
      setIsSubmitting(false);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold text-gray-800 mb-4">
            Skin Assessment
          </h1>
          <p className="text-gray-600">
            Let's understand your skin better to create your perfect routine
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary-light rounded-full mb-8">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <h2 className="text-xl font-medium text-gray-800 mb-6">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion.type === 'SINGLE_CHOICE' && (
                  <>
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSingleChoiceAnswer(option)}
                        className={`w-full p-4 text-left rounded-xl border transition-all ${
                          responses.find((r) => r.questionId === currentQuestion.id)?.answer === option
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </>
                )}

                {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                  <>
                    {currentQuestion.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                          onChange={(e) => handleMultiChoiceAnswer(option, e.target.checked)}
                          checked={
                            responses
                              .find((r) => r.questionId === currentQuestion.id)
                              ?.answer.split(',')
                              .includes(option) || false
                          }
                        />
                        <span className="ml-3">{option}</span>
                      </label>
                    ))}
                  </>
                )}

                {currentQuestion.type === 'YES_NO' && (
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleSingleChoiceAnswer('Yes')}
                      variant={
                        responses.find((r) => r.questionId === currentQuestion.id)?.answer === 'Yes'
                          ? 'primary'
                          : 'outline'
                      }
                      fullWidth
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => handleSingleChoiceAnswer('No')}
                      variant={
                        responses.find((r) => r.questionId === currentQuestion.id)?.answer === 'No'
                          ? 'primary'
                          : 'outline'
                      }
                      fullWidth
                    >
                      No
                    </Button>
                  </div>
                )}

                {currentQuestion.type === 'NUMERICAL' && (
                  <div className="space-y-4">
                    <Input
                      type="number"
                      value={numericalValue}
                      onChange={(e) => setNumericalValue(e.target.value)}
                      placeholder="Enter your age"
                      error={numericalError}
                      min="0"
                      max="120"
                    />
                    <Button
                      onClick={handleNumericalSubmit}
                      disabled={!numericalValue}
                      fullWidth
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={responses.length !== questions.length}
            >
              Complete Assessment
              <ChevronRight size={20} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!responses.find((r) => r.questionId === currentQuestion?.id)}
            >
              Next Question
              <ChevronRight size={20} className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Initial;