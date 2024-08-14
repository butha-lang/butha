// collaboration.test.js

const { CollaborationManager, CollaborationSession } = require('../collaboration.js');
const { expect } = require('chai');

describe('Butha Collaboration Tests', function() {

    it('should create a new collaboration session', function() {
        const manager = new CollaborationManager();
        const session = manager.createSession('Test Session');

        expect(session).to.be.instanceof(CollaborationSession);
        expect(session.name).to.equal('Test Session');
    });

    it('should add and remove participants from a session', function() {
        const manager = new CollaborationManager();
        const session = manager.createSession('Test Session');

        session.addParticipant('User1');
        session.addParticipant('User2');
        expect(session.participants).to.include.members(['User1', 'User2']);

        session.removeParticipant('User1');
        expect(session.participants).to.not.include('User1');
    });

    it('should sync document changes across participants', function(done) {
        const manager = new CollaborationManager();
        const session = manager.createSession('Test Session');

        session.addParticipant('User1');
        session.addParticipant('User2');

        session.on('change', (changes) => {
            expect(changes).to.have.property('document');
            expect(changes.document).to.include('Updated Content');
            done();
        });

        session.updateDocument('Updated Content');
    });

    it('should handle concurrent edits correctly', function(done) {
        const manager = new CollaborationManager();
        const session = manager.createSession('Test Session');

        session.addParticipant('User1');
        session.addParticipant('User2');

        let edits = 0;
        session.on('edit', () => {
            edits++;
            if (edits === 2) {
                expect(session.document).to.equal('Concurrent Edit');
                done();
            }
        });

        session.updateDocument('Concurrent Edit');
        session.updateDocument('Concurrent Edit');
    });

    it('should manage version control within a session', function() {
        const manager = new CollaborationManager();
        const session = manager.createSession('Test Session');

        session.addParticipant('User1');

        session.updateDocument('Version 1');
        session.updateDocument('Version 2');
        session.updateDocument('Version 3');

        const history = session.getVersionHistory();
        expect(history).to.have.lengthOf(3);
        expect(history[0]).to.equal('Version 1');
        expect(history[1]).to.equal('Version 2');
        expect(history[2]).to.equal('Version 3');
    });

});
