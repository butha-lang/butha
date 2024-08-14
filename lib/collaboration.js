// collaboration.js

const { ButhaError, RuntimeError } = require('./error');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');
const { diffWordsWithSpace, applyPatch } = require('diff'); // Using 'diff' for collaborative editing

class CollaborationManager extends EventEmitter {
    constructor() {
        super();
        this.documents = new Map(); // Store active documents
        this.changes = new Map(); // Store document changes for version control
    }

    // Create a new document
    createDocument(documentId, content = '') {
        if (this.documents.has(documentId)) {
            throw new ButhaError(`Document with ID ${documentId} already exists`);
        }

        this.documents.set(documentId, content);
        this.changes.set(documentId, []); // Initialize change history
        console.log(`Document ${documentId} created successfully`);
    }

    // Load a document from file
    loadDocument(filePath) {
        try {
            const fullPath = path.resolve(filePath);
            if (!fs.existsSync(fullPath)) {
                throw new ButhaError(`File ${filePath} does not exist`);
            }

            const content = fs.readFileSync(fullPath, 'utf8');
            const documentId = uuidv4(); // Generate a unique ID for the document
            this.createDocument(documentId, content);
            return documentId;
        } catch (error) {
            throw new RuntimeError(`Error loading document: ${error.message}`);
        }
    }

    // Save a document to file
    saveDocument(documentId, filePath) {
        const content = this.documents.get(documentId);
        if (!content) {
            throw new ButhaError(`Document ${documentId} does not exist`);
        }

        try {
            const fullPath = path.resolve(filePath);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Document ${documentId} saved to ${filePath}`);
        } catch (error) {
            throw new RuntimeError(`Error saving document: ${error.message}`);
        }
    }

    // Get document content
    getDocumentContent(documentId) {
        const content = this.documents.get(documentId);
        if (!content) {
            throw new ButhaError(`Document ${documentId} does not exist`);
        }
        return content;
    }

    // Apply changes to a document
    applyChanges(documentId, changes) {
        const currentContent = this.documents.get(documentId);
        if (!currentContent) {
            throw new ButhaError(`Document ${documentId} does not exist`);
        }

        const updatedContent = applyPatch(currentContent, changes);
        this.documents.set(documentId, updatedContent);
        this.changes.get(documentId).push(changes);
        this.emit('documentChanged', documentId, updatedContent);
        console.log(`Changes applied to document ${documentId}`);
    }

    // Get the history of changes
    getChangeHistory(documentId) {
        const history = this.changes.get(documentId);
        if (!history) {
            throw new ButhaError(`Document ${documentId} does not exist`);
        }
        return history;
    }
}

// Example usage
async function exampleUsage() {
    const collaborationManager = new CollaborationManager();

    try {
        // Create and load a new document
        const docId = uuidv4();
        collaborationManager.createDocument(docId, 'Initial content');

        // Save and load document from file
        const filePath = 'example.txt';
        collaborationManager.saveDocument(docId, filePath);
        const loadedDocId = collaborationManager.loadDocument(filePath);

        // Apply changes and get the document content
        const changes = diffWordsWithSpace('Initial content', 'Updated content');
        collaborationManager.applyChanges(loadedDocId, changes);
        const content = collaborationManager.getDocumentContent(loadedDocId);
        console.log('Document content after changes:', content);

        // Get change history
        const history = collaborationManager.getChangeHistory(loadedDocId);
        console.log('Document change history:', history);
    } catch (error) {
        console.error('Collaboration Manager error:', error.toString());
    }
}

exampleUsage();

module.exports = CollaborationManager;
