// src/storage/vectorStore.ts
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "langchain/document";
import { getEmbeddings } from "../models/huggingface";
import { config } from "../config";
import { ChromaClient } from "chromadb";
const client = new ChromaClient();

export async function createVectorStore(docs: Document[]): Promise<Chroma> {
    return await Chroma.fromDocuments(docs, getEmbeddings(), {
        collectionName: config.CHROMA_COLLECTION_NAME,
        url: config.CHROMA_URL,
    });
}

export async function getVectorStore(): Promise<Chroma> {
    return await Chroma.fromExistingCollection(getEmbeddings(), {
        collectionName: config.CHROMA_COLLECTION_NAME,
        url: config.CHROMA_URL,
    });
}

export async function checkCollectionExists(): Promise<boolean> {
    try {
        await getVectorStore();
        return true;
    } catch (error) {
        console.log("The collection does not exist or an error occurred:", error);
        return false;
    }
}

export async function deleteVectorStore(): Promise<void> {
    try {
        const collection = await client.getOrCreateCollection({ name: config.CHROMA_COLLECTION_NAME });
        await client.deleteCollection(collection);
        console.log("Collection successfully deleted");
    } catch (error) {
        console.log("No collection to delete or an error occurred:", error);
    }
}
