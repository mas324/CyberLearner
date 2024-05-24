//import OpenAI from "openai";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.EXPO_PUBLIC_GEMINI_API as string
);

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
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
    // console.log("asking question", question);
    const prompt =
        "Simplify the following message, assuming the user has no knowledge of technology:" +
        question;
    try {
        let result = (await model.generateContent(prompt)).response.text();
        if (result.includes("**Simplified Message:**")) {
            result = result.replace("**Simplified Message:**", "").trim();
        }
        return result;
    } catch (error) {
        console.log("question caused fail", question, error);
        return null;
    }
}

export async function createQuestion(data: string) {
    const prompt =
        "Create a question with 2 answers and 6 false answers. Use JSON formatting. Use the following for information: " +
        data;
    let result = (await model.generateContent(prompt)).response.text();
    console.log("preslice", result);
    result = result.slice(7, -3).trim();
    console.log("postslice", result);
    const tl = JSON.parse(result);
    return tl;
}
