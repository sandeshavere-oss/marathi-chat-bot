
import { GoogleGenAI } from "@google/genai";
import { SearchResponse, GroundingChunk } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY not found in environment");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async discussEvent(query: string): Promise<SearchResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `चला खालील विषयावर चर्चा करूया: ${query}`,
        config: {
          systemInstruction: `You are an expert news analyst and cultural commentator specializing in Marathi. 
          Your task is to provide detailed, insightful, and up-to-date discussions on current events, sports, politics, and culture in the Marathi language. 
          Always use Google Search grounding to ensure accuracy. 
          Structure your Marathi responses with clear headings and bullet points where appropriate. 
          Use a professional yet engaging tone.`,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "क्षमस्व, मी या विषयावर माहिती मिळवू शकलो नाही.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      return {
        text,
        sources: groundingChunks as GroundingChunk[],
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
