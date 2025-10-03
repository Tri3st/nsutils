import axios from 'axios'

const url = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://www.vandiest.it';

console.log("API base URL: ", url + "/api");

// Helper: read csrftoken from cookie
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
}

// This is the standard configuration for making authenticated API requests
// with Axios to a Django backend.
export const api = axios.create({
    baseURL: url + '/api',
    withCredentials: true,
});

// Attach CSRF token to every request
api.interceptors.request.use((config) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});