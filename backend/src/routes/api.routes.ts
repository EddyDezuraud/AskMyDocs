import express from 'express';
import { chatController } from '../controllers/chat.controller';

const router = express.Router();

// Route for handling chat requests
router.post('/chat', chatController.chat);

// Route for reindexing documents
router.post('/reindex', chatController.reindex);

export default router;
