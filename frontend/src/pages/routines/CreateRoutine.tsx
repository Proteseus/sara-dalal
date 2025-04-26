import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Plus, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createRoutine } from '../../api/routines';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Routine, RoutineStep, Product } from '../../types/skincare';

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gentle Foaming Cleanser',
    brand: 'CeraVe',
    description: 'A gentle, foaming facial cleanser for normal to oily skin',
    price: 15.99,
    size: 473,
    unit: 'ml',
    keyIngredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
    isNatural: false,
    isGentle: true,
  },
  {
    id: '2',
    name: 'Vitamin C Serum',
    brand: 'The Ordinary',
    description: 'A brightening serum with 23% vitamin C',
    price: 5.80,
    size: 30,
    unit: 'ml',
    keyIngredients: ['Vitamin C', 'Hyaluronic Acid'],
    isNatural: true,
    isGentle: true,
  },
  {
    id: '3',
    name: 'Daily Moisturizing Lotion',
    brand: 'CeraVe',
    description: 'Lightweight, oil-free moisturizer',
    price: 12.99,
    size: 355,
    unit: 'ml',
    keyIngredients: ['Ceramides', 'Hyaluronic Acid'],
    isNatural: false,
    isGentle: true,
  },
];

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [routineName, setRoutineName] = useState('');
  const [routineType, setRoutineType] = useState<'morning' | 'evening' | null>(null);
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stepNotes, setStepNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStep = () => {
    if (!selectedProduct || !stepNotes) return;

    const newStep: RoutineStep = {
      id: `temp-${Date.now()}`,
      order: steps.length + 1,
      time: routineType === 'morning' ? 'Morning' : 'Evening',
      notes: stepNotes,
      product: selectedProduct,
    };

    setSteps([...steps, newStep]);
    setSelectedProduct(null);
    setStepNotes('');
    setIsAddingStep(false);
  };

  const handleSubmit = async () => {
    if (!routineName || !routineType || steps.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const routineData: Partial<Routine> = {
        name: routineName,
        steps: steps,
        isActive: true,
      };

      const newRoutine = await createRoutine(routineData, authState.user!.token);
      navigate(`/routines/${newRoutine.id}`);
    } catch (err) {
      setError('Failed to create routine');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/routines')}
              className="mr-4"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="font-serif text-3xl font-semibold text-gray-800">
              Create New Routine
            </h1>
          </div>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!routineName || !routineType || steps.length === 0}
          >
            <Save size={20} className="mr-2" />
            Save Routine
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Routine Name"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g., My Morning Routine"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routine Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRoutineType('morning')}
                    className={`flex items-center justify-center p-4 rounded-xl border transition-all ${
                      routineType === 'morning'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <Sun size={24} className="mr-2" />
                    Morning Routine
                  </button>
                  <button
                    onClick={() => setRoutineType('evening')}
                    className={`flex items-center justify-center p-4 rounded-xl border transition-all ${
                      routineType === 'evening'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <Moon size={24} className="mr-2" />
                    Evening Routine
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-800">
                Routine Steps
              </h2>
              <Button
                variant="outline"
                onClick={() => setIsAddingStep(true)}
                disabled={!routineType}
              >
                <Plus size={20} className="mr-2" />
                Add Step
              </Button>
            </div>

            <AnimatePresence>
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center p-4 rounded-xl border border-gray-200 mb-4"
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg mr-4">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {step.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step.notes}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isAddingStep && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl p-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product
                  </label>
                  <div className="space-y-2">
                    {SAMPLE_PRODUCTS.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`w-full p-4 text-left rounded-xl border transition-all ${
                          selectedProduct?.id === product.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        <h4 className="font-medium text-gray-800">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {product.brand}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Step Notes"
                  value={stepNotes}
                  onChange={(e) => setStepNotes(e.target.value)}
                  placeholder="e.g., Apply gently in circular motions"
                />

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingStep(false);
                      setSelectedProduct(null);
                      setStepNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStep}
                    disabled={!selectedProduct || !stepNotes}
                  >
                    Add Step
                  </Button>
                </div>
              </motion.div>
            )}

            {!isAddingStep && steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No steps added yet. Click "Add Step" to begin building your routine.
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRoutine;