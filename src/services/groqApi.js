import Groq from "groq-sdk";

// Load API Key securely
const apiKey = import.meta.env.VITE_GROQKEY;

const groq = new Groq({ 
  apiKey: apiKey, 
  dangerouslyAllowBrowser: true 
});

// Summarize text
export const summarizeTextWithGroq = async (text) => {
  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: `Summarize this text in 100 words:\n\n"${text}"` }],
      temperature: 0.7,
      max_tokens: 200,
      top_p: 1,
      stream: false,
    });

    return response.choices[0]?.message?.content || "Summarization failed.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Summarization error.";
  }
};

// Generate questions from text
export const generateQuestionsFromGroq = async (text) => {
  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: `Generate three questions based on this text:\n\n"${text}"` }],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      stream: false,
    });

    return response.choices[0]?.message?.content.split("\n").filter((q) => q) || [];
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

// Translate text
export const translateTextWithGroq = async (text, targetLanguage) => {
  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: `Translate the following text to ${targetLanguage}:\n\n"${text}"` }],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      stream: false,
    });

    return response.choices[0]?.message?.content || "Translation failed.";
  } catch (error) {
    console.error("Error translating text:", error);
    return "Translation error.";
  }
};
