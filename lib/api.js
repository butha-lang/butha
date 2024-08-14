// api.js

const axios = require('axios'); // Assuming we're using Axios for HTTP requests

class APIManager {
    constructor() {
        this.endpoints = new Map(); // Stores endpoint configurations
    }

    // Register an API endpoint
    registerEndpoint(name, url, method = 'GET', headers = {}) {
        if (this.endpoints.has(name)) {
            throw new Error(`Endpoint with name ${name} already registered.`);
        }
        this.endpoints.set(name, { url, method, headers });
    }

    // Make a request to a registered endpoint
    async request(name, data = {}) {
        if (!this.endpoints.has(name)) {
            throw new Error(`Endpoint with name ${name} not found.`);
        }

        const { url, method, headers } = this.endpoints.get(name);

        try {
            const response = await axios({
                url,
                method,
                headers,
                data
            });
            return response.data;
        } catch (error) {
            throw new Error(`Request to ${name} failed: ${error.message}`);
        }
    }

    // Unregister an API endpoint
    unregisterEndpoint(name) {
        if (this.endpoints.has(name)) {
            this.endpoints.delete(name);
        } else {
            throw new Error(`Endpoint with name ${name} not found.`);
        }
    }

    // List all registered endpoints
    listEndpoints() {
        console.log('Registered Endpoints:');
        this.endpoints.forEach((config, name) => {
            console.log(`Name: ${name}, URL: ${config.url}, Method: ${config.method}`);
        });
    }
}

// Example usage
const apiManager = new APIManager();

// Register API endpoints
apiManager.registerEndpoint('getUser', 'https://jsonplaceholder.typicode.com/users/1');
apiManager.registerEndpoint('createPost', 'https://jsonplaceholder.typicode.com/posts', 'POST', {
    'Content-Type': 'application/json'
});

// Make requests
apiManager.request('getUser')
    .then(data => {
        console.log('User Data:', data);
    })
    .catch(err => {
        console.error('Error:', err.message);
    });

apiManager.request('createPost', { title: 'foo', body: 'bar', userId: 1 })
    .then(data => {
        console.log('Created Post:', data);
    })
    .catch(err => {
        console.error('Error:', err.message);
    });

// List all registered endpoints
apiManager.listEndpoints();

// Unregister an API endpoint
apiManager.unregisterEndpoint('getUser');
apiManager.listEndpoints();

module.exports = {
    APIManager,
    apiManager
};
