import React, { useState, useEffect } from 'react';
import { CheckSquare, Bell } from 'lucide-react';
import { Category, Item } from '../../types';
import { useAuthStore } from '../../store/authStore';

export default function ViewerDashboard() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    // TODO: Fetch categories from backend
    // This would be replaced with actual API call
    const fetchCategories = async () => {
      // Mock data for now
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Category 1',
          items: [
            { id: '1', name: 'Item 1', status: 'pending' as const },
            { id: '2', name: 'Item 2', status: 'packed' as const },
          ],
        },
        {
          id: '2',
          name: 'Category 2',
          items: [
            { id: '3', name: 'Item 3', status: 'delivered' as const },
            { id: '4', name: 'Item 4', status: 'pending' as const },
          ],
        },
      ];
      setCategories(mockCategories);
      setSelectedCategory(mockCategories[0]);
    };

    fetchCategories();
  }, []);

  const getStatusColor = (status: Item['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      case 'packed':
        return 'bg-green-100 text-green-600';
      case 'delivered':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Viewer Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="text-sm text-gray-600">Real-time updates enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory?.id === category.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="md:col-span-3">
          {selectedCategory ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">{selectedCategory.name}</h2>
              <div className="space-y-4">
                {selectedCategory.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                        <CheckSquare className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Status: {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              Select a category to view its items
            </div>
          )}
        </div>
      </div>
    </div>
  );
}