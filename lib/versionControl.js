// versionControl.js

const { ButhaError, RuntimeError } = require('./error');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class VersionControlManager {
    constructor() {
        this.repos = new Map(); // Stores repositories
    }

    // Initialize a new repository
    initializeRepo(repoPath) {
        const fullPath = path.resolve(repoPath);
        if (fs.existsSync(fullPath)) {
            throw new ButhaError(`Repository already exists at ${repoPath}`);
        }

        fs.mkdirSync(fullPath, { recursive: true });
        fs.mkdirSync(path.join(fullPath, 'branches'), { recursive: true });
        fs.writeFileSync(path.join(fullPath, 'version.json'), JSON.stringify({ currentBranch: 'main', branches: {} }, null, 2));
        console.log(`Repository initialized at ${repoPath}`);
    }

    // Create a new branch
    createBranch(repoPath, branchName) {
        const fullPath = path.resolve(repoPath);
        const versionFilePath = path.join(fullPath, 'version.json');

        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`Repository does not exist at ${repoPath}`);
        }

        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        if (versionData.branches[branchName]) {
            throw new ButhaError(`Branch ${branchName} already exists`);
        }

        const branchPath = path.join(fullPath, 'branches', branchName);
        fs.mkdirSync(branchPath, { recursive: true });
        fs.writeFileSync(path.join(branchPath, 'snapshot.json'), JSON.stringify({ files: {} }, null, 2));
        versionData.branches[branchName] = { snapshot: 'snapshot.json' };
        fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
        console.log(`Branch ${branchName} created`);
    }

    // Add a file snapshot to the current branch
    addFileSnapshot(repoPath, filePath, content) {
        const fullPath = path.resolve(repoPath);
        const versionFilePath = path.join(fullPath, 'version.json');
        const fileName = path.basename(filePath);

        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`Repository does not exist at ${repoPath}`);
        }

        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        const currentBranch = versionData.currentBranch;
        const branchPath = path.join(fullPath, 'branches', currentBranch);

        if (!fs.existsSync(branchPath)) {
            throw new ButhaError(`Current branch ${currentBranch} does not exist`);
        }

        const snapshotFilePath = path.join(branchPath, 'snapshot.json');
        const snapshotData = JSON.parse(fs.readFileSync(snapshotFilePath, 'utf8'));

        snapshotData.files[fileName] = content;
        fs.writeFileSync(snapshotFilePath, JSON.stringify(snapshotData, null, 2));
        console.log(`File ${fileName} added to snapshot in branch ${currentBranch}`);
    }

    // Commit changes to the current branch
    commitChanges(repoPath, message) {
        const fullPath = path.resolve(repoPath);
        const versionFilePath = path.join(fullPath, 'version.json');

        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`Repository does not exist at ${repoPath}`);
        }

        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        const currentBranch = versionData.currentBranch;
        const branchPath = path.join(fullPath, 'branches', currentBranch);

        if (!fs.existsSync(branchPath)) {
            throw new ButhaError(`Current branch ${currentBranch} does not exist`);
        }

        const snapshotFilePath = path.join(branchPath, 'snapshot.json');
        const snapshotData = JSON.parse(fs.readFileSync(snapshotFilePath, 'utf8'));

        // Save commit
        const commitId = uuidv4();
        const commitFilePath = path.join(branchPath, `commit_${commitId}.json`);
        fs.writeFileSync(commitFilePath, JSON.stringify({ message, snapshot: snapshotData }, null, 2));

        console.log(`Changes committed to branch ${currentBranch} with commit ID ${commitId}`);
    }

    // Rollback to a specific commit
    rollbackToCommit(repoPath, commitId) {
        const fullPath = path.resolve(repoPath);
        const versionFilePath = path.join(fullPath, 'version.json');

        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`Repository does not exist at ${repoPath}`);
        }

        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        const currentBranch = versionData.currentBranch;
        const branchPath = path.join(fullPath, 'branches', currentBranch);

        if (!fs.existsSync(branchPath)) {
            throw new ButhaError(`Current branch ${currentBranch} does not exist`);
        }

        const commitFilePath = path.join(branchPath, `commit_${commitId}.json`);
        if (!fs.existsSync(commitFilePath)) {
            throw new ButhaError(`Commit ${commitId} does not exist`);
        }

        const commitData = JSON.parse(fs.readFileSync(commitFilePath, 'utf8'));
        const snapshotData = commitData.snapshot;

        // Replace the current snapshot with the one from the commit
        const snapshotFilePath = path.join(branchPath, 'snapshot.json');
        fs.writeFileSync(snapshotFilePath, JSON.stringify(snapshotData, null, 2));

        console.log(`Rolled back to commit ${commitId} in branch ${currentBranch}`);
    }

    // Switch to a different branch
    switchBranch(repoPath, branchName) {
        const fullPath = path.resolve(repoPath);
        const versionFilePath = path.join(fullPath, 'version.json');

        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`Repository does not exist at ${repoPath}`);
        }

        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        if (!versionData.branches[branchName]) {
            throw new ButhaError(`Branch ${branchName} does not exist`);
        }

        versionData.currentBranch = branchName;
        fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
        console.log(`Switched to branch ${branchName}`);
    }
}

// Example usage
async function exampleUsage() {
    const versionControl = new VersionControlManager();

    try {
        // Initialize a repository
        const repoPath = 'myRepo';
        versionControl.initializeRepo(repoPath);

        // Create a new branch
        versionControl.createBranch(repoPath, 'feature-branch');

        // Add file snapshot and commit changes
        versionControl.addFileSnapshot(repoPath, 'example.txt', 'Hello World');
        versionControl.commitChanges(repoPath, 'Initial commit');

        // Switch branches, add more changes, and commit
        versionControl.switchBranch(repoPath, 'feature-branch');
        versionControl.addFileSnapshot(repoPath, 'example.txt', 'Updated content');
        versionControl.commitChanges(repoPath, 'Feature branch changes');

        // Rollback to previous commit
        versionControl.rollbackToCommit(repoPath, 'commit_id_placeholder'); // Replace with actual commit ID
    } catch (error) {
        console.error('Version Control error:', error.toString());
    }
}

exampleUsage();

module.exports = VersionControlManager;
