import express from 'express';
import { EventEmitter } from 'events';

const router = express.Router();
const eventEmitter = new EventEmitter();

// Increase the listener limit to avoid memory leaks if multiple requests are tracked
eventEmitter.setMaxListeners(100);

router.get('/logs', (req, res) => {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    function sendEvent(message: string) {
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
    }

    // Attach listener for this specific request ID
    const listener = (event: { message: string }) => {
        sendEvent(event.message);
    };

    eventEmitter.on('log', listener);

    req.on('close', () => {
        eventEmitter.removeListener('log', listener);
        res.end();
    });
});

// Function to send logs
export function logEvent(requestId: string, message: string) {
    eventEmitter.emit('log', { requestId, message });
}

export default router;