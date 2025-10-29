// Import the 'Content' type from the SDK
import { Content } from "@google/generative-ai";
import { Dispatch, SetStateAction } from "react";

export interface ICopilotContext {
    // --- Properties you need to add ---
    
    /** The current value of the text input field */
    input: string;
    
    /** The full conversation log */
    history: Content[];
    
    /** Function to clear the chat history */
    clearChat: () => void;
    
    // --- Properties you already had (with one update) ---
    
    /** The state setter for the input field */
    setInput: Dispatch<SetStateAction<string>>;
    
    /** The current, streaming output from the model */
    output: string;
    
    /** True if the model is currently generating a response */
    isRunning: boolean;
    
    /** The function to send the message (it's async, so it returns a Promise) */
    generateCode: () => Promise<void>; 
}
