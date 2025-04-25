import { ENV } from "../config/env";

export class DeepSeekService {
  private static readonly API_KEY = ENV.DEEPSEEK_API_KEY;
  private static readonly API_URL =
    "https://api.deepseek.com/v1/chat/completions";

  private static readonly SYSTEM_PROMPT = `You are a professional health assistant. Structure your responses exactly as follows:

### [Clear, Concise Title]
[Brief, direct answer in 1-2 sentences]

Key Points:
• [Specific point 1]
• [Specific point 2]
• [Specific point 3 if needed]

*Note: This is general health information. Always consult healthcare professionals for medical advice.*

Rules:
1. Keep all responses concise and clear
2. Use bullet points for key information
3. No bold text markers (**) - use clear writing instead
4. Maximum 3 bullet points
5. Always maintain this exact structure`;

  static async getHealthAdvice(userMessage: string): Promise<string> {
    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: this.SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from DeepSeek API");
      }

      const data = await response.json();
      return this.formatResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      throw error;
    }
  }

  private static formatResponse(text: string): string {
    let formatted = text.replace(/\*\*/g, "");

    formatted = formatted.replace(/###/g, "\n###");

    formatted = formatted.replace(/•/g, "\n•");

    formatted = formatted.replace(/key points:?/gi, "\nKey Points:");

    if (!formatted.toLowerCase().includes("*note:")) {
      formatted +=
        "\n\n*Note: This is general health information. Always consult healthcare professionals for medical advice.*";
    }

    return formatted
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .join("\n");
  }
}
