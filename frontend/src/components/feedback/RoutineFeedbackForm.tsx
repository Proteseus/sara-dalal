import React, { useState } from 'react';
import { Routine, Product } from '../../types/skincare';
import Button from '../ui/Button';
import Card from '../ui/Card';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';

interface RoutineFeedbackFormProps {
  routine: Routine;
  onSubmit: (feedback: {
    satisfaction: 'Very satisfied' | 'Satisfied' | 'Neutral' | 'Unsatisfied' | 'Very unsatisfied';
    skinChanges: boolean;
    easeOfUse: 'Yes' | 'Somewhat' | 'No';
    unnecessaryProductId?: number;
    primaryConcern: string;
    routinePreference: 'Keep the same routine' | 'Make small adjustments' | 'Start a new routine';
  }) => void;
  onCancel: () => void;
}

const RoutineFeedbackForm: React.FC<RoutineFeedbackFormProps> = ({
  routine,
  onSubmit,
  onCancel,
}) => {
  const [satisfaction, setSatisfaction] = useState<'Very satisfied' | 'Satisfied' | 'Neutral' | 'Unsatisfied' | 'Very unsatisfied'>('Neutral');
  const [skinChanges, setSkinChanges] = useState(false);
  const [easeOfUse, setEaseOfUse] = useState<'Yes' | 'Somewhat' | 'No'>('Yes');
  const [hasUnnecessaryProduct, setHasUnnecessaryProduct] = useState(false);
  const [unnecessaryProductId, setUnnecessaryProductId] = useState<number | undefined>(undefined);
  const [primaryConcern, setPrimaryConcern] = useState('My primary skin concern is the same');
  const [routinePreference, setRoutinePreference] = useState<'Keep the same routine' | 'Make small adjustments' | 'Start a new routine'>('Keep the same routine');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      satisfaction,
      skinChanges,
      easeOfUse,
      unnecessaryProductId: hasUnnecessaryProduct ? unnecessaryProductId : undefined,
      primaryConcern,
      routinePreference,
    });
  };

  return (
    <Card className="p-8 bg-background border border-primary/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
          <span className="text-secondary text-xl font-serif">R</span>
        </div>
        <div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">
            Feedback for {routine.name}
          </h3>
          <p className="text-sm text-gray-500">{routine.steps.length} steps</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            How satisfied are you with your current skincare routine overall?
          </label>
          <RadioGroup
            options={[
              'Very satisfied',
              'Satisfied',
              'Neutral',
              'Unsatisfied',
              'Very unsatisfied',
            ]}
            value={satisfaction}
            onChange={(value) => setSatisfaction(value as typeof satisfaction)}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            Have you noticed changes in your skin's appearance or texture since starting this routine?
          </label>
          <RadioGroup
            options={['Yes', 'No']}
            value={skinChanges ? 'Yes' : 'No'}
            onChange={(value) => setSkinChanges(value === 'Yes')}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            Did your routine feel easy to follow?
          </label>
          <RadioGroup
            options={['Yes', 'Somewhat', 'No']}
            value={easeOfUse}
            onChange={(value) => setEaseOfUse(value as typeof easeOfUse)}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            Did any product feel unnecessary or difficult to use regularly?
          </label>
          <RadioGroup
            options={['No', 'Yes']}
            value={hasUnnecessaryProduct ? 'Yes' : 'No'}
            onChange={(value) => setHasUnnecessaryProduct(value === 'Yes')}
            className="bg-white rounded-xl p-4 space-y-3"
          />
        </div>

        {hasUnnecessaryProduct && (
          <div className="space-y-4">
            <label className="block text-base font-medium text-gray-700">
              Which product do you feel is unnecessary or difficult to use regularly?
            </label>
            <Select
              value={unnecessaryProductId?.toString() || ''}
              onChange={(value) => setUnnecessaryProductId(parseInt(value))}
              options={routine.steps.map(step => ({
                value: step.productId.toString(),
                label: step.product.name,
              }))}
              className="bg-white rounded-xl p-3 border border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            What is your current primary skin concern?
          </label>
          <Select
            value={primaryConcern}
            onChange={setPrimaryConcern}
            options={[
              { value: 'My primary skin concern is the same', label: 'My primary skin concern is the same' },
              { value: 'acne', label: 'Acne' },
              { value: 'dryness', label: 'Dryness' },
              { value: 'dullness', label: 'Dullness' },
              { value: 'pigmentation', label: 'Pigmentation' },
              { value: 'sensitivity', label: 'Sensitivity' },
              { value: 'aging', label: 'Aging' },
            ]}
            className="bg-white rounded-xl p-3 border border-gray-200 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">
            Would you like to:
          </label>
          <RadioGroup
            options={[
              'Keep the same routine',
              'Make small adjustments',
              'Start a new routine',
            ]}
            value={routinePreference}
            onChange={(value) => setRoutinePreference(value as typeof routinePreference)}
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

export default RoutineFeedbackForm; 