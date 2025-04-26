import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitProductFeedback } from '../../api/feedback';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Product } from '../../types/skincare';

interface ProductFeedbackFormProps {
  product: Product;
  onSuccess?: () => void;
}

const ProductFeedbackForm: React.FC<ProductFeedbackFormProps> = ({ product, onSuccess }) => {
  const { authState } = useAuth();
  const [usage, setUsage] = useState<'As recommended' | 'Less often than recommended' | 'I stopped using it'>('As recommended');
  const [discomfort, setDiscomfort] = useState(false);
  const [discomfortImproving, setDiscomfortImproving] = useState<boolean | undefined>(undefined);
  const [positiveChanges, setPositiveChanges] = useState<boolean | undefined>(undefined);
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
      await submitProductFeedback({
        productId: product.id,
        usage,
        discomfort,
        discomfortImproving: discomfort ? discomfortImproving : undefined,
        positiveChanges
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
      <h3 className="text-lg font-medium mb-4">Product Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often did you use this product as part of your routine?
          </label>
          <select
            value={usage}
            onChange={(e) => setUsage(e.target.value as typeof usage)}
            className="w-full p-2 border rounded-md"
          >
            <option value="As recommended">As recommended</option>
            <option value="Less often than recommended">Less often than recommended</option>
            <option value="I stopped using it">I stopped using it</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Did you experience any discomfort while using this product?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!discomfort}
                onChange={() => setDiscomfort(false)}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={discomfort}
                onChange={() => setDiscomfort(true)}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>

        {discomfort && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you believe the discomfort is improving or can be tolerated?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={discomfortImproving === true}
                  onChange={() => setDiscomfortImproving(true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={discomfortImproving === false}
                  onChange={() => setDiscomfortImproving(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Did you notice any positive changes in your skin from this product?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={positiveChanges === true}
                onChange={() => setPositiveChanges(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={positiveChanges === false}
                onChange={() => setPositiveChanges(false)}
                className="mr-2"
              />
              I'm not sure
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || (discomfort && discomfortImproving === undefined) || positiveChanges === undefined}
          isLoading={isSubmitting}
        >
          Submit Feedback
        </Button>
      </form>
    </Card>
  );
};

export default ProductFeedbackForm; 