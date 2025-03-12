// src/indexer.ts
import * as fs from 'fs';
import * as path from 'path';
import { loadDocuments } from './processing/documentLoader';
import { processDocuments } from './processing/documentProcessor';
import { createVectorStore, deleteVectorStore } from './storage/vectorStore';
import { config } from './config';

export async function indexDocumentsWithContextualRetrieval(): Promise<void> {
    console.log("Starting document indexing with Contextual Retrieval...");

    // 1. Load documents from the directory
    const rawDocs = await loadDocuments();
    console.log(`Successfully loaded ${rawDocs.length} documents.`);

    // 2. Process documents (chunking, contextualization, BM25 indexing)
    const { contextualizedDocs, bm25Index } = await processDocuments(rawDocs, true);
    console.log(`Created a total of ${contextualizedDocs.length} contextualized chunks.`);

    // 3. Index contextualized documents into ChromaDB
    await createVectorStore(contextualizedDocs);

    // 4. Save the BM25 index
    if (!fs.existsSync(config.CHROMA_DIRECTORY)) {
        fs.mkdirSync(config.CHROMA_DIRECTORY, { recursive: true });
    }

    fs.writeFileSync(
        path.join(config.CHROMA_DIRECTORY, 'bm25_index.json'),
        bm25Index.serialize()
    );

    console.log("Indexing successfully completed!");
}

export async function reindexDocuments(): Promise<void> {
    console.log("Deleting the old collection...");

    await deleteVectorStore();

    // Also remove the local BM25 index
    if (fs.existsSync(path.join(config.CHROMA_DIRECTORY, 'bm25_index.json'))) {
        fs.unlinkSync(path.join(config.CHROMA_DIRECTORY, 'bm25_index.json'));
    }

    await indexDocumentsWithContextualRetrieval();
}
