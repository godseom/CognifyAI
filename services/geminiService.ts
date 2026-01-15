
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessResult, AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const searchBusinesses = async (name: string): Promise<BusinessResult[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search for food and beverage establishments named "${name}". Return a list of up to 5 matching restaurants with their specific address, rating, and cuisine type.`,
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
    console.error("Failed to parse restaurant search results", e);
    return [];
  }
};

export const analyzeBusiness = async (business: BusinessResult): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a world-class Restaurant Business Analyst and AI Strategist. 
    Your goal is to perform a deep-dive operational diagnostic to improve profitability and guest experience.

    RESTAURANT ANALYSIS FRAMEWORK:
    1. THE CONCEPT: Cuisine, Price Point, and Target Demographic.
    2. MENU ENGINEERING (High Impact): 
       - Identify "Stars" (High Profit, High Popularity) and "Dogs" (Low Profit, Low Popularity).
       - Suggest AI-driven dynamic pricing or menu placement optimizations.
    3. GUEST SENTIMENT ANALYSIS: Scrape reviews to identify specific recurring complaints (e.g., long wait times, cold food, service speed).
    4. OPERATIONAL EFFICIENCY: 
       - Inventory management (reducing food waste).
       - Staffing optimization using predictive analytics.
    5. AI-DRIVEN REVENUE GROWTH: 
       - Loyalty automation.
       - AI reservation agents for phone/web.
    6. ROI ESTIMATE: Specific financial impact on Prime Cost (Food + Labor).
    7. CALL TO ACTION: "Book a 15-minute Menu Engineering Audit."
  `;

  const prompt = `
    Perform a restaurant analytics audit for:
    Name: ${business.name}
    Address: ${business.address}
    Cuisine: ${business.category}
    Current Rating: ${business.rating}

    Search for specific menu items, pricing, review patterns, and local competition. 
    Format with professional Markdown. Be data-driven and actionable.
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

    const report = response.text || "No restaurant analysis could be generated.";
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
    throw new Error("Restaurant analysis failed. Please try again later.");
  }
};
