// di.test.js

const { DIContainer } = require('../di.js');
const { expect } = require('chai');

describe('Butha Dependency Injection Tests', function() {

    it('should register and resolve a service', function() {
        const container = new DIContainer();

        container.register('logger', () => {
            return {
                log: (message) => console.log(message)
            };
        });

        const logger = container.resolve('logger');
        expect(logger).to.have.property('log');
        expect(typeof logger.log).to.equal('function');
    });

    it('should inject dependencies into a class', function() {
        class UserService {
            constructor(logger) {
                this.logger = logger;
            }
            logUserAction(action) {
                this.logger.log(`User action: ${action}`);
            }
        }

        const container = new DIContainer();
        container.register('logger', () => ({
            log: (message) => console.log(message)
        }));
        container.register('userService', ['logger'], (logger) => new UserService(logger));

        const userService = container.resolve('userService');
        expect(userService).to.be.an.instanceof(UserService);
        expect(userService.logger).to.have.property('log');
    });

    it('should handle circular dependencies', function() {
        class A {
            constructor(b) {
                this.b = b;
            }
        }
        
        class B {
            constructor(a) {
                this.a = a;
            }
        }

        const container = new DIContainer();
        container.register('a', ['b'], (b) => new A(b));
        container.register('b', ['a'], (a) => new B(a));

        const a = container.resolve('a');
        const b = container.resolve('b');
        
        expect(a).to.be.an.instanceof(A);
        expect(b).to.be.an.instanceof(B);
        expect(a.b).to.equal(b);
        expect(b.a).to.equal(a);
    });

    it('should throw an error for unregistered service', function() {
        const container = new DIContainer();

        expect(() => container.resolve('nonexistentService')).to.throw('Service not registered');
    });

    it('should allow service replacement', function() {
        const container = new DIContainer();

        container.register('service', () => ({
            doSomething: () => 'original'
        }));

        let service = container.resolve('service');
        expect(service.doSomething()).to.equal('original');

        container.register('service', () => ({
            doSomething: () => 'updated'
        }), true);

        service = container.resolve('service');
        expect(service.doSomething()).to.equal('updated');
    });

});
