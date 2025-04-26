import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Sun, Moon, MoreVertical, Power, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserRoutines, toggleRoutineStatus, deleteRoutine } from '../../api/routines';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Routine } from '../../types/skincare';

const RoutineList: React.FC = () => {
  const { authState } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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

  const handleDeleteRoutine = async (routineId: string) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) {
      return;
    }

    try {
      await deleteRoutine(routineId, authState.user!.token);
      setRoutines(routines.filter(routine => routine.id !== routineId));
    } catch (err) {
      setError('Failed to delete routine');
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
            Your Skincare Routines
          </h1>
          <Link to="/routines/create">
            <Button>
              <Plus size={20} className="mr-2" />
              Create Routine
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <Card key={routine.id} className="relative">
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === routine.id ? null : routine.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical size={20} className="text-gray-500" />
                  </button>
                  
                  {activeMenu === routine.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-2 z-10">
                      <button
                        onClick={() => handleToggleStatus(routine.id)}
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
                        onClick={() => handleDeleteRoutine(routine.id)}
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
                  {routine.steps[0]?.time.toLowerCase().includes('morning') ? (
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
                    {routine.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-gray-500">
                    {routine.steps.length} steps
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {routines.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              No routines yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first skincare routine to get started
            </p>
            <Link to="/routines/create">
              <Button>
                <Plus size={20} className="mr-2" />
                Create Routine
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoutineList;