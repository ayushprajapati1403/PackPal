import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

interface Notification {
	id: string;
	message: string;
	eventId: string;
	userId: string;
	sent: boolean;
	createdAt: string;
}

const NotificationsPage: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		try {
			const userStr = localStorage.getItem('user');
			if (!userStr) return;

			const userData = JSON.parse(userStr);
			const response = await axios.get(`/notifications/user/${userData.id}`);

			// Sort notifications by date (newest first)
			const sortedNotifications = (response.data.notifications || []).sort((a: Notification, b: Notification) => {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			});

			setNotifications(sortedNotifications);

			// Mark all notifications as read
			markNotificationsAsRead(sortedNotifications);
		} catch (error) {
			console.error('Error fetching notifications:', error);
			toast.error('Failed to fetch notifications');
		} finally {
			setLoading(false);
		}
	};

	const markNotificationsAsRead = async (notificationsToMark: Notification[]) => {
		try {
			// Find notifications that haven't been marked as sent
			const unreadNotifications = notificationsToMark.filter(notification => !notification.sent);

			// Mark each unread notification as sent
			for (const notification of unreadNotifications) {
				await axios.patch(`/notifications/${notification.id}/mark-read`, {}, {
					withCredentials: true
				});
			}
		} catch (error) {
			console.error('Error marking notifications as read:', error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="p-6">
				<div className="flex justify-between items-center mb-8">
					<div className="flex items-center gap-2">
						<Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-4">Loading notifications...</div>
				) : notifications.length === 0 ? (
					<div className="text-center py-4 text-gray-500 dark:text-gray-400">
						No notifications yet
					</div>
				) : (
					<div className="space-y-4">
						{notifications.map((notification) => (
							<div
								key={notification.id}
								className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${!notification.sent ? 'border-l-4 border-blue-500' : ''}`}
							>
								<p className="text-gray-900 dark:text-white">{notification.message}</p>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
									{new Date(notification.createdAt).toLocaleString()}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationsPage; 