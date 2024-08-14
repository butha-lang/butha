// ml.test.js

const { MLModel, TrainingData, MLManager } = require('../ml.js');
const { expect } = require('chai');

describe('Butha Machine Learning Tests', function() {

    it('should create and train a simple model', async function() {
        const data = new TrainingData();
        data.addSample([1, 2], [3]); // Sample: input [1, 2], output [3]
        data.addSample([4, 5], [9]); // Sample: input [4, 5], output [9]

        const model = new MLModel();
        await model.train(data, { epochs: 10 });

        const predictions = model.predict([1, 2]);
        expect(predictions).to.be.an('array').that.is.not.empty;
    });

    it('should evaluate a trained model', async function() {
        const data = new TrainingData();
        data.addSample([1, 2], [3]);
        data.addSample([4, 5], [9]);

        const model = new MLModel();
        await model.train(data, { epochs: 10 });

        const evaluation = await model.evaluate(data);
        expect(evaluation).to.have.property('accuracy').that.is.a('number');
    });

    it('should handle different model architectures', async function() {
        const data = new TrainingData();
        data.addSample([1, 2], [3]);
        data.addSample([4, 5], [9]);

        const model = new MLModel({ layers: [2, 5, 1] });
        await model.train(data, { epochs: 10 });

        const predictions = model.predict([1, 2]);
        expect(predictions).to.be.an('array').that.is.not.empty;
    });

    it('should support saving and loading models', async function() {
        const data = new TrainingData();
        data.addSample([1, 2], [3]);
        data.addSample([4, 5], [9]);

        const model = new MLModel();
        await model.train(data, { epochs: 10 });

        await model.save('model.json');
        
        const loadedModel = new MLModel();
        await loadedModel.load('model.json');

        const predictions = loadedModel.predict([1, 2]);
        expect(predictions).to.be.an('array').that.is.not.empty;
    });

    it('should handle real-time predictions', async function() {
        const data = new TrainingData();
        data.addSample([1, 2], [3]);
        data.addSample([4, 5], [9]);

        const model = new MLModel();
        await model.train(data, { epochs: 10 });

        const prediction = await model.predictRealTime([1, 2]);
        expect(prediction).to.be.a('number');
    });

});
