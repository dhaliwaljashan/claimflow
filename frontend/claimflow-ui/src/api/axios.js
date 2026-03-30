import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7070/api"
});

export default api;