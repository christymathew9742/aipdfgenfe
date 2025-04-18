import { GoogleGenAI } from "@google/genai";

export const sendPromptToGemini = async ({
  pdfText,
  history,
  currentQuestion
}: {
  pdfText: string;
  history: { question: string; answer: string }[];
  currentQuestion: string;
}) => {
    // const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY});
    const ai = new GoogleGenAI({ apiKey: 'AIzaSyCwBmoL4cfex6gNt0gkWDuDBpb_M3QuInM'});
    const context = `
    You are an AI assistant. Below is the document content you must understand:

    "${pdfText}"

    Chat History:
    ${history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join("\n")}

    Current Question: ${currentQuestion}
    **Please respond clearly based on the document and history.**
    **answer for all qustions maximum 100 words.**
  `;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: context,
      });
    return response.text;
};










