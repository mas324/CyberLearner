//import OpenAI from "openai";
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

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
    temperature: 0.5,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings: safetySettings, generationConfig: generationConfig });

async function ask(question) {
    const prompt = 'Simplify the following message, assuming the user has no knowledge of technology:' + question;
    const result = (await model.generateContent(prompt)).response.text();
    return result;
}
