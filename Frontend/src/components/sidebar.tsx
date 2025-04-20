import {
	LayoutDashboard,
	LogOut,
	Menu,
	X,
	ShoppingCart,
	MessageSquare,
	Contact,
	Users,
	Eye
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/authStore';

interface SidebarProps {
	isOpen: boolean;
	toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
	const { logout } = useAuthStore();

	const navItems = [
		{ path: '/', icon: ShoppingCart, label: 'Home' },
		{ path: '/dashboard/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
		{ path: '/dashboard/member', icon: Users, label: 'Member Dashboard' },
		{ path: '/dashboard/viewer', icon: Eye, label: 'Viewer Dashboard' },
		// { path: '/products', icon: PackageCheck, label: 'Products' },
		// { path: '/customers', icon: Users, label: 'Customers' },
		// { path: '/analytics', icon: BarChart2, label: 'Analytics' },
		{ path: '/about', icon: MessageSquare, label: 'about' },
		{ path: '/contact', icon: Contact, label: 'contact' },
		{ path: '/chatbot', icon: MessageSquare, label: 'chatbot' },
	];

	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await axiosInstance.post('/logout');
			logout();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<>
			{/* Sidebar */}

			<aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'}`}>
				<div className="flex items-center justify-between p-4 border-b border-slate-700">
					<h1 className={`text-xl font-bold text-white ${!isOpen && 'hidden'}`}>Admin Pro</h1>
					<button
						onClick={toggleSidebar}
						className="p-2 rounded-lg hover:bg-slate-700 text-white"
					>
						{isOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>

				<nav className="p-4 space-y-1">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center p-3 rounded-lg transition-all ${isActive
									? 'bg-blue-500 text-white'
									: 'text-slate-300 hover:bg-slate-700 hover:text-white'
									}`}
							>
								<Icon size={20} className="mr-3" />
								<span className={`${!isOpen && 'hidden'}`}>{item.label}</span>
							</Link>
						);
					})}
				</nav>

				<div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
					<button
						onClick={handleLogout}
						className="flex items-center w-full p-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
					>
						<LogOut size={20} className="mr-3" />
						<span className={`${!isOpen && 'hidden'}`}>Logout</span>
					</button>
				</div>
			</aside>

		</>
	);
}
