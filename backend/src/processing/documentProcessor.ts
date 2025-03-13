import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as path from 'path';
import { config } from "../config";
import { generateChunkContext, generateContextSummary } from "../utils/contextGenerator";
import { BM25Index } from "../retrieval/bm25";

function cleanText(text: string): string {
    return text.replace(/\xa0/g, " "); // Remplace les espaces insécables par des espaces normaux
}

export async function processDocuments(rawDocs: Document[], improveChunk: boolean): Promise<{
    contextualizedDocs: Document[],
    bm25Index: BM25Index
}> {
    // Create a BM25 index
    const bm25Index = new BM25Index();

    // Group documents by source
    const docsBySource = new Map<string, { content: string, doc: Document }>();
    for (const doc of rawDocs) {
        const source = doc.metadata.source;
        if (!docsBySource.has(source)) {
            docsBySource.set(source, { content: "", doc });
        }
        docsBySource.get(source)!.content += cleanText(doc.pageContent) + " ";
    }

    // Split documents into chunks and add context
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: config.CHUNK_SIZE,
        chunkOverlap: config.CHUNK_OVERLAP,
    });

    const contextualizedDocs: Document[] = [];
    let chunkIndex = 0;

    for (const [source, { content }] of docsBySource.entries()) {
        console.log(`Processing document: ${path.basename(source)}`);

        // Check if the document is empty
        if (!content.trim()) {
            console.warn(`The document ${source} is empty. Skipping...`);
            continue;
        }

        // Generate a short document summary for context
        console.log(`Generating summary for document ${path.basename(source)}`);
        const summary = await generateContextSummary(content);
        if (!summary) {
            console.warn(`No summary generated for document ${source}. Skipping...`);
            continue;
        } else {
            console.log(`Generated summary: ${summary}`);
        }

        // Split the document into chunks
        const chunks = await textSplitter.createDocuments([content], [{ source }]);

        // For each chunk, generate context and create a new contextualized document
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkId = `chunk_${chunkIndex++}`;

            // Generate context for this chunk
            console.log(`Generating context for chunk ${i + 1}/${chunks.length} of ${path.basename(source)}`);
            const context = improveChunk ? await generateChunkContext(summary, chunk.pageContent) : chunk.pageContent;

            // Create a new document with prefixed context
            const contextualizedContent = `${context}\n\n${chunk.pageContent}`;
            const contextualizedDoc = new Document({
                pageContent: contextualizedContent,
                metadata: {
                    ...chunk.metadata,
                    chunkId,
                    originalContent: chunk.pageContent,
                    context
                }
            });

            contextualizedDocs.push(contextualizedDoc);

            // Add to BM25 index
            bm25Index.addDocument(chunkId, contextualizedContent);
        }
    }

    return { contextualizedDocs, bm25Index };
}
