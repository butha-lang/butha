// concurrency.test.js

const { runConcurrent } = require('../concurrency.js');
const { expect } = require('chai');

describe('Butha Concurrency Tests', function() {

    it('should run concurrent tasks and handle results', async function() {
        const tasks = [
            async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return 'Task 1 done';
            },
            async () => {
                await new Promise(resolve => setTimeout(resolve, 200));
                return 'Task 2 done';
            },
            async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
                return 'Task 3 done';
            }
        ];

        const results = await runConcurrent(tasks);

        expect(results).to.deep.equal([
            'Task 1 done',
            'Task 2 done',
            'Task 3 done'
        ]);
    });

    it('should handle errors in concurrent tasks', async function() {
        const tasks = [
            async () => { throw new Error('Task 1 failed'); },
            async () => 'Task 2 done',
            async () => 'Task 3 done'
        ];

        try {
            await runConcurrent(tasks);
        } catch (error) {
            expect(error.message).to.equal('Task 1 failed');
        }
    });

    it('should handle synchronization primitives', function() {
        const syncTasks = [
            () => new Promise(resolve => setTimeout(() => resolve('Sync Task 1 done'), 100)),
            () => new Promise(resolve => setTimeout(() => resolve('Sync Task 2 done'), 200)),
            () => new Promise(resolve => setTimeout(() => resolve('Sync Task 3 done'), 50))
        ];

        return runConcurrent(syncTasks)
            .then(results => {
                expect(results).to.deep.equal([
                    'Sync Task 1 done',
                    'Sync Task 2 done',
                    'Sync Task 3 done'
                ]);
            });
    });

    it('should handle multiple sync operations with results', function() {
        const syncTasks = [
            () => new Promise(resolve => setTimeout(() => resolve('Sync 1'), 50)),
            () => new Promise(resolve => setTimeout(() => resolve('Sync 2'), 100)),
            () => new Promise(resolve => setTimeout(() => resolve('Sync 3'), 150))
        ];

        return runConcurrent(syncTasks)
            .then(results => {
                expect(results).to.deep.equal([
                    'Sync 1',
                    'Sync 2',
                    'Sync 3'
                ]);
            });
    });

});
