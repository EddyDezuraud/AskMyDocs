import { ask } from "./llm";

export async function translateQueryToEnglish(query: string): Promise<string> {
    try {
        const { franc } = await import("franc-min");

        if (franc(query) === "eng") {
            console.log("Query is already in English. Skipping translation.");
            return query;
        }

        console.log("Translating query to English...");
        const prompt = `
            You are an expert translator. Translate the following query from any language into English.
            Retain only the relevant information for a document search.
            Rephrase the query to make it clear and precise in English.
            Return ONLY the English translation, without any additional text or comments.
            
            Original query: "${query}"
            
            English translation:`;

        const { answer: translatedQuery } = await ask(prompt);

        console.log(`Original query: "${query}"`);
        console.log(`Translated query: "${translatedQuery}"`);

        return translatedQuery;
    } catch (error) {
        console.error("Error while translating the query:", error);
        // If an error occurs, return the original query
        return query;
    }
}