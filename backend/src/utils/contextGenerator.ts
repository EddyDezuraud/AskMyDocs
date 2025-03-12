// src/utils/contextGenerator.ts
import { ask } from "./llm";

export async function generateContextSummary(fullDocument: string): Promise<string> {
    try {
        const prompt = `Here is a document we want to summarize in order to improve the search retrieval of this document.
        <document>
        ${fullDocument}
        </document> Please give a very short succinct summary in 1 or 2 lines to situate this document within the overall context for the purposes of improving search retrieval of the document. 
        Answer only with the succinct summary and nothing else.`;

        const { answer: summary } = await ask(prompt);
        return summary;
    } catch (error) {
        console.error("Error while generating the summary:", error);
        return ""; // Return an empty string in case of an error
    }
}

export async function generateChunkContext(summary: string, chunk: string): Promise<string> {
    try {
        const prompt = `
        I have a document with the following summary:
        <document_summary>
        ${summary}
        </document_summary>
        Here is a chunk we want to transform into a short context in order to improve the search retrieval of this chunk.
        <chunk>
        ${chunk}
        </chunk> Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. 
        Answer only with the succinct context and nothing else.`;

        const { answer: context } = await ask(prompt);
        return context;
    } catch (error) {
        console.error("Error while generating the context:", error);
        return ""; // Return an empty string in case of an error
    }
}
