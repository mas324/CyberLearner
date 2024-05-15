//import OpenAI from "openai";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDogBSNibVaxisn_1KDPYQEp8EbQz_my6U");

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const generationConfig = {
  temperature: 0.0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings: safetySettings,
  generationConfig: generationConfig,
});

export async function ask(question: string) {
  console.log("asking question", question);
  const prompt =
    "Simplify the following message, assuming the user has no knowledge of technology:" +
    question;
  let result = (await model.generateContent(prompt)).response.text();
  if (result.includes("**Simplified Message:**")) {
    result = result.replace("**Simplified Message:**", "").trim();
  }
  return result;
}

export async function createQuestion(data: string) {
  const prompt =
    "Given the following description, create a question with 2 answers and 6 false answers with each answer delimit the real ones with # and the false ones with $." +
    data;
  let result = (await model.generateContent(prompt)).response.text();
  result = result.trim();
  return result;
}
