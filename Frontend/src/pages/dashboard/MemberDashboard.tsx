import React, { useState, useEffect } from 'react';
import { CheckSquare, MessageSquare, Bell } from 'lucide-react';
import { toast } from 'react-toastify';

import { Item, Event, Notification } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const API_URL = 'http://localhost:3000/api/v1';

export default function MemberDashboard() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchUnreadNotifications();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/my-events`, {
        withCredentials: true
      });
      // Filter to only show events where the user is a member
      const memberEvents = response.data.events.filter((event: Event) =>
        event.assignments?.some(assignment =>
          assignment.userId === user?.id && assignment.level === 'Member'
        )
      );
      setEvents(memberEvents || []);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const userData = JSON.parse(userStr);
      const response = await axios.get(`/notifications/user/${userData.id}`, {
        withCredentials: true
      });

      // Count notifications that haven't been sent (unread)
      const unreadCount = (response.data.notifications || []).filter(
        (notification: Notification) => !notification.sent
      ).length;

      setUnreadNotifications(unreadCount);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  const handleEventClick = async (event: Event) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/events/${event.eventId}`, {
        withCredentials: true
      });

      if (response.data.event) {
        setSelectedEvent({
          ...response.data.event,
          categories: response.data.event.categories || []
        });
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItemStatus = async (categoryId: string, itemId: string) => {
    try {
      const response = await axios.patch(`${API_URL}/items/${itemId}/toggle`, {}, {
        withCredentials: true
      });

      if (response.data && response.data.updated) {
        // Update the local state with the new item status from the response
        setEvents(prevEvents =>
          prevEvents.map(event => {
            if (event.eventId === selectedEvent?.eventId) {
              return {
                ...event,
                categories: event.categories?.map(category => {
                  if (category.id === categoryId) {
                    return {
                      ...category,
                      items: category.items?.map(item => {
                        if (item.id === itemId) {
                          return {
                            ...item,
                            isPacked: response.data.updated.isPacked
                          };
                        }
                        return item;
                      })
                    };
                  }
                  return category;
                })
              };
            }
            return event;
          })
        );

        // Update selectedEvent state
        if (selectedEvent) {
          setSelectedEvent({
            ...selectedEvent,
            categories: selectedEvent.categories?.map(category => {
              if (category.id === categoryId) {
                return {
                  ...category,
                  items: category.items?.map(item => {
                    if (item.id === itemId) {
                      return {
                        ...item,
                        isPacked: response.data.updated.isPacked
                      };
                    }
                    return item;
                  })
                };
              }
              return category;
            })
          });
        }

        toast.success(`Item marked as ${response.data.updated.isPacked ? 'packed' : 'unpacked'}`);
      }
    } catch (error) {
      console.error('Error toggling item status:', error);
      toast.error('Failed to update item status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Member Dashboard - Events You're a Member Of</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/notifications')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white relative"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleEventClick(event)}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{event.eventName}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date: {new Date(event.startDate).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {event.assignments?.length || 0} members
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEvent.eventName}</h2>
            </div>

            {/* Event Overview Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Event Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Event Details</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-medium">Date:</span> {new Date(selectedEvent.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-medium">Description:</span> {selectedEvent.description}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Members:</span> {selectedEvent.assignments?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Assigned Categories</h4>
                  <div className="space-y-2">
                    {selectedEvent.categories?.map(category => {
                      // Find the assignment that contains this category
                      const assignment = selectedEvent.assignments?.find(a =>
                        a.categories?.some(c => c.id === category.id)
                      );
                      const isAssignedToMe = assignment?.userId === user?.id;

                      return (
                        <div key={category.id} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${isAssignedToMe
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}>
                              {isAssignedToMe ? 'Assigned to You' : 'Not Assigned to You'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Categories and Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Categories and Items</h3>
              {isLoading ? (
                <div className="text-center py-4">Loading categories...</div>
              ) : (
                <div className="space-y-4">
                  {selectedEvent?.categories?.map((category) => {
                    // Check if this category is assigned to the current user
                    const isAssignedToMe = selectedEvent.assignments?.some(
                      assignment =>
                        assignment.userId === user?.id &&
                        assignment.categories?.some(c => c.id === category.id)
                    );

                    if (!isAssignedToMe) return null;

                    return (
                      <div
                        key={category.id}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{category.name}</h4>
                        </div>

                        <ul className="space-y-2">
                          {category.items?.map((item: Item) => (
                            <li
                              key={item.id}
                              className="flex justify-between items-center bg-white dark:bg-gray-600 p-2 rounded"
                            >
                              <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                              <div className="flex items-center gap-2">
                                {/* Show status indicator */}
                                <div className={`p-1 rounded-full ${item.isPacked
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                                  }`}>
                                  {item.isPacked ? (
                                    <CheckSquare className="w-4 h-4" />
                                  ) : (
                                    <MessageSquare className="w-4 h-4" />
                                  )}
                                </div>

                                {/* Allow members to toggle status */}
                                <button
                                  onClick={() => handleToggleItemStatus(category.id, item.id)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <CheckSquare className="w-4 h-4" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}