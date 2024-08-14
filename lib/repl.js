// repl.js

const readline = require('readline');
const { Parser } = require('./parser');
const { Evaluator } = require('./evaluator');
const { Debugger } = require('./debug');
const { StorageManager } = require('./storage');

// Initialize the debugger
const debuggerInstance = new Debugger();
debuggerInstance.setLogLevel('debug');

// Initialize the storage manager
const storageManager = new StorageManager();

// Initialize the parser and evaluator
const parser = new Parser();
const evaluator = new Evaluator();

// Create readline interface for REPL
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

// REPL main loop
function startREPL() {
    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();
        if (input === 'exit') {
            rl.close();
            return;
        }

        try {
            // Parse the input
            const ast = parser.parse(input);
            debuggerInstance.debug(`Parsed AST: ${JSON.stringify(ast)}`);

            // Evaluate the AST
            const result = evaluator.evaluate(ast);
            debuggerInstance.debug(`Evaluation Result: ${JSON.stringify(result)}`);

            // Print the result
            console.log(result);
        } catch (error) {
            debuggerInstance.handleError(error);
        }

        rl.prompt();
    }).on('close', () => {
        console.log('REPL terminated.');
        process.exit(0);
    });
}

// Start the REPL
startREPL();
