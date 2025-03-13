// src/models/ollama.ts
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

import { config } from "../config";
let embeddingsInstance: HuggingFaceTransformersEmbeddings | null = null;

export function getEmbeddings(): HuggingFaceTransformersEmbeddings {
    if (!embeddingsInstance) {
        embeddingsInstance = new HuggingFaceTransformersEmbeddings({
            model: config.HUGGINGFACE_EMBEDDING_MODEL,
            // Options supplémentaires si nécessaires
            // maxConcurrency: 5,
            // maxRetries: 3,
        });
    }
    return embeddingsInstance;
}
