import { ICopilotContext } from "@/types/copilot"; // You will need to update this type
import { createContext, ReactNode, useContext, useState } from "react";
import toast from "react-hot-toast";
import { genAI } from "../api/geminiApi";
import {
    // GoogleGenerativeAI,
    Content,
    GenerativeModel,
    ChatSession,
} from "@google/generative-ai";

// --- NOTE ---
// You should update your ICopilotContext type in @/types/copilot.ts
// to match the 'value' in the Provider below.
// It will need:
// - input: string
// - setInput: (s: string) => void
// - output: string
// - history: Content[]
// - isRunning: boolean
// - generateCode: () => Promise<void>
// - clearChat: () => void
// ------------

const CopilotContext = createContext<ICopilotContext | null>(null);

export const useCopilot = () => {
    const context = useContext(CopilotContext);
    if (context === null) {
        throw new Error("useCopilot must be used within a CopilotContextProvider");
    }
    return context;
};

// --- System Instruction ---
// This prompt tells the AI how to behave.
const systemInstruction = {
    role: "system",
    parts: [{
        text: "You are a code generator copilot for the project Code Sync. You must obey all of the following rules:\n1. Generate code based on the given prompt.\n2. Do NOT provide any explanation, conversation, or text other than the code.\n3. Return ONLY code, formatted in Markdown using the appropriate language syntax (e.g., js for JavaScript, py for Python).\n4. If you don't know the answer or cannot generate code, respond with only the text: 'I don't know'."
    }]
};

const CopilotContextProvider = ({ children }: { children: ReactNode }) => {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>(""); // For the CURRENT streaming output
    const [history, setHistory] = useState<Content[]>([]); // For the FULL conversation
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // --- Model and Chat State ---
    // We use lazy initialization with useState to create these instances only once.

    // 1. The Model
    const [model] = useState<GenerativeModel>(() =>
        genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Best for speed/performance
            systemInstruction: systemInstruction,
        })
    );

    // 2. The Chat Session
    const [chat, setChat] = useState<ChatSession>(() =>
        model.startChat({
            history: [], // Start with an empty history
        })
    );

    // --- Main Function ---
    const generateCode = async () => {
        if (isRunning || !input.trim()) {
             if (!input.trim()) toast.error("Please write a prompt");
            return;
        }

        setIsRunning(true);
        setOutput(""); // Clear previous streaming output
        const loadingToast = toast.loading("Generating...");

        // Add the user's prompt to the history
        const userMessage: Content = {
            role: "user",
            parts: [{ text: input }],
        };
        
        // Optimistically update history (commented out, but an option)
        // setHistory(prev => [...prev, userMessage]);

        try {
            // Send the message to the chat session
            const result = await chat.sendMessageStream(input);
            
            let fullModelResponse = ""; // Accumulate the full response

            // Stream the response
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullModelResponse += chunkText;
                setOutput((prev) => prev + chunkText); // Update UI in real-time
            }
            
            // --- IMPORTANT ---
            // Update the history with both the user message and the *full* model response
            // This is how the model "remembers"
            setHistory(prev => [
                ...prev,
                userMessage, // The user's prompt
                { role: "model", parts: [{ text: fullModelResponse }] } // The model's reply
            ]);

            toast.success("Code generated");

        } catch (error: any) {
            console.error(error);
            let errorMessage = "Failed to generate the code";
            if (error.message?.includes("API key")) {
                errorMessage = "API key is invalid or missing.";
            } else if (error.message?.includes("safety")) {
                errorMessage = "Response blocked due to safety settings.";
            }
            toast.error(errorMessage);
            
            // Note: We don't add the failed message to history
            
        } finally {
            setIsRunning(false);
            toast.dismiss(loadingToast);
            setInput(""); // Clear the input field
        }
    };
    
    // --- Helper Function ---
    const clearChat = () => {
        setHistory([]);
        setOutput("");
        setInput("");
        // Create a new, fresh chat session
        setChat(model.startChat({ history: [] }));
        toast.success("Chat cleared");
    }

    return (
        <CopilotContext.Provider
            value={{
                input,
                setInput,
                output,       // The current, streaming model output
                history,      // The full conversation history
                isRunning,
                generateCode,
                clearChat,    // Add this to let users start a new chat
            }}
        >
            {children}
        </CopilotContext.Provider>
    );
};

export { CopilotContextProvider };
export default CopilotContext;