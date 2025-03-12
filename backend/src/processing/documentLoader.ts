// src/processing/documentLoader.ts
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { config } from "../config";
import { Document } from "langchain/document";

export async function loadDocuments(): Promise<Document[]> {
    const loader = new DirectoryLoader(config.DOCS_DIRECTORY, {
        ".txt": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        ".docx": (path) => new DocxLoader(path),
        // Add other file types as needed
    });

    return await loader.load();
}
