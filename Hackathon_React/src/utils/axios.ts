import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
	(config) => {
		// You can add any additional headers here if needed
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			localStorage.removeItem('user');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api; 