import React, { useState, useEffect } from 'react';
import { Plus, Users, Bell, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { User, Event } from '../../types';
import { useAuthStore } from '../../store/authStore';

export default function OwnerDashboard() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { user } = useAuthStore();

  useEffect(() => {
    // TODO: Fetch admins and events from backend
    // This is a mock implementation
    setAdmins([
      { id: '1', name: 'Admin 1', email: 'admin1@example.com', role: 'admin' },
      { id: '2', name: 'Admin 2', email: 'admin2@example.com', role: 'admin' },
    ]);
    setEvents([
      {
        id: '1',
        name: 'Event 1',
        description: 'Sample event',
        date: '2024-03-20',
        categories: [],
        members: [],
      },
    ]);
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement admin creation logic
    toast.success('Admin created successfully');
    setIsAddingAdmin(false);
    setNewAdmin({ name: '', email: '', password: '' });
  };

  const handleDeleteAdmin = async (adminId: string) => {
    // TODO: Implement admin deletion logic
    toast.success('Admin deleted successfully');
  };

  const handleEditAdmin = async (adminId: string) => {
    // TODO: Implement admin editing logic
    toast.success('Admin updated successfully');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome, {user?.name}
        </div>
      </div>

      {/* Admin Management Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Management
          </h2>
          <button
            onClick={() => setIsAddingAdmin(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </button>
        </div>

        {isAddingAdmin && (
          <form onSubmit={handleAddAdmin} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsAddingAdmin(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Create Admin
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b">
                  <td className="py-3 px-4">{admin.name}</td>
                  <td className="py-3 px-4">{admin.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAdmin(admin.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Event Monitoring Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Event Monitoring
          </h2>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <span className="text-sm text-gray-500">
                  {event.members.length} members
                </span>
                <span className="text-sm text-gray-500">
                  {event.categories.length} categories
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}