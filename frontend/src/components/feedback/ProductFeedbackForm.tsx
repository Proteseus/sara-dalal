import React, { useState } from 'react';
import { Product } from '../../types/skincare';
import Button from '../ui/Button';
import Card from '../ui/Card';
import RadioGroup from '../ui/RadioGroup';

interface ProductFeedbackFormProps {
  product: Product;
  onSubmit: (feedback: {
    usage: 'As recommended' | 'Less often than recommended' | 'I stopped using it';
    discomfort: boolean;
    discomfortImproving?: boolean;
    positiveChanges?: boolean;
  }) => void;
  onCancel: () => void;
}

const ProductFeedbackForm: React.FC<ProductFeedbackFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [usage, setUsage] = useState<'As recommended' | 'Less often than recommended' | 'I stopped using it'>('As recommended');
  const [discomfort, setDiscomfort] = useState(false);
  const [discomfortImproving, setDiscomfortImproving] = useState<boolean | undefined>(undefined);
  const [positiveChanges, setPositiveChanges] = useState<boolean | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      usage,
      discomfort,
      discomfortImproving: discomfort ? discomfortImproving : undefined,
      positiveChanges,
    });
  };

  return (
    <Card className="p-8 bg-background border border-primary/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xl font-serif">{product.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">
            Feedback for {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            How often did you use this product as part of your routine?
          </label>
          <RadioGroup
            options={[
              'As recommended',
              'Less often than recommended',
              'I stopped using it',
            ]}
            value={usage}
            onChange={(value) => setUsage(value as typeof usage)}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            Did you experience any discomfort while using this product?
          </label>
          <RadioGroup
            options={['No', 'Yes']}
            value={discomfort ? 'Yes' : 'No'}
            onChange={(value) => setDiscomfort(value === 'Yes')}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        {discomfort && (
          <div className="space-y-4">
            <label className="block text-base font-medium text-gray-700">
              Do you believe the discomfort is improving or can be tolerated?
            </label>
            <RadioGroup
              options={['No', 'Yes']}
              value={discomfortImproving ? 'Yes' : 'No'}
              onChange={(value) => setDiscomfortImproving(value === 'Yes')}
              className="bg-white rounded-xl p-4 space-y-3"
            />
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            Did you notice any positive changes in your skin from this product?
          </label>
          <RadioGroup
            options={['Yes', 'I\'m not sure']}
            value={positiveChanges ? 'Yes' : 'I\'m not sure'}
            onChange={(value) => setPositiveChanges(value === 'Yes')}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-primary/20 hover:bg-primary/5"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary-dark"
          >
            Submit Feedback
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductFeedbackForm; 