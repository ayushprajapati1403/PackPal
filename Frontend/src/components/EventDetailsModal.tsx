import React from 'react';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventDetailsModalProps {
	event: Event;
	onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-start mb-4">
					<h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold text-gray-700">Description</h3>
						<p className="text-gray-600">{event.description}</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h3 className="text-lg font-semibold text-gray-700">Date & Time</h3>
							<p className="text-gray-600">
								{format(new Date(event.date), 'PPP p')}
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-gray-700">Location</h3>
							<p className="text-gray-600">{event.location}</p>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold text-gray-700">Organizer</h3>
						<p className="text-gray-600">{event.organizer.name}</p>
					</div>

					{event.attendees && event.attendees.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold text-gray-700">Attendees</h3>
							<div className="flex flex-wrap gap-2">
								{event.attendees.map((attendee) => (
									<span
										key={attendee.id}
										className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
									>
										{attendee.name}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EventDetailsModal; 