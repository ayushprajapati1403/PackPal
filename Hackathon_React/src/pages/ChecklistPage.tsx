import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Category, Item, User } from '../types';

export default function ChecklistPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    // TODO: Fetch checklist data from API
    // This is a mock implementation
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Kitchen',
        items: [
          { id: '1', name: 'Pots and Pans', status: 'pending' },
          { id: '2', name: 'Utensils', status: 'packed' },
        ],
      },
      {
        id: '2',
        name: 'Bedroom',
        items: [
          { id: '3', name: 'Bedding', status: 'pending' },
          { id: '4', name: 'Clothes', status: 'delivered' },
        ],
      },
    ];
    setCategories(mockCategories);
    setLoading(false);
  }, [id]);

  const handleAddItem = () => {
    if (!selectedCategory || !newItemName.trim()) {
      toast.error('Please select a category and enter an item name');
      return;
    }

    const newItem: Item = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      status: 'pending',
    };

    setCategories(categories.map(category => {
      if (category.id === selectedCategory) {
        return {
          ...category,
          items: [...category.items, newItem],
        };
      }
      return category;
    }));

    setNewItemName('');
    toast.success('Item added successfully');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      items: [],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    toast.success('Category added successfully');
  };

  const handleStatusChange = (categoryId: string, itemId: string, newStatus: Item['status']) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              return { ...item, status: newStatus };
            }
            return item;
          }),
        };
      }
      return category;
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checklist {id}</h1>
      
      {/* Add Category Form */}
      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            
            {/* Add Item Form */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedCategory === category.id ? newItemName : ''}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onFocus={() => setSelectedCategory(category.id)}
                  placeholder="Add new item"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={handleAddItem}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="flex-1">{item.name}</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(category.id, item.id, e.target.value as Item['status'])}
                    className="ml-2 p-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="packed">Packed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}