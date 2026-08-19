import axios from "axios";

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
}

export const callAI = async (prompt: string): Promise<string | null> => {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!prompt) {
      throw new Error("AI prompt is required");
    }

    const res = await axios.post<GeminiGenerateContentResponse>(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
      }
    );

    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err: unknown) {
    const errorDetail = axios.isAxiosError(err)
      ? err.response?.data || err.message
      : err instanceof Error
        ? err.message
        : "Unknown error";

    console.error("❌ Gemini Error:", errorDetail);

    return null;
  }
};
