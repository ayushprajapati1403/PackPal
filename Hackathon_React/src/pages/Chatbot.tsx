import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';

interface Message {
	role: 'user' | 'assistant';
	content: string;
}

const Chatbot = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage: Message = { role: 'user', content: input };
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		try {
			const response = await axios.post('http://localhost:5001/api/chatbot', {
				message: userMessage.content
			});

			const botReply: Message = {
				role: 'assistant',
				content: response.data.response
			};
			setMessages(prev => [...prev, botReply]);
		} catch (error) {
			console.error('Error sending message:', error);
			const errorMessage: Message = {
				role: 'assistant',
				content: 'Sorry, I encountered an error. Please try again later.'
			};
			setMessages(prev => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
			<div className="flex-1">
				<div className="max-w-4xl mx-auto p-4">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<Link to="/" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
							<ArrowLeft className="h-5 w-5" />
							<span>Back to Home</span>
						</Link>
						<div className="flex items-center space-x-2">
							<Sparkles className="h-6 w-6 text-primary" />
							<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								AI Trip Assistant
							</h1>
						</div>
					</div>

					{/* Chat Container */}
					<div className="bg-white rounded-2xl shadow-xl border border-border/20 h-[600px] flex flex-col overflow-hidden">
						{/* Messages Container */}
						<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
							{messages.length === 0 ? (
								<div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
									<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-lg">
										<MessageSquare className="h-8 w-8 text-blue-600" />
									</div>
									<h2 className="text-2xl font-bold text-gray-800">Welcome to AI Trip Assistant</h2>
									<p className="text-gray-600 max-w-md text-lg leading-relaxed">
										Ask me anything about planning your trip! I can help with:
									</p>
									<div className="grid grid-cols-2 gap-4 mt-4">
										<div className="flex items-center space-x-2 text-blue-600">
											<div className="w-2 h-2 rounded-full bg-blue-600"></div>
											<span>Destinations</span>
										</div>
										<div className="flex items-center space-x-2 text-blue-600">
											<div className="w-2 h-2 rounded-full bg-blue-600"></div>
											<span>Itineraries</span>
										</div>
										<div className="flex items-center space-x-2 text-blue-600">
											<div className="w-2 h-2 rounded-full bg-blue-600"></div>
											<span>Travel Tips</span>
										</div>
										<div className="flex items-center space-x-2 text-blue-600">
											<div className="w-2 h-2 rounded-full bg-blue-600"></div>
											<span>Group Planning</span>
										</div>
									</div>
								</div>
							) : (
								messages.map((message, index) => (
									<div
										key={index}
										className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
											}`}
									>
										{message.role === 'assistant' && (
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
												<Bot className="h-5 w-5 text-white" />
											</div>
										)}
										<div
											className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${message.role === 'user'
												? 'bg-blue-600 text-white'
												: 'bg-blue-50 text-gray-800'
												}`}
										>
											<p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
												{message.content.split('\n').map((line, i) => (
													<span key={i}>
														{line}
														{i < message.content.split('\n').length - 1 && <br />}
													</span>
												))}
											</p>
										</div>
										{message.role === 'user' && (
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
												<User className="h-5 w-5 text-white" />
											</div>
										)}
									</div>
								))
							)}
							{isLoading && (
								<div className="flex items-start space-x-3">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
										<Bot className="h-5 w-5 text-white" />
									</div>
									<div className="bg-blue-50 text-gray-800 rounded-2xl p-4 shadow-sm">
										<div className="flex space-x-2">
											<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
											<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
											<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Form */}
						<form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
							<div className="flex space-x-3">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Ask me anything about your trip..."
									className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder:text-gray-400 text-base"
								/>
								<button
									type="submit"
									disabled={isLoading}
									className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center space-x-2"
								>
									<Send className="h-5 w-5" />
									<span className="hidden sm:inline">Send</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

		</div>
	);
};

export default Chatbot; 