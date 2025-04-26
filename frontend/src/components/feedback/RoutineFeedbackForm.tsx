import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitRoutineFeedback } from '../../api/feedback';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Product, UserRoutine } from '../../types/skincare';

interface RoutineFeedbackFormProps {
  routine: UserRoutine;
  products: Product[];
  onSuccess?: () => void;
}

const RoutineFeedbackForm: React.FC<RoutineFeedbackFormProps> = ({ routine, products, onSuccess }) => {
  const { authState } = useAuth();
  const [satisfaction, setSatisfaction] = useState<'Very satisfied' | 'Satisfied' | 'Neutral' | 'Unsatisfied' | 'Very unsatisfied'>('Neutral');
  const [skinChanges, setSkinChanges] = useState(false);
  const [easeOfUse, setEaseOfUse] = useState<'Yes' | 'Somewhat' | 'No'>('Yes');
  const [unnecessaryProductId, setUnnecessaryProductId] = useState<number | undefined>(undefined);
  const [primaryConcern, setPrimaryConcern] = useState('My primary skin concern is the same');
  const [routinePreference, setRoutinePreference] = useState<'Keep the same routine' | 'Make small adjustments' | 'Start a new routine'>('Keep the same routine');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.isAuthenticated || !authState.user) {
      setError('Please log in to submit feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitRoutineFeedback({
        routineId: routine.id,
        satisfaction,
        skinChanges,
        easeOfUse,
        unnecessaryProductId,
        primaryConcern,
        routinePreference
      }, authState.user.token);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Routine Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How satisfied are you with your current skincare routine overall?
          </label>
          <select
            value={satisfaction}
            onChange={(e) => setSatisfaction(e.target.value as typeof satisfaction)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Very satisfied">Very satisfied</option>
            <option value="Satisfied">Satisfied</option>
            <option value="Neutral">Neutral</option>
            <option value="Unsatisfied">Unsatisfied</option>
            <option value="Very unsatisfied">Very unsatisfied</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have you noticed changes in your skin's appearance or texture since starting this routine?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={skinChanges}
                onChange={() => setSkinChanges(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!skinChanges}
                onChange={() => setSkinChanges(false)}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Did your routine feel easy to follow?
          </label>
          <select
            value={easeOfUse}
            onChange={(e) => setEaseOfUse(e.target.value as typeof easeOfUse)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Yes">Yes</option>
            <option value="Somewhat">Somewhat</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Did any product feel unnecessary or difficult to use regularly?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={unnecessaryProductId === undefined}
                onChange={() => setUnnecessaryProductId(undefined)}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={unnecessaryProductId !== undefined}
                onChange={() => setUnnecessaryProductId(products[0]?.id)}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>

        {unnecessaryProductId !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which product do you feel is unnecessary or difficult to use regularly?
            </label>
            <select
              value={unnecessaryProductId}
              onChange={(e) => setUnnecessaryProductId(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your current primary skin concern?
          </label>
          <input
            type="text"
            value={primaryConcern}
            onChange={(e) => setPrimaryConcern(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your primary skin concern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Would you like to:
          </label>
          <select
            value={routinePreference}
            onChange={(e) => setRoutinePreference(e.target.value as typeof routinePreference)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Keep the same routine">Keep the same routine</option>
            <option value="Make small adjustments">Make small adjustments</option>
            <option value="Start a new routine">Start a new routine</option>
          </select>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Submit Feedback
        </Button>
      </form>
    </Card>
  );
};

export default RoutineFeedbackForm; 