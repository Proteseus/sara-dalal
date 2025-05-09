import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Sun, Moon, MoreVertical, Power, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserRoutines, toggleRoutineStatus, deleteRoutine } from '../../api/routines';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { Routine } from '../../types/skincare';
import { useTranslation } from 'react-i18next';

const RoutineList: React.FC = () => {
  const { authState } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [routineToDelete, setRoutineToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const fetchedRoutines = await getUserRoutines(authState.user!.token);
      setRoutines(fetchedRoutines);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load routines');
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (routineId: string) => {
    try {
      const updatedRoutine = await toggleRoutineStatus(routineId, authState.user!.token);
      setRoutines(routines.map(routine => 
        routine.id === routineId ? updatedRoutine : routine
      ));
    } catch (err) {
      setError('Failed to update routine status');
    }
  };

  const handleDeleteRoutine = async (routineId: number) => {
    setIsDeleting(true);
    try {
      await deleteRoutine(routineId.toString(), authState.user!.token);
      setRoutines(routines.filter(routine => routine.id !== routineId));
      setRoutineToDelete(null);
    } catch (err) {
      setError('Failed to delete routine');
    } finally {
      setIsDeleting(false);
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-gray-800">
            {t('routines.title')}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <Modal
          isOpen={routineToDelete !== null}
          onClose={() => setRoutineToDelete(null)}
          title={t('routines.deleteRoutine.title')}
          confirmText={t('routines.deleteRoutine.confirm')}
          onConfirm={() => handleDeleteRoutine(routineToDelete!)}
          isConfirming={isDeleting}
        >
          {t('routines.deleteRoutine.message')}
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <Card key={routine.id} className="relative">
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === routine.id.toString() ? null : routine.id.toString())}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical size={20} className="text-gray-500" />
                  </button>
                  
                  {activeMenu === routine.id.toString() && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-2 z-10">
                      <button
                        onClick={() => handleToggleStatus(routine.id.toString())}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                      >
                        <Power size={16} className="mr-2" />
                        {routine.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link
                        to={`/routines/${routine.id}`}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setRoutineToDelete(routine.id)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Link to={`/routines/${routine.id}`} className="block">
                <div className="mb-4">
                  {routine?.steps[0]?.time.toLowerCase().includes('morning') ? (
                    <Sun size={24} className="text-yellow-500" />
                  ) : (
                    <Moon size={24} className="text-indigo-500" />
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {routine.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {routine.steps.slice(0, 3).map((step) => (
                    <div key={step.id} className="flex items-center text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mr-3">
                        {step.order}
                      </span>
                      <span className="truncate">{step.product.name}</span>
                    </div>
                  ))}
                  {routine.steps.length > 3 && (
                    <div className="text-primary text-sm">
                      +{routine.steps.length - 3} more steps
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`px-3 py-1 rounded-full ${
                    routine.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {routine.isActive ? t('routines.active') : t('routines.inactive')}
                  </span>
                  <span className="text-gray-500">
                    {routine.steps.length} {t('routines.steps')}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {routines.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              {t('routines.noRoutines')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('routines.createRoutine')}
            </p>
            <Link to="/questionnaire">
              <Button>
                <Plus size={20} className="mr-2" />
                {t('routines.createButton')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoutineList;