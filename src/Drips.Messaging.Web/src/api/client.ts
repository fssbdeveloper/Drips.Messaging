import axios from "axios";

export const api = axios.create({
    baseURL: "https://localhost:7238/api", // change to your backend
    withCredentials: false
});
