import axios from 'axios';
import { createBrowserHistory } from 'history';

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// // Add a request interceptor
// api.interceptors.request.use(
// 	(config) => {
// 		// You can add any additional headers here if needed
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );

const history = createBrowserHistory();

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			// Handle unauthorized
			localStorage.removeItem('user');
			history.push('/login'); // or window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
// Add a response interceptor


export default api; 