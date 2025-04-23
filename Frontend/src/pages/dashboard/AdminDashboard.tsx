/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Users, Bell, Download, Trash2, Edit2, Check, X, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { User, Event, Category, Item, Notification } from '../../types';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:3000/api/v1';

// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default function AdminDashboard() {
	const [events, setEvents] = useState<Event[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [newEvent, setNewEvent] = useState({
		name: '',
		description: '',
		date: '',
	});
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<'viewer' | 'member'>('viewer');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [categoryItemInputs, setCategoryItemInputs] = useState<Record<string, string>>({});
	// const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	// const [showEventModal, setShowEventModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [unreadNotifications, setUnreadNotifications] = useState(0);
	const navigate = useNavigate();
	const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchEvents();
		// Get username from localStorage
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				const userData = JSON.parse(userStr);
				setCurrentUser({
					id: userData.id || '',
					name: userData.name || '',
					email: userData.email || '',
					role: userData.role || '',
					username: userData.username || ''
				});
			} catch (error) {
				console.error('Error parsing user data:', error);
			}
		}
		fetchUnreadNotifications();
	}, []);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setActiveMenuId(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const fetchEvents = async () => {
		try {
			const response = await axios.get(`${API_URL}/events/my-events`, {
				withCredentials: true
			});
			// Filter to only show events where the user is the creator
			const createdEvents = response.data.events.filter((event: Event) =>
				event.isCreator === true
			);
			setEvents(createdEvents || []);
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

	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		if (value.length > 2) {
			const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=fd4797874b444c66bb04daff64c6ead3`;

			try {
				const response = await fetch(url);
				const data = await response.json();

				const cityNames = data.features.map((feature: { properties: { city?: string; name?: string } }) =>
					feature.properties.city || feature.properties.name
				);
				setSuggestions(cityNames);
			} catch (error) {
				console.error("Error fetching city suggestions:", error);
			}
		} else {
			setSuggestions([]);
		}
	};


	const handleCreateEvent = async () => {
		if (!newEvent.name || !newEvent.date) {
			toast.error('Please fill in all required fields');
			return;
		}

		try {
			const response = await axios.post(`${API_URL}/events/add`, {
				eventName: newEvent.name,
				startDate: newEvent.date,
				description: newEvent.description
			}, {
				withCredentials: true
			});

			setEvents([...events, response.data]);
			setNewEvent({ name: '', description: '', date: '' });
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

		if (inviteRole === 'member' && selectedCategories.length === 0) {
			toast.error('Please select at least one category for the member');
			return;
		}

		try {
			// First check if the user exists in the database
			const userResponse = await axios.get(`${API_URL}/users/check-email/${inviteEmail}`, {
				withCredentials: true
			});

			if (!userResponse.data.user) {
				toast.error(`User with email ${inviteEmail} is not registered in the system`);
				return;
			}

			const userId = userResponse.data.user.id;

			// Check if any of the selected categories are already assigned
			if (inviteRole === 'member') {
				const alreadyAssignedCategories = selectedEvent.categories
					.filter(category => selectedCategories.includes(category.id) && category.assignmentId)
					.map(category => category.name);

				if (alreadyAssignedCategories.length > 0) {
					toast.error(`The following categories are already assigned: ${alreadyAssignedCategories.join(', ')}`);
					return;
				}
			}

			// Create the assignment
			await axios.post(`${API_URL}/assignments/assign`, {
				userId,
				eventId: selectedEvent.eventId,
				level: inviteRole === 'member' ? 'Member' : 'Viewer',
				categories: selectedCategories
			}, {
				withCredentials: true
			});

			// Make sure we have the event name
			console.log(selectedEvent);
			const eventName = selectedEvent.eventName || 'Unknown Event';

			// Send notification to the user with sent status set to true
			await axios.post(`${API_URL}/notifications/send`, {
				message: `You have been invited to the event "${eventName}" as a ${inviteRole}`,
				userId,
				eventId: selectedEvent.eventId,
				sent: true
			}, {
				withCredentials: true
			});

			toast.success(`Invitation sent to ${inviteEmail}`);
			setInviteEmail('');
			setSelectedCategories([]);
		} catch (error: unknown) {
			console.error('Error sending invitation:', error);
			toast.error('Failed to send invitation');
		}
	};

	const handleCategorySelection = (categoryId: string) => {
		setSelectedCategories(prev => {
			if (prev.includes(categoryId)) {
				return prev.filter(id => id !== categoryId);
			} else {
				return [...prev, categoryId];
			}
		});
	};

	const handleExportPDF = () => {
		if (!selectedEvent) {
			toast.error('No event selected');
			return;
		}

		try {
			const element = document.createElement('div');
			element.style.padding = '20px';
			element.style.fontFamily = 'Arial, sans-serif';

			// Event Header
			const header = document.createElement('div');
			header.style.marginBottom = '20px';
			header.style.borderBottom = '2px solid #333';
			header.style.paddingBottom = '10px';

			const title = document.createElement('h1');
			title.textContent = selectedEvent.eventName;
			title.style.color = '#333';
			title.style.marginBottom = '10px';
			title.style.fontSize = '24px';

			const date = document.createElement('p');
			date.textContent = `Date: ${selectedEvent.date}`;
			date.style.marginBottom = '5px';
			date.style.color = '#666';

			const description = document.createElement('p');
			description.textContent = `Description: ${selectedEvent.description}`;
			description.style.marginBottom = '5px';
			description.style.color = '#666';

			header.appendChild(title);
			header.appendChild(date);
			header.appendChild(description);
			element.appendChild(header);

			// Members Section
			if (selectedEvent.members && selectedEvent.members.length > 0) {
				const membersSection = document.createElement('div');
				membersSection.style.marginBottom = '20px';

				const membersTitle = document.createElement('h2');
				membersTitle.textContent = 'Event Members';
				membersTitle.style.color = '#333';
				membersTitle.style.marginBottom = '10px';
				membersTitle.style.fontSize = '18px';

				const membersList = document.createElement('ul');
				membersList.style.listStyle = 'none';
				membersList.style.padding = '0';

				selectedEvent.members.forEach((member: User) => {
					const memberItem = document.createElement('li');
					memberItem.style.padding = '5px 0';
					memberItem.style.borderBottom = '1px solid #eee';
					memberItem.textContent = `${member.name || 'Unknown'} (${member.email}) - ${member.role || 'No role'}`;
					membersList.appendChild(memberItem);
				});

				membersSection.appendChild(membersTitle);
				membersSection.appendChild(membersList);
				element.appendChild(membersSection);
			}

			// Categories and Items Section
			const categoriesSection = document.createElement('div');
			categoriesSection.style.marginBottom = '20px';

			const categoriesTitle = document.createElement('h2');
			categoriesTitle.textContent = 'Categories and Items';
			categoriesTitle.style.color = '#333';
			categoriesTitle.style.marginBottom = '10px';
			categoriesTitle.style.fontSize = '18px';

			categoriesSection.appendChild(categoriesTitle);

			if (selectedEvent.categories && selectedEvent.categories.length > 0) {
				selectedEvent.categories.forEach(category => {
					const categoryDiv = document.createElement('div');
					categoryDiv.style.marginBottom = '15px';
					categoryDiv.style.padding = '10px';
					categoryDiv.style.border = '1px solid #ddd';
					categoryDiv.style.borderRadius = '5px';

					const categoryName = document.createElement('h3');
					categoryName.textContent = category.name;
					categoryName.style.color = '#444';
					categoryName.style.marginBottom = '10px';
					categoryName.style.fontSize = '16px';

					const itemsList = document.createElement('ul');
					itemsList.style.listStyle = 'none';
					itemsList.style.padding = '0';

					if (category.items && category.items.length > 0) {
						category.items.forEach(item => {
							const itemDiv = document.createElement('li');
							itemDiv.style.padding = '8px 0';
							itemDiv.style.borderBottom = '1px solid rgb(190, 188, 188)';
							itemDiv.style.display = 'flex';
							itemDiv.style.justifyContent = 'space-between';
							itemDiv.style.alignItems = 'center';

							const itemName = document.createElement('span');
							itemName.textContent = item.name;
							itemName.style.color = '#444';

							const itemStatus = document.createElement('span');
							itemStatus.textContent = `Status: ${item.isPacked ? 'Packed' : 'Unpacked'}`;
							itemStatus.style.color = item.isPacked ? '#28a745' : '#dc3545';

							itemDiv.appendChild(itemName);
							itemDiv.appendChild(itemStatus);
							itemsList.appendChild(itemDiv);
						});
					} else {
						const noItems = document.createElement('li');
						noItems.textContent = 'No items in this category';
						noItems.style.color = '#666';
						noItems.style.fontStyle = 'italic';
						itemsList.appendChild(noItems);
					}

					categoryDiv.appendChild(categoryName);
					categoryDiv.appendChild(itemsList);
					categoriesSection.appendChild(categoryDiv);
				});
			} else {
				const noCategories = document.createElement('p');
				noCategories.textContent = 'No categories found for this event';
				noCategories.style.color = '#666';
				noCategories.style.fontStyle = 'italic';
				categoriesSection.appendChild(noCategories);
			}

			element.appendChild(categoriesSection);

			// Add the element to the document temporarily
			document.body.appendChild(element);

			// PDF Options
			const opt = {
				margin: 1,
				filename: `Event_${selectedEvent.eventName}_${new Date().toISOString().split('T')[0]}_Details.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
			};

			// Generate and save the PDF
			html2pdf().set(opt).from(element).save().then(() => {
				// Remove the temporary element after PDF is generated
				document.body.removeChild(element);
				toast.success('PDF exported successfully!');
			}).catch((error: unknown) => {
				console.error('Error generating PDF:', error);
				toast.error('Failed to generate PDF');
				// Remove the temporary element in case of error
				if (document.body.contains(element)) {
					document.body.removeChild(element);
				}
			});
		} catch (error) {
			console.error('Error in PDF export:', error);
			toast.error('Failed to export PDF');
		}
	};

	const handleCreateCategory = async () => {
		if (!selectedEvent || !newCategoryName) {
			toast.error('Category name is required');
			return;
		}

		try {
			const response = await axios.post(`${API_URL}/categories/add`, {
				categoryName: newCategoryName,
				eventId: selectedEvent.eventId
			}, {
				withCredentials: true
			});

			// Update the selected event with the new category
			if (response.data.category) {
				setSelectedEvent(prevEvent => {
					if (!prevEvent) return prevEvent;
					return {
						...prevEvent,
						categories: [...(prevEvent.categories || []), {
							...response.data.category,
							id: response.data.category.id.toString() // Ensure ID is a string
						}]
					};
				});
			}

			setNewCategoryName('');
			toast.success('Category created successfully!');
		} catch (error) {
			console.error('Error creating category:', error);
			toast.error('Failed to create category');
		}
	};

	const handleDeleteCategory = async (categoryId: string) => {
		if (!selectedEvent) return;

		try {
			await axios.delete(`${API_URL}/categories/${categoryId}`, {
				withCredentials: true
			});
			setSelectedEvent({
				...selectedEvent,
				categories: selectedEvent.categories.filter(cat => cat.id !== categoryId)
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
			}, {
				withCredentials: true
			});

			// Add detailed console logs to see the exact structure
			console.log('Full server response:', response);
			console.log('Response data:', response.data);
			console.log('Category in response:', response.data.category);
			console.log('Items in category:', response.data.category?.items);

			// Update the selected event with the complete updated category from the response
			setSelectedEvent(prevEvent => {
				if (!prevEvent) return prevEvent;

				// Find the updated category in the response
				const updatedCategory = response.data.category;

				// Create a new categories array with the updated category
				const updatedCategories = prevEvent.categories.map(cat => {
					if (cat.id === categoryId) {
						// Use the complete updated category from the response
						return updatedCategory;
					}
					return cat;
				});

				// Return a new event object with the updated categories
				const newEvent = {
					...prevEvent,
					categories: updatedCategories
				};

				console.log('Updated selectedEvent:', newEvent);
				return newEvent;
			});

			// Clear the input field
			setCategoryItemInputs(prev => ({
				...prev,
				[categoryId]: ''
			}));

			toast.success('Item created successfully!');
		} catch (error) {
			console.error('Error creating item:', error);
			toast.error('Failed to create item');
		}
	};

	const handleItemInputChange = (categoryId: string, value: string) => {
		setCategoryItemInputs(prev => ({
			...prev,
			[categoryId]: value,
		}));
	};

	const handleDeleteItem = async (categoryId: string, itemId: string) => {
		if (!selectedEvent) return;

		try {
			// First, try to delete the item using the category-specific endpoint
			try {
				await axios.delete(`${API_URL}/categories/${categoryId}/items/${itemId}`, {
					withCredentials: true
				});
			} catch (deleteError) {
				console.error('Error with category-specific delete endpoint:', deleteError);

				// Fallback: Try the general items endpoint
				await axios.delete(`${API_URL}/items/${itemId}`, {
					withCredentials: true
				});
			}

			// Update the selected event by removing the deleted item
			setSelectedEvent(prevEvent => {
				if (!prevEvent) return prevEvent;

				// Create a new categories array with the updated category
				const updatedCategories = prevEvent.categories.map(cat => {
					if (cat.id === categoryId) {
						// Filter out the deleted item
						return {
							...cat,
							items: cat.items.filter(item => item.id !== itemId)
						};
					}
					return cat;
				});

				// Return a new event object with the updated categories
				return {
					...prevEvent,
					categories: updatedCategories
				};
			});

			toast.success('Item deleted successfully!');
		} catch (error) {
			console.error('Error deleting item:', error);
			toast.error('Failed to delete item');
		}
	};

	const handleToggleItemStatus = async (categoryId: string, itemId: string) => {
		if (!selectedEvent) return;

		try {
			// Use the correct endpoint for toggling item status
			const response = await axios.patch(`${API_URL}/items/${itemId}/toggle`, {}, {
				withCredentials: true
			});

			if (response.data && response.data.updated) {
				// Update the local state with the new item status from the response
				const updatedCategories = selectedEvent.categories.map(cat => {
					if (cat.id === categoryId) {
						return {
							...cat,
							items: cat.items.map(item => {
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
					return cat;
				});

				setSelectedEvent({
					...selectedEvent,
					categories: updatedCategories
				});

				toast.success(`Item marked as ${response.data.updated.isPacked ? 'packed' : 'unpacked'}`);
			}
		} catch (error) {
			toast.error('Failed to update item status');
			console.error('Error updating item status:', error);
		}
	};

	const handleConfirmDelivery = async () => {
		if (!selectedEvent) {
			toast.error("No event selected");
			return;
		}

		// Check if user has admin permissions
		if (!isEventAdmin(selectedEvent)) {
			toast.error("Only admins can confirm delivery");
			return;
		}

		try {
			// Check if all items are packed
			const allItemsPacked = selectedEvent.categories.every(category =>
				category.items.every(item => item.isPacked)
			);

			if (!allItemsPacked) {
				toast.error("All items must be packed before confirming delivery");
				return;
			}

			const response = await axios.post(`${API_URL}/events/${selectedEvent.eventId}/confirm-delivery`, {}, {
				withCredentials: true
			});

			if (response.data.success) {
				toast.success("Delivery confirmed successfully!");

				// Update the local state with the response data
				if (response.data.event) {
					setSelectedEvent({
						...selectedEvent,
						categories: response.data.event.categories
					});
				}
			} else {
				toast.error(response.data.message || "Failed to confirm delivery");
			}
		} catch (error) {
			console.error("Error confirming delivery:", error);
			toast.error("Failed to confirm delivery. Please try again.");
		}
	};

	const isEventCreator = (event: Event) => {
		// TODO: Implement actual user authentication
		return true; // For now, assume user is creator of all events
	};

	const getUserRole = (event: Event) => {
		// TODO: Implement actual user role check
		return 'member'; // For now, assume user is member of all events
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
				// setShowEventModal(true);
			}
		} catch (error) {
			console.error('Error fetching event details:', error);
			toast.error('Failed to load event details');
		} finally {
			setIsLoading(false);
		}
	};

	const isEventAdmin = (event: Event) => {
		// Check if the current user is an admin for this event
		// The user must have either 'Owner' permission or 'Admin' permission level
		return event.permission === 'Owner' || event.permission === 'Admin';
	};

	const isEventViewer = (event: Event) => {
		// Check if the current user is a viewer for this event
		return event.permission === 'Viewer';
	};

	const isEventMember = (event: Event) => {
		// Check if the current user is a member for this event
		return event.permission === 'Member';
	};

	const handleDeleteEvent = async (eventId: string) => {
		if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
			return;
		}

		try {
			await axios.delete(`${API_URL}/events/${eventId}`, {
				withCredentials: true
			});

			// Remove the event from the state
			setEvents(events.filter(event => event.eventId !== eventId));

			// If the deleted event was selected, clear the selection
			if (selectedEvent && selectedEvent.eventId === eventId) {
				setSelectedEvent(null);
			}

			toast.success('Event deleted successfully');
		} catch (error) {
			console.error('Error deleting event:', error);
			toast.error('Failed to delete event');
		}
	};

	const toggleMenu = (eventId: string, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event card click
		setActiveMenuId(activeMenuId === eventId ? null : eventId);
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="p-6">
				<div className="flex justify-between items-center mb-8">
					<div>
						{currentUser && (
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard - {currentUser.username || currentUser.name}'s Created Events</h1>
						)}
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

				{/* Create Event Section */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Event</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Event Name"
								className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 w-full"
								value={newEvent.name}
								onChange={(e) => { setNewEvent({ ...newEvent, name: e.target.value }); handleInputChange(e) }}
							/>
							{suggestions.length > 0 && (
								<div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
									{suggestions.map((suggestion, index) => (
										<div
											key={index}
											className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
											onClick={() => {
												setNewEvent({ ...newEvent, name: suggestion });
												setSuggestions([]);
											}}
										>
											{suggestion}
										</div>
									))}
								</div>
							)}
						</div>
						<input
							type="date"
							className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
							value={newEvent.date}
							onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
						/>
						<input
							type="text"
							placeholder="Description"
							className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
							key={event.id}
							className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow relative"
							onClick={() => handleEventClick(event)}
						>
							<div className="absolute top-4 right-4">
								<button
									onClick={(e) => toggleMenu(event.eventId, e)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									<MoreVertical className="w-5 h-5" />
								</button>

								{activeMenuId === event.eventId && (
									<div
										ref={menuRef}
										className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
									>
										<div className="py-1">
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteEvent(event.eventId);
													setActiveMenuId(null);
												}}
												className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
											>
												<Trash2 className="w-4 h-4 mr-2" />
												Delete Event
											</button>
										</div>
									</div>
								)}
							</div>

							<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{event.eventName}</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Date: {new Date(event.startDate).toLocaleDateString()}
							</p>
							<div className="flex justify-between items-center mt-4">
								<span className="text-sm text-gray-500 dark:text-gray-400">
									{event.assignments?.length || 0} members
								</span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleExportPDF();
									}}
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
					<div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEvent.eventName}</h2>
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
									<h4 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
									<div className="space-y-2">
										{selectedEvent.categories?.map(category => {
											// Find the assignment that contains this category
											const assignment = selectedEvent.assignments?.find(a =>
												a.categories?.some(c => c.id === category.id)
											);
											console.log(assignment);
											const assignedUsername = assignment?.user?.username || 'Unassigned';

											return (
												<div key={category.id} className="flex justify-between items-center">
													<span className="text-gray-600 dark:text-gray-300">{category.name}</span>
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-500 dark:text-gray-400">
															{assignedUsername}
														</span>
														{/* <span className={`px-2 py-1 rounded-full text-xs ${category.assignmentId
															? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
															: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
															}`}>
															{category.assignmentId ? 'Assigned' : 'Unassigned'}
														</span> */}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>

						{/* Invite Users - Only visible to admins */}
						{isEventAdmin(selectedEvent) && (
							<div className="mb-6">
								<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Invite Users</h3>
								<div className="flex flex-col gap-4">
									<div className="flex gap-4">
										<input
											type="email"
											placeholder="Enter email"
											className="p-2 border rounded-lg flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
											value={inviteEmail}
											onChange={(e) => setInviteEmail(e.target.value)}
										/>
										<select
											className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
											value={inviteRole}
											onChange={(e) => {
												setInviteRole(e.target.value as 'viewer' | 'member');
												if (e.target.value === 'viewer') {
													setSelectedCategories([]);
												}
											}}
										>
											<option value="viewer">Viewer</option>
											<option value="member">Member</option>
										</select>
										<button
											onClick={handleInviteUser}
											className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
										>
											<Users className="w-5 h-5" />
											Invite
										</button>
									</div>

									{inviteRole === 'member' && selectedEvent.categories?.length > 0 && (
										<div className="mt-4">
											<h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Select Categories for Member</h4>
											<div className="flex flex-wrap gap-2">
												{selectedEvent.categories.map(category => (
													<label
														key={category.id}
														className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border ${selectedCategories.includes(category.id)
															? 'bg-primary/10 border-primary text-primary'
															: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
															}`}
													>
														<input
															type="checkbox"
															checked={selectedCategories.includes(category.id)}
															onChange={() => handleCategorySelection(category.id)}
															className="hidden"
														/>
														<span className="text-sm">{category.name}</span>
													</label>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Category Management (only for admins) */}
						{isEventAdmin(selectedEvent) && (
							<div className="mb-6">
								<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Manage Categories</h3>
								<div className="flex gap-4 mb-4">
									<input
										type="text"
										placeholder="New Category Name"
										className="p-2 border rounded-lg flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
							<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories and Items</h3>
							{isLoading ? (
								<div className="text-center py-4">Loading categories...</div>
							) : (
								<div className="space-y-4">
									{selectedEvent?.categories?.map((category) => {
										if (!category?.id) return null;
										return (
											<div
												key={category.id}
												className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
											>
												<div className="flex justify-between items-center mb-2">
													<h4 className="font-semibold text-gray-900 dark:text-white">{category.name}</h4>
													{isEventAdmin(selectedEvent) && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteCategory(category.id);
															}}
															className="text-red-500 hover:text-red-700"
														>
															<Trash2 className="w-5 h-5" />
														</button>
													)}
												</div>

												{/* Item Management (only for admins) */}
												{isEventAdmin(selectedEvent) && (
													<div className="flex gap-4 mb-4">
														<input
															type="text"
															placeholder="New Item Name"
															className="p-2 border rounded-lg flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
															value={categoryItemInputs[category.id] || ''}
															onChange={(e) => {
																e.stopPropagation();
																handleItemInputChange(category.id, e.target.value);
															}}
														/>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleCreateItem(category.id);
															}}
															className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
														>
															<Plus className="w-5 h-5" />
															Add Item
														</button>
													</div>
												)}

												<ul className="space-y-2">
													{category.items?.map((item: Item) => {
														console.log('Rendering item:', item);
														return (
															<li
																key={item.id}
																className="flex justify-between items-center bg-white dark:bg-gray-600 p-2 rounded"
															>
																<span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
																<div className="flex items-center gap-2">
																	{/* Show status indicator for all users */}
																	<div className={`p-1 rounded-full ${item.isPacked
																		? 'bg-green-500 text-white'
																		: 'bg-gray-200 text-gray-600'
																		}`}>
																		{item.isPacked ? (
																			<Check className="w-4 h-4" />
																		) : (
																			<X className="w-4 h-4" />
																		)}
																	</div>

																	{/* Allow members to toggle status */}
																	{isEventMember(selectedEvent) && (
																		<button
																			onClick={(e) => {
																				e.stopPropagation();
																				handleToggleItemStatus(category.id, item.id);
																			}}
																			className="text-blue-500 hover:text-blue-700"
																		>
																			<Edit2 className="w-4 h-4" />
																		</button>
																	)}

																	{/* Allow admins to delete items */}
																	{isEventAdmin(selectedEvent) && (
																		<button
																			onClick={(e) => {
																				e.stopPropagation();
																				handleDeleteItem(category.id, item.id);
																			}}
																			className="text-red-500 hover:text-red-700"
																		>
																			<Trash2 className="w-4 h-4" />
																		</button>
																	)}
																</div>
															</li>
														);
													})}
												</ul>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Confirm Delivery Button - Only visible to admins */}
						{isEventAdmin(selectedEvent) && (
							<div className="mt-8 flex justify-end">
								<button
									onClick={handleConfirmDelivery}
									className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
								>
									<Check className="w-5 h-5" />
									Confirm Delivery
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>

	);
}