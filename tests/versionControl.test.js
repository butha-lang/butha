// versionControl.test.js

const { VersionControlManager, Repository, Commit } = require('../versionControl.js');
const { expect } = require('chai');

describe('Butha Version Control Tests', function() {

    it('should create a new repository', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        expect(repo).to.be.instanceof(Repository);
        expect(repo.name).to.equal('TestRepo');
    });

    it('should add and commit changes to a repository', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        repo.addFile('file1.txt', 'Initial content');
        repo.commit('Initial commit');

        const commits = repo.getCommits();
        expect(commits).to.have.lengthOf(1);
        expect(commits[0].message).to.equal('Initial commit');
        expect(repo.getFile('file1.txt')).to.equal('Initial content');
    });

    it('should handle multiple commits correctly', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        repo.addFile('file1.txt', 'Initial content');
        repo.commit('Initial commit');

        repo.updateFile('file1.txt', 'Updated content');
        repo.commit('Update file1');

        const commits = repo.getCommits();
        expect(commits).to.have.lengthOf(2);
        expect(commits[1].message).to.equal('Update file1');
        expect(repo.getFile('file1.txt')).to.equal('Updated content');
    });

    it('should revert to previous commits correctly', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        repo.addFile('file1.txt', 'Initial content');
        repo.commit('Initial commit');

        repo.updateFile('file1.txt', 'Updated content');
        repo.commit('Update file1');

        repo.revertTo(0); // Revert to the initial commit

        expect(repo.getFile('file1.txt')).to.equal('Initial content');
        const commits = repo.getCommits();
        expect(commits).to.have.lengthOf(2);
        expect(repo.getCurrentCommit().message).to.equal('Initial commit');
    });

    it('should handle branching and merging correctly', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        repo.addFile('file1.txt', 'Initial content');
        repo.commit('Initial commit');

        repo.createBranch('feature-branch');
        repo.switchBranch('feature-branch');
        repo.updateFile('file1.txt', 'Feature branch content');
        repo.commit('Feature branch commit');

        repo.switchBranch('main');
        repo.merge('feature-branch');

        expect(repo.getFile('file1.txt')).to.equal('Feature branch content');
        const commits = repo.getCommits();
        expect(commits).to.have.lengthOf(3);
        expect(commits[2].message).to.equal('Feature branch commit');
    });

    it('should manage tags correctly', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        repo.addFile('file1.txt', 'Initial content');
        repo.commit('Initial commit');

        repo.tag('v1.0');

        const tags = repo.getTags();
        expect(tags).to.have.lengthOf(1);
        expect(tags[0].name).to.equal('v1.0');
        expect(tags[0].commitMessage).to.equal('Initial commit');
    });

    it('should handle repository cloning correctly', function() {
        const manager = new VersionControlManager();
        const repo = manager.createRepository('TestRepo');

        repo.addFile('file1.txt', 'Initial content');
        repo.commit('Initial commit');

        const clone = manager.cloneRepository('TestRepo', 'TestRepoClone');
        expect(clone).to.be.instanceof(Repository);
        expect(clone.name).to.equal('TestRepoClone');
        expect(clone.getFile('file1.txt')).to.equal('Initial content');
    });

});
