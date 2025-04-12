/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Users, Bell, Download, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { User, Event, Category, Item, Permission } from '../../types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API base URL
const API_URL = 'http://localhost:3000/api/v1';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    description: '',
    startDate: '',
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    fullname: '',
    username: '',
    password: '',
    type: 'user',
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Permission>('Member');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryItemInputs, setCategoryItemInputs] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.eventName || !newEvent.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/events`, newEvent);
      setEvents([...events, response.data]);
      setNewEvent({ eventName: '', description: '', startDate: '' });
      toast.success('Event created successfully!');
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Error creating event:', error);
    }
  };

  const handleInviteUser = async () => {
    if (!selectedEvent || !inviteEmail) {
      toast.error('Please select an event and enter an email');
      return;
    }

    try {
      await axios.post(`${API_URL}/events/${selectedEvent.eventId}/invite`, {
        email: inviteEmail,
        level: inviteRole
      });
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
      console.error('Error sending invitation:', error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !selectedEvent) return;

    const items = Array.from(selectedEvent.categories || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      const response = await axios.put(`${API_URL}/events/${selectedEvent.eventId}/categories/reorder`, {
        categories: items
      });
      setSelectedEvent(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to reorder categories');
      }
    }
  };

  const handleExportPDF = () => {
    if (!selectedEvent) return;

    const element = document.createElement('div');
    element.innerHTML = `
      <h1>${selectedEvent.eventName}</h1>
      <p>Date: ${selectedEvent.startDate}</p>
      <p>Description: ${selectedEvent.description}</p>
      <h2>Categories and Items</h2>
      ${(selectedEvent.categories || []).map(category => `
        <h3>${category.name}</h3>
        <ul>
          ${(category.items || []).map(item => `
            <li>${item.name} - ${item.isPacked ? 'Packed' : 'Not Packed'}</li>
          `).join('')}
        </ul>
      `).join('')}
    `;

    html2pdf().from(element).save(`${selectedEvent.eventName}_checklist.pdf`);
  };

  const handleCreateCategory = async () => {
    if (!selectedEvent || !newCategoryName) {
      toast.error('Please select an event and enter a category name');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/events/${selectedEvent.eventId}/categories`, {
        name: newCategoryName
      });
      setSelectedEvent({
        ...selectedEvent,
        categories: [...(selectedEvent.categories || []), response.data]
      });
      setNewCategoryName('');
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Failed to create category');
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!selectedEvent) return;

    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      setSelectedEvent({
        ...selectedEvent,
        categories: (selectedEvent.categories || []).filter(cat => cat.id !== categoryId)
      });
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  };

  const handleCreateItem = async (categoryId: string) => {
    if (!selectedEvent || !categoryItemInputs[categoryId]) {
      toast.error('Please enter an item name');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/categories/${categoryId}/items`, {
        name: categoryItemInputs[categoryId]
      });

      const updatedCategories = (selectedEvent.categories || []).map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: [...(cat.items || []), response.data]
          };
        }
        return cat;
      });

      setSelectedEvent({
        ...selectedEvent,
        categories: updatedCategories
      });

      setCategoryItemInputs(prev => ({
        ...prev,
        [categoryId]: ''
      }));

      toast.success('Item created successfully!');
    } catch (error) {
      toast.error('Failed to create item');
      console.error('Error creating item:', error);
    }
  };

  const handleItemInputChange = (categoryId: string, value: string) => {
    setCategoryItemInputs(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    if (!selectedEvent) return;

    try {
      await axios.delete(`${API_URL}/items/${itemId}`);
      const updatedCategories = (selectedEvent.categories || []).map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).filter(item => item.id !== itemId)
          };
        }
        return cat;
      });

      setSelectedEvent({
        ...selectedEvent,
        categories: updatedCategories
      });
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleItemStatus = async (categoryId: string, itemId: string) => {
    if (!selectedEvent) return;

    try {
      const response = await axios.patch(`${API_URL}/items/${itemId}`, {
        isPacked: true
      });

      const updatedCategories = (selectedEvent.categories || []).map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).map(item => {
              if (item.id === itemId) {
                return response.data;
              }
              return item;
            })
          };
        }
        return cat;
      });

      setSelectedEvent({
        ...selectedEvent,
        categories: updatedCategories
      });
    } catch (error) {
      toast.error('Failed to update item status');
      console.error('Error updating item status:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isEventCreator = (event: Event) => {
    // TODO: Implement actual user authentication
    return true; // For now, assume user is creator of all events
  };

  const getUserRole = (event: Event) => {
    // TODO: Implement actual user role check
    return 'Member' as Permission; // For now, assume user is member of all events
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        username: loginData.username,
        password: loginData.password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        navigate('/dashboard/admin');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/signup`, signupData);
      if (response.data.userId) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => toast.info('WhatsApp notifications enabled')}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Bell className="w-5 h-5" />
          Enable WhatsApp Notifications
        </button>
      </div>

      {/* Create Event Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Event Name"
            className="p-2 border rounded-lg"
            value={newEvent.eventName}
            onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
          />
          <input
            type="date"
            className="p-2 border rounded-lg"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded-lg"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </div>
        <button
          onClick={handleCreateEvent}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.eventId}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedEvent(event)}
          >
            <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <p className="text-sm text-gray-500">Date: {event.startDate}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {(event.assignments || []).length} members
              </span>
              <button
                onClick={() => handleExportPDF()}
                className="text-primary hover:text-primary/80"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedEvent.eventName}</h2>
            <div className="flex gap-4">
              {isEventCreator(selectedEvent) && (
                <button
                  onClick={() => handleExportPDF()}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  <Download className="w-5 h-5" />
                  Export PDF
                </button>
              )}
            </div>
          </div>

          {/* Invite Users */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Invite Users</h3>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter email"
                className="p-2 border rounded-lg flex-1"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <select
                className="p-2 border rounded-lg"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Permission)}
              >
                <option value="Viewer">Viewer</option>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                onClick={handleInviteUser}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Invite
              </button>
            </div>
          </div>

          {/* Category Management (only for event creator) */}
          {isEventCreator(selectedEvent) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Manage Categories</h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="New Category Name"
                  className="p-2 border rounded-lg flex-1"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Category
                </button>
              </div>
            </div>
          )}

          {/* Categories and Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories and Items</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {(selectedEvent.categories || []).map((category, index) => (
                      <Draggable
                        key={category.id}
                        draggableId={category.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 p-4 rounded-lg mb-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold">{category.name}</h4>
                              {isEventCreator(selectedEvent) && (
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>

                            {/* Item Management (only for event creator) */}
                            {isEventCreator(selectedEvent) && (
                              <div className="flex gap-4 mb-4">
                                <input
                                  type="text"
                                  placeholder="New Item Name"
                                  className="p-2 border rounded-lg flex-1"
                                  value={categoryItemInputs[category.id] || ''}
                                  onChange={(e) => handleItemInputChange(category.id, e.target.value)}
                                />
                                <button
                                  onClick={() => handleCreateItem(category.id)}
                                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                                >
                                  <Plus className="w-5 h-5" />
                                  Add Item
                                </button>
                              </div>
                            )}

                            <ul className="space-y-2">
                              {(category.items || []).map((item) => (
                                <li
                                  key={item.id}
                                  className="flex justify-between items-center bg-white p-2 rounded"
                                >
                                  <span>{item.name}</span>
                                  <div className="flex items-center gap-2">
                                    {getUserRole(selectedEvent) === 'Member' && (
                                      <button
                                        onClick={() => handleToggleItemStatus(category.id, item.id)}
                                        className={`p-1 rounded-full ${item.isPacked
                                          ? 'bg-green-500 text-white'
                                          : 'bg-gray-200 text-gray-600'
                                          }`}
                                      >
                                        {item.isPacked ? (
                                          <Check className="w-4 h-4" />
                                        ) : (
                                          <X className="w-4 h-4" />
                                        )}
                                      </button>
                                    )}
                                    {isEventCreator(selectedEvent) && (
                                      <button
                                        onClick={() => handleDeleteItem(category.id, item.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}


    </div>
  );
}