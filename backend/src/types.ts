import { Document } from "langchain/document";

export interface ScoredDocument {
    doc: Document;
    score: number;
}

export interface BM25SearchResult {
    docId: string;
    score: number;
}

export interface DocumentWithContext {
    originalContent: string;
    context: string;
    source: string;
    chunkId: string;
}

export interface AskResponse {
    think: string;
    answer: string;
}