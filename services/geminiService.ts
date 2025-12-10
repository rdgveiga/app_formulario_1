import { GoogleGenAI } from "@google/genai";

// Initialize the client
// We use a fallback string to prevent the app from crashing on load if the API_KEY is missing during deployment.
// The API calls will simply fail gracefully if the key is invalid.
const apiKey = process.env.API_KEY || "missing-api-key";
const ai = new GoogleGenAI({ apiKey: apiKey });

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Sends a message to Gemini using the Thinking Mode (gemini-3-pro-preview)
 * suitable for complex queries.
 */
export const sendMessageWithThinking = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    if (apiKey === "missing-api-key") {
        return "A API Key não foi configurada. Por favor, configure a variável de ambiente API_KEY na Vercel.";
    }

    // Config specifically requested for "Thinking Mode"
    const modelId = "gemini-3-pro-preview";
    const thinkingBudget = 32768; 

    // Transform local history to API format
    const contents = [
        ...history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        })),
        {
            role: 'user',
            parts: [{ text: newMessage }]
        }
    ];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        thinkingConfig: { 
            thinkingBudget: thinkingBudget 
        }
      }
    });

    return response.text || "I couldn't generate a response.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Sorry, I encountered an error: ${error.message || 'Unknown error'}`;
  }
};