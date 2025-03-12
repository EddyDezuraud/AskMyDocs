// src/index.ts
import { indexDocumentsWithContextualRetrieval, reindexDocuments } from './indexer';
import { queryDocumentsWithContextualRetrieval } from './queryEngine';
import {checkCollectionExists} from './storage/vectorStore';
import { config } from './config';

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';
import eventsRoutes from './routes/events.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/events', eventsRoutes);


async function startServer() {


  // Initialize the vector database on startup
  const isCollection = await checkCollectionExists()

  if(!isCollection) {
    console.log("Empty collection. Creating a new database with Contextual Retrieval...");
    await indexDocumentsWithContextualRetrieval();
  }

  // Start the server
  app.listen(config.EXPRESS_PORT, () => {
    console.log(`Server started on port ${config.EXPRESS_PORT}`);
  });
}

startServer().catch(console.error);

// Export main functions for use in other files
export {
  indexDocumentsWithContextualRetrieval,
  queryDocumentsWithContextualRetrieval,
  reindexDocuments
};