# AskMyDocs

**⚠ This project is currently under development.**

AskMyDocs is an open-source chatbot powered by LLM and Retrieval-Augmented Generation (RAG).  
It allows users to upload documents (PDF, DOCX, TXT, etc.) and ask questions based on the extracted content.

## Features

- RAG-based chatbot: Uses a vector database and BM25 search to retrieve relevant information.
- Supports multiple document formats: PDF, DOCX, TXT, and more.
- Contextual indexing: Summarizes and chunks documents for improved search retrieval.
- Real-time file monitoring: Automatically indexes new documents added to the directory.

## Project Structure

```
/backend/                   # Backend of the project (API and document processing)
│── src/
│   │── config/             # Configuration files
│   │── controllers/        # Express.js controllers handling API requests
│   │── models/             # LLM and embedding model management
│   │── processing/         # Document processing (loading, splitting)
│   │── retrieval/          # Retrieval models (BM25, vector search, reranking)
│   │── storage/            # Vector storage (ChromaDB integration)
│   │── utils/              # Utility functions (translation, context generation)
│   │── routes/             # API routes for Express.js
│   │── index.ts            # Main server entry point
│── package.json            # Backend dependencies

/frontend/                  # Frontend of the project (Nuxt3 chat interface)

/resources/                 # Directory for storing documents
│── docs/                   # Here you can place your documents (PDF, DOCX, TXT, etc.)
```

## Backend Overview

### `config/`
Contains all configuration settings, such as API keys, model names, and directory paths.

### `controllers/`
Holds Express.js controllers for handling API endpoints. The main controller is:
- **`chat.controller.ts`**: Manages the `/chat` and `/reindex` endpoints.

### `models/`
Defines the connection with the LLM (Ollama) and embedding models:
- **`ollama.ts`**: Implements a singleton pattern for efficient model access.

### `processing/`
Handles document loading, chunking, and preprocessing before indexing:
- **`documentLoader.ts`**: Loads documents from the specified directory.
- **`documentProcessor.ts`**: Splits documents into smaller chunks and generates context.

### `retrieval/`
Implements retrieval techniques for fetching relevant information:
- **`bm25.ts`**: Implements BM25 search for keyword-based retrieval.
- **`reranker.ts`**: Uses an LLM to rerank retrieved results based on query relevance.

### `storage/`
Manages vector storage for embedding-based retrieval:
- **`vectorStore.ts`**: Interfaces with ChromaDB to store and retrieve document embeddings.

### `utils/`
Provides helper functions for processing queries:
- **`contextGenerator.ts`**: Generates summaries and contextual information for better retrieval.
- **`translation.ts`**: Translates queries to English before retrieval.

### `routes/`
Defines API endpoints using Express.js:
- **`api.routes.ts`**: Defines routes for interacting with the chatbot.

### `index.ts`
The main entry point of the application.
- Initializes the Express.js server.
- Loads the vector database at startup.
- Handles API routes.

## Frontend Overview

The frontend is built with **Nuxt3** and provides a chat interface for interacting with the chatbot.  
It connects to the backend via API requests to send queries and display responses.

## Getting Started

### 1. Install Ollama

This project uses **Ollama** to run the language model locally. You need to install it before running the backend.

#### Install Ollama:
```sh
curl -fsSL https://ollama.com/install.sh | sh
```

#### Download the `gemma3` model (or modify the model in `config.ts`):
```sh
ollama pull gemma3
```

If you want to use another model, update the **`OLLAMA_MODEL`** in the configuration file:
```ts
// src/config.ts
export const config = {
  OLLAMA_MODEL: "gemma3",  // Change this if needed
  CHROMA_COLLECTION_NAME: "askmydocs",
  EXPRESS_PORT: 3000,
  DOCS_DIRECTORY: "./resources/docs",
};
```

### 2. Add Documents

Before running the indexing, make sure you have some documents inside the `/resources/docs/` folder.  
You can place **PDF, DOCX, TXT, and other supported formats** in this directory.

Example:
```
/resources/docs/
│── example.pdf
│── notes.txt
│── report.docx
```

### 3. Install Dependencies

Run the following command to install dependencies:
```sh
npm install
```

### 4. Start the Backend

```sh
npm run start
```

### 5. Use the API

#### Chat with Documents
```sh
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message": "What is this document about?"}'
```

#### Reindex Documents
```sh
curl -X POST http://localhost:3000/api/reindex
```

## Tech Stack

- TypeScript
- Express.js
- LangChain
- ChromaDB
- Ollama (LLM-based processing)
- BM25 Algorithm for keyword search
- Nuxt3 (Frontend)

## Future Improvements

- Support for more file formats (CSV, JSON, Markdown).
- Enhanced ranking using a hybrid approach (BM25 + Vector Search + LLM).
- API authentication for secured endpoints.

## Contribute
Feel free to contribute to this project by submitting issues or pull requests.  
