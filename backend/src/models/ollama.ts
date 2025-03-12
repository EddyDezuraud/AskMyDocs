// src/models/ollama.ts
import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";

import { config } from "../config";

// Singleton pattern for Ollama model instances
let ollamaInstance: Ollama | null = null;
let embeddingsInstance: OllamaEmbeddings | null = null;

export function getOllama(): Ollama {
    if (!ollamaInstance) {
        ollamaInstance = new Ollama({
            baseUrl: config.OLLAMA_BASE_URL,
            model: config.MODEL_NAME,
        });
    }
    return ollamaInstance;
}

export function getEmbeddings(): OllamaEmbeddings {
    if (!embeddingsInstance) {
        embeddingsInstance = new OllamaEmbeddings({
            baseUrl: config.OLLAMA_BASE_URL,
            model: config.EMBEDDING_MODEL,
        });
    }
    return embeddingsInstance;
}
