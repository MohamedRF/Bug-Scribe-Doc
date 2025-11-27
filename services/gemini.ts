import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateBugReport = async (notes: string[]): Promise<string> => {
  if (notes.length === 0) {
    return "No notes provided to generate a report.";
  }

  const formattedNotes = notes.map((note, index) => `${index + 1}. ${note}`).join('\n');

  const prompt = `
    Here is a list of raw notes taken during manual testing.
    
    Your task is to simply correct the grammar and spelling of each point and return them as a clean Markdown numbered list.
    
    Strictly follow these rules:
    - Do NOT add any introductory or concluding text (like "Here is the list...").
    - Do NOT add titles or headers.
    - Do NOT group the items or add categories.
    - Do NOT add detailed explanations or technical expansions.
    - Keep the output concise: just the corrected numbered list items.

    Raw Notes:
    ${formattedNotes}
  `;

  try {
    // Using gemini-2.5-flash for fast text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "An error occurred while communicating with the AI. Please try again.";
  }
};