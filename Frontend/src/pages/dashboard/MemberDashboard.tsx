import React, { useState, useEffect } from 'react';
import { CheckSquare, MessageSquare, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { Category, Item } from '../../types';
import { useAuthStore } from '../../store/authStore';

export default function MemberDashboard() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // TODO: Fetch categories assigned to the current user
    // This would be replaced with actual API call
    const fetchCategories = async () => {
      // Mock data for now
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Category 1',
          items: [
            { id: '1', name: 'Item 1', status: 'pending' as const },
            { id: '2', name: 'Item 2', status: 'pending' as const },
          ],
        },
      ];
      setCategories(mockCategories);
      setSelectedCategory(mockCategories[0]);
    };

    fetchCategories();

    // Set up real-time socket connection
    const socket = io('http://localhost:3000'); // Replace with your actual server URL

    socket.on('categoryUpdate', (updatedCategory: Category) => {
      setCategories(prev => 
        prev.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      toast.info(`Category "${updatedCategory.name}" has been updated!`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleItemToggle = async (itemId: string) => {
    if (!selectedCategory) return;

    const updatedItems = selectedCategory.items.map(item => 
      item.id === itemId 
        ? { ...item, status: item.status === 'pending' ? 'packed' as const : 'pending' as const }
        : item
    );

    const updatedCategory: Category = {
      ...selectedCategory,
      items: updatedItems,
    };

    // TODO: Send update to server
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
    setSelectedCategory(updatedCategory);
  };

  const handleAddNote = async (itemId: string) => {
    if (!selectedCategory || !newNote.trim()) return;

    const updatedItems = selectedCategory.items.map(item => 
      item.id === itemId 
        ? { ...item, notes: newNote }
        : item
    );

    const updatedCategory: Category = {
      ...selectedCategory,
      items: updatedItems,
    };

    // TODO: Send update to server
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
    setSelectedCategory(updatedCategory);
    setNewNote('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Member Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="text-sm text-gray-600">Real-time updates enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Your Categories</h2>
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

        {/* Checklist Items */}
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
                      <button
                        onClick={() => handleItemToggle(item.id)}
                        className={`p-2 rounded-lg ${
                          item.status === 'packed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <CheckSquare className="h-5 w-5" />
                      </button>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {item.notes && (
                        <div className="text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4 inline-block mr-1" />
                          {item.notes}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="text-sm px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => handleAddNote(item.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
                        >
                          Save
                        </button>
                      </div>
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