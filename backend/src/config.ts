import dotenv from 'dotenv';
import path from "path";
dotenv.config();

export const config = {
    MODEL_NAME: "gemma3", // "llama3.2" for Llama 3.2
    EMBEDDING_MODEL: "llama3.2", // nomic-embed-text:latest
    DOCS_DIRECTORY: "../resources/docs",
    CHROMA_URL: "http://localhost:8000",
    CHROMA_COLLECTION_NAME: "contextualized_documents",
    CHROMA_DIRECTORY: path.resolve(process.cwd(), '..', 'resources', 'chroma'),
    CHUNK_SIZE: 800,
    CHUNK_OVERLAP: 150,
    TOP_K_INITIAL: 40,
    TOP_K_RESULTS: 20,
    OLLAMA_BASE_URL: "http://localhost:11434",
    EXPRESS_PORT: 3001,
};