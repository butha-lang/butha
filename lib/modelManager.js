// modelManager.js

const { ButhaError, RuntimeError } = require('./error');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs'); // TensorFlow.js for ML models

class ModelManager {
    constructor() {
        this.models = new Map(); // Map to store loaded models
    }

    // Load a model from a file
    async loadModel(filePath, type = 'tensorflow') {
        try {
            const fullPath = path.resolve(filePath);
            if (!fs.existsSync(fullPath)) {
                throw new ButhaError(`Model file ${filePath} does not exist`);
            }

            let model;
            switch (type) {
                case 'tensorflow':
                    model = await tf.loadLayersModel(`file://${fullPath}`);
                    break;
                case 'onnx':
                    // Handle ONNX model loading here (using an appropriate library)
                    throw new ButhaError('ONNX model loading not yet implemented');
                default:
                    throw new ButhaError(`Unsupported model type: ${type}`);
            }

            this.models.set(filePath, { model, type });
            console.log(`Model ${filePath} of type ${type} loaded successfully`);
            return model;
        } catch (error) {
            throw new RuntimeError(`Error loading model: ${error.message}`);
        }
    }

    // Make a prediction using a loaded model
    async predict(filePath, inputData) {
        const modelEntry = this.models.get(filePath);
        if (!modelEntry) {
            throw new ButhaError(`Model ${filePath} is not loaded`);
        }

        try {
            const { model, type } = modelEntry;
            const tensorInput = tf.tensor(inputData); // TensorFlow.js example

            let prediction;
            if (type === 'tensorflow') {
                prediction = model.predict(tensorInput);
            } else {
                throw new ButhaError(`Unsupported model type for prediction: ${type}`);
            }

            return prediction.arraySync(); // Convert tensor to array
        } catch (error) {
            throw new RuntimeError(`Error during prediction: ${error.message}`);
        }
    }

    // Unload a model
    unloadModel(filePath) {
        if (!this.models.has(filePath)) {
            throw new ButhaError(`Model ${filePath} is not loaded`);
        }

        this.models.delete(filePath);
        console.log(`Model ${filePath} unloaded successfully`);
    }

    // List all loaded models
    listModels() {
        return Array.from(this.models.keys());
    }
}

// Example usage
async function exampleUsage() {
    const modelManager = new ModelManager();

    try {
        // Load a TensorFlow model
        await modelManager.loadModel('model/model.json', 'tensorflow');

        // Make a prediction with the loaded model
        const inputData = [[1, 2, 3, 4]]; // Example input
        const prediction = await modelManager.predict('model/model.json', inputData);
        console.log('Model prediction:', prediction);

        // List all loaded models
        console.log('Loaded models:', modelManager.listModels());

        // Unload the model
        modelManager.unloadModel('model/model.json');
    } catch (error) {
        console.error('Model Manager error:', error.toString());
    }
}

exampleUsage();

module.exports = ModelManager;
