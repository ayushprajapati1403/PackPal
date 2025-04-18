import { create } from 'zustand';

interface AuthState {
	token: string | null;
	isAuthenticated: boolean;
	setToken: (token: string) => void;
	clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	token: localStorage.getItem('token'),
	isAuthenticated: !!localStorage.getItem('token'),
	setToken: (token: string) => {
		localStorage.setItem('token', token);
		set({ token, isAuthenticated: true });
	},
	clearToken: () => {
		localStorage.removeItem('token');
		set({ token: null, isAuthenticated: false });
	},
}));

export const isAuthenticated = () => {
	return !!localStorage.getItem('token');
};

export const getToken = () => {
	return localStorage.getItem('token');
}; 