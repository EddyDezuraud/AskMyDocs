import { Request, Response } from 'express';
import {
    queryDocumentsWithContextualRetrieval,
    reindexDocuments
} from '../index';

export const chatController = {

    // POST /chat
    // Entry point for chat requests
    chat(req: Request, res: Response) {
        (async () => {
            try {
                const { message } = req.body;

                if (!message) {
                    return res.status(400).json({ error: 'Query is required' });
                } else {
                    console.log("New chat message: ", message);
                }

                const answer = await queryDocumentsWithContextualRetrieval(message);

                console.log("Answer: ", answer.answer);
                res.json(answer);
            } catch (error) {
                console.error('Error in chat controller:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        })();
    },

    // POST /reindex
    // Endpoint to trigger document reindexing
    reindex(req: Request, res: Response) {
        (async () => {
            try {
                await reindexDocuments();
                res.json({ message: 'Reindexing completed successfully!' });
            } catch (error) {
                console.error('Error in reindex controller:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        })();
    }
}
