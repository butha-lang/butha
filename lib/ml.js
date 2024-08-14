// ml.js

const { ButhaError, RuntimeError } = require('./error');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs'); // TensorFlow.js for machine learning

class MLManager {
    constructor() {
        this.models = new Map(); // Map to store loaded ML models
    }

    // Load a TensorFlow model from a file
    async loadModel(filePath) {
        try {
            const fullPath = path.resolve(filePath);
            if (!fs.existsSync(fullPath)) {
                throw new ButhaError(`Model file ${filePath} does not exist`);
            }

            const model = await tf.loadLayersModel(`file://${fullPath}`);
            this.models.set(filePath, model);
            console.log(`ML model ${filePath} loaded successfully`);
            return model;
        } catch (error) {
            throw new RuntimeError(`Error loading ML model: ${error.message}`);
        }
    }

    // Make a prediction using a loaded model
    async predict(filePath, inputData) {
        const model = this.models.get(filePath);
        if (!model) {
            throw new ButhaError(`ML model ${filePath} is not loaded`);
        }

        try {
            const tensorInput = tf.tensor(inputData);
            const prediction = model.predict(tensorInput);
            return prediction.arraySync(); // Convert tensor to array
        } catch (error) {
            throw new RuntimeError(`Error during prediction: ${error.message}`);
        }
    }

    // Unload a TensorFlow model
    unloadModel(filePath) {
        if (!this.models.has(filePath)) {
            throw new ButhaError(`ML model ${filePath} is not loaded`);
        }

        this.models.delete(filePath);
        console.log(`ML model ${filePath} unloaded successfully`);
    }
}

// Example usage
async function exampleUsage() {
    const mlManager = new MLManager();

    try {
        // Load a TensorFlow model
        await mlManager.loadModel('model/model.json');

        // Make a prediction with the loaded model
        const inputData = [[1, 2, 3, 4]]; // Example input
        const prediction = await mlManager.predict('model/model.json', inputData);
        console.log('Model prediction:', prediction);

        // Unload the ML model
        mlManager.unloadModel('model/model.json');
    } catch (error) {
        console.error('ML Manager error:', error.toString());
    }
}

exampleUsage();

module.exports = MLManager;
