// linter.js

const { ButhaError, RuntimeError } = require('./error');

// Linter class for linting Butha code
class Linter {
    constructor() {
        this.rules = [];
        this.defaultRules = {
            'no-console': 'warn',
            'no-unused-vars': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4]
        };
        this.setRules(this.defaultRules);
    }

    // Set custom linting rules
    setRules(rules) {
        this.rules = rules;
    }

    // Lint a given code content
    lint(code) {
        const lines = code.split('\n');
        let errors = [];

        lines.forEach((line, index) => {
            this.rules.forEach((rule) => {
                const result = this.applyRule(rule, line, index + 1);
                if (result) {
                    errors.push(result);
                }
            });
        });

        return errors.length > 0 ? errors : 'No linting errors';
    }

    // Apply a specific rule to a line of code
    applyRule(rule, line, lineNumber) {
        let error = null;
        switch (rule.type) {
            case 'no-console':
                if (line.includes('console.log')) {
                    error = {
                        rule: 'no-console',
                        level: rule.level,
                        message: 'Avoid using console.log in production code',
                        line: lineNumber
                    };
                }
                break;

            case 'no-unused-vars':
                // Simple check for unused variables
                // A more advanced implementation would track variables and their usage
                const variableMatch = line.match(/const\s+(\w+)/);
                if (variableMatch && !line.includes(`${variableMatch[1]} =`)) {
                    error = {
                        rule: 'no-unused-vars',
                        level: rule.level,
                        message: `Variable ${variableMatch[1]} is defined but not used`,
                        line: lineNumber
                    };
                }
                break;

            case 'semi':
                if (!line.endsWith(';') && rule.options[1] === 'always') {
                    error = {
                        rule: 'semi',
                        level: rule.level,
                        message: 'Missing semicolon at the end of the line',
                        line: lineNumber
                    };
                }
                break;

            case 'quotes':
                if (!line.includes("'") && rule.options[1] === 'single') {
                    error = {
                        rule: 'quotes',
                        level: rule.level,
                        message: 'Use single quotes for strings',
                        line: lineNumber
                    };
                }
                break;

            case 'indent':
                const indent = line.match(/^(\s*)/)[1].length;
                if (indent % rule.options[1] !== 0) {
                    error = {
                        rule: 'indent',
                        level: rule.level,
                        message: `Incorrect indentation level (should be ${rule.options[1]} spaces)`,
                        line: lineNumber
                    };
                }
                break;

            default:
                throw new RuntimeError(`Unknown linting rule: ${rule.type}`);
        }

        return error;
    }
}

// Example usage
const linter = new Linter();

try {
    // Example code to lint
    const code = `
        const unusedVar;
        console.log('Hello, world');
        const usedVar = 'This is used';
        console.log(usedVar);
        if (true) {
            console.log('Hello');
        }
    `;

    // Lint the code
    const lintingErrors = linter.lint(code);
    console.log('Linting errors:', lintingErrors);
} catch (error) {
    console.error('Linter error:', error.toString());
}

module.exports = Linter;
