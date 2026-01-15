
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessResult, AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const searchBusinesses = async (name: string): Promise<BusinessResult[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search Google for businesses named "${name}". Return a list of up to 5 matching businesses with their specific address, rating, and category.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            rating: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["name", "address", "category"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse business search results", e);
    return [];
  }
};

export const analyzeBusiness = async (business: BusinessResult): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a senior Applied AI Consultant specializing in identifying operational inefficiencies, automation opportunities, and AI-driven growth strategies for businesses.
    Your goal is to diagnose workflow inefficiencies, identify high-impact AI opportunities, map automation potential, and recommend practical, ROI-focused AI solutions.

    ANALYSIS FRAMEWORK:
    1. Business Profile Analysis (Overview, Size, Customer Type)
    2. PROS (What's working well)
    3. CONS & BOTTLENECKS (Operational, Decision-Making, Experience Gaps with severity)
    4. WHERE AI CAN ADD VALUE (Mapping problems to outcomes)
    5. AI SOLUTION DESIGN (Workflow automation, Agents, Predictive Analytics)
    6. IMPLEMENTATION PHASES (Phase 1 Quick Wins, Phase 2 Optimization, Phase 3 Scale)
    7. RISK ASSESSMENT
    8. CONSULTATION CTA: End with: "Based on this assessment, a 30-minute AI consultation would help validate: What should be automated, What should stay human, Expected ROI. Book consultation: [Your Link]"
  `;

  const prompt = `
    Conduct a deep dive analysis for the following business:
    Name: ${business.name}
    Address: ${business.address}
    Category: ${business.category}
    Rating: ${business.rating}

    Search for public data, reviews, and industry benchmarks. Use Markdown for formatting. 
    Be specific, structured, and business-focused. Avoid technical jargon.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const report = response.text || "No analysis could be generated.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri,
    })).filter((s: any) => s.uri) || [];

    return {
      business,
      report,
      sources,
      timestamp: Date.now()
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Analysis failed. Please try a different business or try again later.");
  }
};
