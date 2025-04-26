import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sun, Moon, GripVertical, Plus, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoutineById, updateRoutine } from '../../api/routines';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Routine, RoutineStep } from '../../types/skincare';

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
        routine.id,
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

  const handleDeleteStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    // Update order numbers
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });
    setSteps(newSteps);
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
            {routine.steps[0]?.time.toLowerCase().includes('morning') ? (
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
                className={`flex items-center p-4 rounded-xl border ${
                  draggedStep === index
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
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
                </div>
                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}

            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => {/* Add new step logic */}}
            >
              <Plus size={20} className="mr-2" />
              Add Step
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RoutineDetails;