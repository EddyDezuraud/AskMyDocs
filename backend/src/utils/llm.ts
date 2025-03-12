import { getOllama } from "../models/ollama";
import { AskResponse } from "../types";

export async function ask(prompt: string): Promise<AskResponse> {
    try {
        const ollama = getOllama();
        const context = await ollama.invoke(prompt);

        const thinkMatch = context.match(/<think>(.*?)<\/think>/s);
        const think = thinkMatch ? thinkMatch[1].trim() : null;
        const answer = context.replace(/<think>.*?<\/think>/gs, '').trim();

        return {
            think: think || '',
            answer
        };
    } catch (error) {
        console.error("Error while generating context:", error);
        return { think: '', answer: '' }; // Return an empty string in case of an error
    }
}
