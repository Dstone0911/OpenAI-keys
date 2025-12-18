
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationStrategy } from "../types";

// Always initialize with the direct apiKey object
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStrategy = async (
  strategy: SimulationStrategy,
  assets: any[],
  network: string,
  userPrompt: string
) => {
  // Use gemini-3-pro-preview for complex reasoning and DeFi logic tasks
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    You are a DeFi Simulation Architect. The user is operating in a testnet or Tenderly virtual environment.
    Strategy Type: ${strategy}
    Network: ${network}
    Available Assets: ${JSON.stringify(assets)}
    User Input/Goal: ${userPrompt}

    Task:
    1. Analyze the potential for "virtual value creation" (e.g., maximizing yield, finding arbitrage paths, or testing heavy liquidations).
    2. Provide a step-by-step transaction plan.
    3. Estimate the 'Virtual Alpha' (simulated profit) if this was mainnet.
    4. Provide a sample code snippet (Solidity or ethers.js) for the primary interaction.

    Format the response as a JSON object with:
    - title: string
    - summary: string
    - steps: string[]
    - estimatedProfit: string
    - code: string
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedProfit: { type: Type.STRING },
            code: { type: Type.STRING }
          },
          // Use propertyOrdering instead of required per the guideline examples
          propertyOrdering: ["title", "summary", "steps", "estimatedProfit", "code"]
        }
      }
    });

    // Access the .text property directly (not as a method)
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};

export const chatWithArchitect = async (message: string, context: string) => {
  // Use gemini-3-flash-preview for general chat and conversational Q&A
  const model = "gemini-3-flash-preview";
  const prompt = `System: You are an expert smart contract auditor and simulation specialized in Tenderly.
  Context: ${context}
  User: ${message}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    // The text property directly returns the string output from the model
    return response.text;
  } catch (error) {
    console.error("Gemini chat failed:", error);
    return "The architect is currently unavailable. Please check your network.";
  }
};
