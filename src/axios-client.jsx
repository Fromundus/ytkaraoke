import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
    baseURL: `${apiUrl}/api`
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear tokens and sensitive data
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("id");

            // Optional: Store the error for user feedback
            error.logout = true;
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
