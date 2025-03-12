// src/retrieval/bm25.ts
import { BM25SearchResult } from "../types";

export class BM25Index {
    private documents: Map<string, string[]> = new Map();
    private idf: Map<string, number> = new Map();
    private docLengths: Map<string, number> = new Map();
    private avgDocLength: number = 0;
    private k1: number = 1.5;
    private b: number = 0.75;

    // Simple tokenizer
    private tokenize(text: string): string[] {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 1);
    }

    // Add a document to the index
    public addDocument(docId: string, text: string): void {
        const tokens = this.tokenize(text);
        this.documents.set(docId, tokens);
        this.docLengths.set(docId, tokens.length);

        // Update the average document length
        let totalLength = 0;
        for (const length of this.docLengths.values()) {
            totalLength += length;
        }
        this.avgDocLength = totalLength / this.docLengths.size;

        // Recalculate IDF for all terms
        const termFrequencies = new Map<string, number>();
        for (const [, docTokens] of this.documents.entries()) {
            const uniqueTokens = new Set(docTokens);
            for (const token of uniqueTokens) {
                termFrequencies.set(token, (termFrequencies.get(token) || 0) + 1);
            }
        }

        // Compute IDF
        const N = this.documents.size;
        for (const [term, frequency] of termFrequencies.entries()) {
            this.idf.set(term, Math.log((N - frequency + 0.5) / (frequency + 0.5) + 1));
        }
    }

    // Search for documents
    public search(query: string, k: number = 10): Array<BM25SearchResult> {
        const queryTokens = this.tokenize(query);
        const scores = new Map<string, number>();

        for (const [docId, docTokens] of this.documents.entries()) {
            let score = 0;
            const docLength = this.docLengths.get(docId) || 0;

            // Count occurrences of each term in the document
            const termFrequencies = new Map<string, number>();
            for (const token of docTokens) {
                termFrequencies.set(token, (termFrequencies.get(token) || 0) + 1);
            }

            for (const token of queryTokens) {
                const idf = this.idf.get(token) || 0;
                const tf = termFrequencies.get(token) || 0;

                // BM25 formula
                const numerator = tf * (this.k1 + 1);
                const denominator = tf + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));

                score += idf * (numerator / denominator);
            }

            if (score > 0) {
                scores.set(docId, score);
            }
        }

        // Sort and return the top k results
        return Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, k)
            .map(([docId, score]) => ({ docId, score }));
    }

    // Serialize the index
    public serialize(): string {
        return JSON.stringify({
            documents: Array.from(this.documents.entries()),
            idf: Array.from(this.idf.entries()),
            docLengths: Array.from(this.docLengths.entries()),
            avgDocLength: this.avgDocLength
        });
    }

    // Deserialize the index
    public static deserialize(data: string): BM25Index {
        const index = new BM25Index();
        const parsed = JSON.parse(data);

        index.documents = new Map(parsed.documents);
        index.idf = new Map(parsed.idf);
        index.docLengths = new Map(parsed.docLengths);
        index.avgDocLength = parsed.avgDocLength;

        return index;
    }
}
