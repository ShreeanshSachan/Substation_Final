import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Refactored to use systemInstruction for better prompt structure and re-throw errors for proper UI error handling.
export const getTroubleshootingResponse = async (knowledgeBase: string, query:string): Promise<string> => {
  const systemInstruction = `You are an expert AI assistant for electric grid substation technicians. Your primary role is to provide precise, step-by-step troubleshooting, maintenance, and failure resolution guidance.

Your primary source of information is the user-provided knowledge base. You MUST prioritize information from this document.

However, for information not present in the knowledge base, especially regarding estimated repair times or official standards (OSHA, NETA, IEEE), you are authorized to use web search to find relevant and up-to-date information.

When providing a solution, follow these steps:
1. Provide a clear diagnosis of the problem based on the user's query and the knowledge base.
2. Give step-by-step instructions for the fix.
3. Estimate the time required for the fix. Source this information in the following order of preference:
    a. From the provided knowledge base document. State the source clearly.
    b. If not in the knowledge base, from web search results (e.g., official documentation, industry standards). Cite the web source.
    c. If no reliable source can be found, provide a sensible, generated estimate and clearly state that it is an approximation (e.g., "A reasonable estimate for a fix of this complexity would be around X hours, though this may vary.").
4. Cite any relevant standards and documents (e.g., OSHA, NETA, IEEE), whether from the knowledge base or web search.

Structure your response clearly with headings, bullet points, and numbered lists for readability. Your response should be formatted for easy reading by a technician in the field. Be direct and clear.`;
  
  const contents = `Here is the knowledge base document:
---
${knowledgeBase}
---

Now, answer the following query from a technician:
Query: "${query}"`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            tools: [{googleSearch: {}}],
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Error communicating with the AI model: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the AI model.");
  }
};