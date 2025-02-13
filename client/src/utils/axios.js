import axios from "axios"

export const api = axios.create({
	baseURL: "http://localhost:8000/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true
})

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`; // Attach token to request headers
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
