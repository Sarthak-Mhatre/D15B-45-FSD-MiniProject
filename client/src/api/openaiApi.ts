// openaiApi.ts
import axios, { AxiosInstance } from "axios";

const openAIApiUrl = "https://api.openai.com/v1/chat/completions";

const instance: AxiosInstance = axios.create({
    baseURL: openAIApiUrl,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPEN_AI_API_KEY}`, // Replace with your real API Key
    },
});

export default instance;
