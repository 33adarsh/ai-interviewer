import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://ai-interviewer-l31o.onrender.com",
    withCredentials: true,
})