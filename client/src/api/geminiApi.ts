// geminiApi.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Always use environment variable for API key
const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;

// Create the Gemini API instance
export const genAI = new GoogleGenerativeAI(apiKey!);
