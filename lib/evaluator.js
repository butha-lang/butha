// evaluator.js

const { NodeType } = require('./ast');

class Environment {
    constructor(outer = null) {
        this.variables = {};
        this.outer = outer;
    }

    set(name, value) {
        if (this.variables.hasOwnProperty(name)) {
            this.variables[name] = value;
        } else if (this.outer) {
            this.outer.set(name, value);
        } else {
            throw new Error(`Undefined variable: ${name}`);
        }
    }

    get(name) {
        if (this.variables.hasOwnProperty(name)) {
            return this.variables[name];
        } else if (this.outer) {
            return this.outer.get(name);
        } else {
            throw new Error(`Undefined variable: ${name}`);
        }
    }

    define(name, value) {
        this.variables[name] = value;
    }
}

function evaluate(ast, env = new Environment()) {
    switch (ast.type) {
        case NodeType.PROGRAM:
            return evaluateProgram(ast, env);
        case NodeType.FUNCTION_DECLARATION:
            return evaluateFunctionDeclaration(ast, env);
        case NodeType.CALL_EXPRESSION:
            return evaluateCallExpression(ast, env);
        case NodeType.BINARY_EXPRESSION:
            return evaluateBinaryExpression(ast, env);
        case NodeType.LITERAL:
            return evaluateLiteral(ast);
        case NodeType.IDENTIFIER:
            return evaluateIdentifier(ast, env);
        case NodeType.IF_STATEMENT:
            return evaluateIfStatement(ast, env);
        case NodeType.WHILE_STATEMENT:
            return evaluateWhileStatement(ast, env);
        case NodeType.EXPRESSION_STATEMENT:
            return evaluateExpressionStatement(ast, env);
        default:
            throw new Error(`Unknown AST node type: ${ast.type}`);
    }
}

function evaluateProgram(ast, env) {
    let result;
    for (const node of ast.body) {
        result = evaluate(node, env);
    }
    return result;
}

function evaluateFunctionDeclaration(ast, env) {
    // Function declarations are stored in the environment
    const func = {
        type: NodeType.FUNCTION_DECLARATION,
        name: ast.name,
        params: ast.params,
        body: ast.body,
        environment: env
    };
    env.define(ast.name, func);
}

function evaluateCallExpression(ast, env) {
    const func = evaluate(ast.callee, env);
    const args = ast.arguments.map(arg => evaluate(arg, env));
    if (func.type === NodeType.FUNCTION_DECLARATION) {
        const funcEnv = new Environment(func.environment);
        func.params.forEach((param, index) => {
            funcEnv.define(param, args[index]);
        });
        return evaluate(func.body, funcEnv);
    } else {
        throw new Error('Only functions can be called');
    }
}

function evaluateBinaryExpression(ast, env) {
    const left = evaluate(ast.left, env);
    const right = evaluate(ast.right, env);
    switch (ast.operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        default: throw new Error(`Unknown operator: ${ast.operator}`);
    }
}

function evaluateLiteral(ast) {
    return ast.value;
}

function evaluateIdentifier(ast, env) {
    return env.get(ast.name);
}

function evaluateIfStatement(ast, env) {
    const condition = evaluate(ast.condition, env);
    if (condition) {
        return evaluate(ast.consequent, env);
    } else if (ast.alternate) {
        return evaluate(ast.alternate, env);
    }
}

function evaluateWhileStatement(ast, env) {
    let result;
    while (evaluate(ast.test, env)) {
        result = evaluate(ast.body, env);
    }
    return result;
}

function evaluateExpressionStatement(ast, env) {
    return evaluate(ast.expression, env);
}

module.exports = {
    evaluate
};
