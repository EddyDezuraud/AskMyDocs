// src/retrieval/reranker.ts
import { Document } from "langchain/document";
import { ScoredDocument } from "../types";
import { config } from "../config";
import { ask } from "../utils/llm";

export async function rerankResults(results: Document[], query: string): Promise<Document[]> {

    const rerankPrompt = `
        You are an efficient reranking system. Your task is to evaluate the relevance of each passage based on the query.
        For each passage, assign a score from 0 to 10, where 10 is extremely relevant and 0 is completely irrelevant.
        
        IMPORTANT: If you find a passage that perfectly answers the query (deserving a score of 10), 
        assign it a score of 10 and give a score of 0 to all other passages.

        Query: ${query}

        ${results.map((doc, index) => `PASSAGE ${index + 1}:
        ${doc.pageContent}
        `).join('\n')}

        INSTRUCTIONS:
        1. Return only the scores in JSON format: {"scores": [3, 7, 10, ...]}
        2. Do not return any additional explanation, only the JSON.
        3. Ensure the scores accurately reflect the relevance to the query.
        4. If a passage is completely irrelevant or adds nothing to the original request, assign it a score of 0.
        `;

    try {
        console.log(`Reranking ${results.length} results...`);
        const { answer: response } = await ask(rerankPrompt);
        // Parse the returned JSON
        const scoresMatch = response.match(/\{[\s\S]*?\}/);
        if (!scoresMatch) {
            console.error("No JSON found in the reranking response");
            return results.slice(0, config.TOP_K_RESULTS); // Fallback to initial results
        }

        const scores = JSON.parse(scoresMatch[0]).scores || [];

        // Combine documents with their scores and sort them
        const scoredDocs: ScoredDocument[] = results.map((doc, i) => ({
            doc,
            score: i < scores.length ? scores[i] : 0
        }));

        // Filter out documents with a score of 0
        const filteredDocs = scoredDocs.filter(item => item.score > 0);

        console.log(`After reranking, ${filteredDocs.length} documents have a score above 0.`);

        // Sort in descending order of score
        filteredDocs.sort((a, b) => b.score - a.score);

        // Return the top-ranked documents based on TOP_K_RESULTS
        return filteredDocs.slice(0, config.TOP_K_RESULTS).map(item => item.doc);
    } catch (error) {
        console.error("Error during reranking:", error);
        return results.slice(0, config.TOP_K_RESULTS); // Fallback to initial results
    }
}
