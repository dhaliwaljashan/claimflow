import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7070/api"
});

// Before every request goes to backend, run this logic
api.interceptors.request.use(
    (config) => {
        // it checks if token exists in localStorage
        const token = localStorage.getItem("token");

        // If token exists, attach it to request headers
        // This is required for accessing protected APIs
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;