// di.js

class DependencyInjection {
    constructor() {
        this.services = new Map();
    }

    // Register a service with a specific name
    register(name, factory) {
        if (this.services.has(name)) {
            throw new Error(`Service with name ${name} already registered.`);
        }
        this.services.set(name, factory);
    }

    // Resolve and retrieve a service by its name
    resolve(name) {
        if (!this.services.has(name)) {
            throw new Error(`Service with name ${name} not found.`);
        }
        const factory = this.services.get(name);
        return factory(this);
    }

    // Register a singleton service
    registerSingleton(name, instance) {
        this.register(name, () => instance);
    }

    // Register a factory service
    registerFactory(name, factory) {
        this.register(name, factory);
    }
}

// Example usage

// Create a DI container
const diContainer = new DependencyInjection();

// Define and register services
class Logger {
    log(message) {
        console.log(message);
    }
}

class Database {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }

    connect() {
        console.log(`Connected to database with connection string: ${this.connectionString}`);
    }
}

// Register services
diContainer.registerSingleton('logger', new Logger());
diContainer.registerFactory('database', (di) => {
    const logger = di.resolve('logger');
    return new Database('mongodb://localhost:27017');
});

// Resolve and use services
const logger = diContainer.resolve('logger');
logger.log('Dependency Injection is working!');

const database = diContainer.resolve('database');
database.connect();

module.exports = {
    DependencyInjection,
    diContainer
};
