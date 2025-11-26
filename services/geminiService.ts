import { GoogleGenAI } from "@google/genai";

// Fix: Use `process.env.API_KEY` directly as per the coding guidelines.
// This resolves the TypeScript error with `import.meta.env` and adheres to the
// requirement of sourcing the API key from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface TroubleshootingResponse {
  text: string;
  groundingSources?: { title: string; uri: string }[];
}

// Fix: Refactored to use systemInstruction for better prompt structure and re-throw errors for proper UI error handling.
export const getTroubleshootingResponse = async (knowledgeBase: string, query:string): Promise<TroubleshootingResponse> => {
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
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            tools: [{googleSearch: {}}],
        }
    });

    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map(chunk => {
        if (chunk.web) {
            return { title: chunk.web.title || '', uri: chunk.web.uri || '' };
        }
        return null;
    })
    .filter((source): source is { title: string; uri: string } => source !== null && !!source.uri);

    return {
        text: response.text || '',
        groundingSources
    };
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);

    // Improved error handling for rate limits
    if (error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('quota')))) {
       throw new Error("You have exceeded the API rate limit. Please wait a moment before trying again.");
    }

    if (error instanceof Error) {
        throw new Error(`Error communicating with the AI model: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the AI model.");
  }
};