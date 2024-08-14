// concurrency.js

const { ButhaError, RuntimeError } = require('./error');
const { TaskQueue } = require('./taskQueue'); // Assuming taskQueue.js defines a TaskQueue class
const { EventEmitter } = require('events');

// Class to manage concurrency and asynchronous tasks
class ConcurrencyManager extends EventEmitter {
    constructor() {
        super();
        this.taskQueue = new TaskQueue();
        this.runningTasks = new Set();
    }

    // Add a task to the queue
    addTask(task) {
        if (typeof task !== 'function') {
            throw new ButhaError('Task must be a function');
        }
        this.taskQueue.enqueue(task);
        this.processQueue();
    }

    // Process tasks from the queue
    async processQueue() {
        if (this.runningTasks.size >= this.getMaxConcurrentTasks()) {
            return; // Limit concurrent tasks
        }

        const task = this.taskQueue.dequeue();
        if (task) {
            this.runningTasks.add(task);
            try {
                await task();
            } catch (error) {
                this.emit('error', new RuntimeError(`Task failed: ${error.message}`));
            } finally {
                this.runningTasks.delete(task);
                this.processQueue(); // Process next task
            }
        }
    }

    // Get the maximum number of concurrent tasks
    getMaxConcurrentTasks() {
        return 4; // Example limit, can be customized
    }

    // Wait for all tasks to complete
    async waitForAllTasks() {
        while (this.runningTasks.size > 0 || this.taskQueue.size > 0) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait before checking again
        }
    }
}

// Function to handle async task
function asyncTaskFunction(runtime, args) {
    if (args.length !== 1 || typeof args[0] !== 'function') {
        throw new RuntimeError('asyncTask requires exactly 1 function argument');
    }
    const [task] = args;
    const concurrencyManager = runtime.getVariable('concurrencyManager');
    if (concurrencyManager instanceof ConcurrencyManager) {
        concurrencyManager.addTask(task);
    } else {
        throw new RuntimeError('ConcurrencyManager is not available');
    }
}

// Function to wait for all tasks to complete
function waitForAllTasksFunction(runtime, args) {
    const concurrencyManager = runtime.getVariable('concurrencyManager');
    if (concurrencyManager instanceof ConcurrencyManager) {
        return concurrencyManager.waitForAllTasks();
    } else {
        throw new RuntimeError('ConcurrencyManager is not available');
    }
}

// Initialize concurrency manager and add built-in functions
const concurrencyManager = new ConcurrencyManager();
const runtime = require('./runtime'); // Assuming runtime.js exports the runtime instance
runtime.addBuiltInFunction('asyncTask', asyncTaskFunction);
runtime.addBuiltInFunction('waitForAllTasks', waitForAllTasksFunction);

// Example usage
(async () => {
    try {
        runtime.setVariable('concurrencyManager', concurrencyManager);

        // Define some async tasks
        const task1 = () => new Promise(resolve => {
            setTimeout(() => {
                console.log('Task 1 completed');
                resolve();
            }, 1000);
        });

        const task2 = () => new Promise(resolve => {
            setTimeout(() => {
                console.log('Task 2 completed');
                resolve();
            }, 500);
        });

        // Add tasks to concurrency manager
        concurrencyManager.addTask(task1);
        concurrencyManager.addTask(task2);

        // Wait for all tasks to complete
        await concurrencyManager.waitForAllTasks();
        console.log('All tasks completed');
    } catch (error) {
        console.error('Concurrency error:', error.toString());
    }
})();

module.exports = ConcurrencyManager;
