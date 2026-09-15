import axios from "axios"

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 60000,
    withCredentials: true
});

// Har request mein jwt cookie se token read karke Authorization header mein bhejo
client.interceptors.request.use((config) => {
    if (typeof document !== "undefined") {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("jwt="))
            ?.split("=")[1];
        if (token) {
            config.headers["Authorization"] = token;
        }
    }
    return config;
});

const generateSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
}

export { client, generateSlug }
