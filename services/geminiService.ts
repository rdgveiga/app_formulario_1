import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

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
  if (!apiKey) {
    return "Error: API Key is missing. Please check your environment configuration.";
  }

  try {
    // We use the models.generateContent method for single turn or managed history
    // However, to maintain chat state easily, we'll format the history into the contents.
    
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
        },
        // Note: We do NOT set maxOutputTokens when using thinkingBudget as per instructions,
        // allowing the model to balance thinking and output.
      }
    });

    return response.text || "I couldn't generate a response.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Sorry, I encountered an error: ${error.message || 'Unknown error'}`;
  }
};