// ide.js

const fs = require('fs');
const path = require('path');
const { ButhaError, RuntimeError } = require('./error');
const { SyntaxHighlighter } = require('./syntaxHighlighter');
const { Linter } = require('./linter');
const { ProjectManager } = require('./projectManager');

// IDE Class to handle development environment features
class IDE {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.syntaxHighlighter = new SyntaxHighlighter();
        this.linter = new Linter();
        this.projectManager = new ProjectManager(baseDir);
    }

    // Load a file
    loadFile(filePath) {
        const fullPath = path.join(this.baseDir, filePath);
        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`File ${filePath} does not exist`);
        }
        return fs.readFileSync(fullPath, 'utf-8');
    }

    // Save a file
    saveFile(filePath, content) {
        const fullPath = path.join(this.baseDir, filePath);
        fs.writeFileSync(fullPath, content, 'utf-8');
    }

    // Highlight syntax in a file
    highlightSyntax(filePath) {
        const content = this.loadFile(filePath);
        return this.syntaxHighlighter.highlight(content);
    }

    // Lint a file
    lintFile(filePath) {
        const content = this.loadFile(filePath);
        return this.linter.lint(content);
    }

    // Create a new project
    createProject(projectName) {
        this.projectManager.createProject(projectName);
    }

    // Open a project
    openProject(projectName) {
        this.projectManager.openProject(projectName);
    }

    // List all projects
    listProjects() {
        return this.projectManager.listProjects();
    }

    // Close the current project
    closeProject() {
        this.projectManager.closeProject();
    }

    // Get project details
    getProjectDetails() {
        return this.projectManager.getProjectDetails();
    }
}

// Syntax Highlighter Class (stub implementation)
class SyntaxHighlighter {
    highlight(code) {
        // Simulate syntax highlighting
        return `Highlighted:\n${code}`;
    }
}

// Linter Class (stub implementation)
class Linter {
    lint(code) {
        // Simulate linting
        const errors = [];
        // Example linting logic
        if (code.includes('console.log')) {
            errors.push('Avoid using console.log in production code');
        }
        return errors.length > 0 ? errors : 'No linting errors';
    }
}

// Project Manager Class (stub implementation)
class ProjectManager {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.projectsDir = path.join(baseDir, 'projects');
        this.currentProject = null;
        if (!fs.existsSync(this.projectsDir)) {
            fs.mkdirSync(this.projectsDir, { recursive: true });
        }
    }

    createProject(projectName) {
        const projectPath = path.join(this.projectsDir, projectName);
        if (fs.existsSync(projectPath)) {
            throw new ButhaError(`Project ${projectName} already exists`);
        }
        fs.mkdirSync(projectPath, { recursive: true });
        this.currentProject = projectName;
    }

    openProject(projectName) {
        const projectPath = path.join(this.projectsDir, projectName);
        if (!fs.existsSync(projectPath)) {
            throw new ButhaError(`Project ${projectName} does not exist`);
        }
        this.currentProject = projectName;
    }

    listProjects() {
        return fs.readdirSync(this.projectsDir);
    }

    closeProject() {
        this.currentProject = null;
    }

    getProjectDetails() {
        if (this.currentProject) {
            const projectPath = path.join(this.projectsDir, this.currentProject);
            return {
                name: this.currentProject,
                path: projectPath,
                files: fs.readdirSync(projectPath)
            };
        }
        throw new RuntimeError('No project is currently open');
    }
}

// Example usage
const ide = new IDE(__dirname);

try {
    // Create a new project
    ide.createProject('example-project');

    // Open a project
    ide.openProject('example-project');

    // Save a new file
    ide.saveFile('example-project/index.butha', 'print("Hello, Butha!")');

    // Load and highlight syntax
    const highlightedCode = ide.highlightSyntax('example-project/index.butha');
    console.log(highlightedCode);

    // Lint the file
    const lintingErrors = ide.lintFile('example-project/index.butha');
    console.log('Linting errors:', lintingErrors);

    // List all projects
    console.log('Projects:', ide.listProjects());

    // Get project details
    const projectDetails = ide.getProjectDetails();
    console.log('Project details:', projectDetails);

    // Close the project
    ide.closeProject();
} catch (error) {
    console.error('IDE error:', error.toString());
}

module.exports = IDE;
