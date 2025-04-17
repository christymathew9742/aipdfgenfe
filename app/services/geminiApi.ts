import { GoogleGenAI } from "@google/genai";

export const sendPromptToGemini = async (text: string,qustion:string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY});
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `analyse this content ${text} and anwer for this qustion ${qustion}`,
      });
    return response.text;
};








