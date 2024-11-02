import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 20000, // Increased timeout
        transports: ['websocket', 'polling'], // Added polling as fallback
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    };
    
    const socket = io('https://codex-server-2q2m.onrender.com', options);
    
    // Add connection event handlers
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
    
    return socket;
};