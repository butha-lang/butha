// event.js

class EventEmitter {
    constructor() {
        this.events = new Map(); // Stores event handlers for each event type
    }

    // Register an event handler for a specific event type
    on(eventType, handler) {
        if (!this.events.has(eventType)) {
            this.events.set(eventType, []);
        }
        this.events.get(eventType).push(handler);
    }

    // Emit an event to all registered handlers
    emit(eventType, ...args) {
        if (this.events.has(eventType)) {
            this.events.get(eventType).forEach(handler => {
                try {
                    handler(...args);
                } catch (error) {
                    console.error(`Error in event handler for ${eventType}: ${error.message}`);
                }
            });
        }
    }

    // Remove a specific handler for an event type
    off(eventType, handler) {
        if (this.events.has(eventType)) {
            const handlers = this.events.get(eventType);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    // Remove all handlers for a specific event type
    removeAllListeners(eventType) {
        if (this.events.has(eventType)) {
            this.events.delete(eventType);
        }
    }

    // List all registered events and their handlers
    listEvents() {
        console.log('Registered Events:');
        this.events.forEach((handlers, eventType) => {
            console.log(`Event Type: ${eventType}`);
            handlers.forEach((handler, index) => {
                console.log(`  Handler ${index + 1}: ${handler.toString()}`);
            });
        });
    }
}

// Example usage
const eventEmitter = new EventEmitter();

// Event handlers
function onUserLogin(username) {
    console.log(`User ${username} logged in.`);
}

function onUserLogout(username) {
    console.log(`User ${username} logged out.`);
}

// Register event handlers
eventEmitter.on('userLogin', onUserLogin);
eventEmitter.on('userLogout', onUserLogout);

// Emit events
eventEmitter.emit('userLogin', 'Alice');
eventEmitter.emit('userLogout', 'Bob');

// List all events
eventEmitter.listEvents();

// Remove a specific event handler
eventEmitter.off('userLogin', onUserLogin);
eventEmitter.listEvents();

// Remove all handlers for an event type
eventEmitter.removeAllListeners('userLogout');
eventEmitter.listEvents();

module.exports = {
    EventEmitter,
    eventEmitter
};
