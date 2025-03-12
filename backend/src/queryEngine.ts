// src/queryEngine.ts
import * as path from 'path';
import { getVectorStore } from './storage/vectorStore';
import { rerankResults } from './retrieval/reranker';
import { config } from './config';
import { Document } from "langchain/document";
import { translateQueryToEnglish } from "./utils/translation";
import { ask } from "./utils/llm";

export async function queryDocumentsWithContextualRetrieval(query: string): Promise<{ answer: string, context: Document[], think: string }> {
    console.log(`Processing query: ${query}`);

    // 1. Initialize ChromaDB and the Ollama model
    const vectorStore = await getVectorStore();

    // 1.2 Translate the query to English
    const translatedQuery = await translateQueryToEnglish(query);
    // const translatedQuery = query;

    // 2. Search using embeddings
    console.log("Performing similarity search using embeddings...");
    const embeddingResults = await vectorStore.similaritySearch(translatedQuery, config.TOP_K_INITIAL);

    // 3. Rerank the results
    console.log("Reranking the search results...");
    const rerankedResults = await rerankResults(embeddingResults, translatedQuery);

    // 4. Prepare context for Ollama
    const context = rerankedResults.map(doc => {
        // Extract the original content and metadata context
        const originalContent = doc.metadata.originalContent || doc.pageContent;
        const context = doc.metadata.context || "";

        return `Source: ${path.basename(doc.metadata.source)}
Context: ${context}
Content:
${originalContent}`;
    }).join("\n\n");

    // 5. Generate a response using Ollama
    console.log("Generating response with Ollama...");
    const prompt = `
You are a technical assistant using Contextual Retrieval. 
Provide a **short and precise answer** in the user's language based only on the retrieved context.

If the retrieved context does not contain enough information, simply reply: "Not enough information available."

Context:
${context}

Question:
${query}

Answer (keep it concise):`;

    const { answer, think } = await ask(prompt);

    return { answer: answer.trim(), context: rerankedResults, think };
}