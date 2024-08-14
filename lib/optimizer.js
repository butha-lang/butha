// optimizer.js

const { NodeType, createProgram, createFunctionDeclaration, createCallExpression, createBinaryExpression, createLiteral, createIdentifier, createIfStatement, createWhileStatement, createExpressionStatement } = require('./ast');

// Perform optimizations on the AST
function optimize(ast) {
    switch (ast.type) {
        case NodeType.PROGRAM:
            return optimizeProgram(ast);
        case NodeType.FUNCTION_DECLARATION:
            return optimizeFunctionDeclaration(ast);
        case NodeType.CALL_EXPRESSION:
            return optimizeCallExpression(ast);
        case NodeType.BINARY_EXPRESSION:
            return optimizeBinaryExpression(ast);
        case NodeType.LITERAL:
            return ast;
        case NodeType.IDENTIFIER:
            return ast;
        case NodeType.IF_STATEMENT:
            return optimizeIfStatement(ast);
        case NodeType.WHILE_STATEMENT:
            return optimizeWhileStatement(ast);
        case NodeType.EXPRESSION_STATEMENT:
            return optimizeExpressionStatement(ast);
        default:
            throw new Error(`Unknown AST node type: ${ast.type}`);
    }
}

function optimizeProgram(ast) {
    const optimizedBody = ast.body.map(node => optimize(node));
    return createProgram(optimizedBody);
}

function optimizeFunctionDeclaration(ast) {
    const optimizedBody = optimize(ast.body);
    return createFunctionDeclaration(ast.name, ast.params, optimizedBody);
}

function optimizeCallExpression(ast) {
    const optimizedCallee = optimize(ast.callee);
    const optimizedArguments = ast.arguments.map(arg => optimize(arg));
    return createCallExpression(optimizedCallee, optimizedArguments);
}

function optimizeBinaryExpression(ast) {
    const optimizedLeft = optimize(ast.left);
    const optimizedRight = optimize(ast.right);
    if (optimizedLeft.type === NodeType.LITERAL && optimizedRight.type === NodeType.LITERAL) {
        return evaluateBinaryExpressionAtCompileTime(ast.operator, optimizedLeft.value, optimizedRight.value);
    }
    return createBinaryExpression(ast.operator, optimizedLeft, optimizedRight);
}

function evaluateBinaryExpressionAtCompileTime(operator, left, right) {
    switch (operator) {
        case '+': return createLiteral(left + right);
        case '-': return createLiteral(left - right);
        case '*': return createLiteral(left * right);
        case '/': return createLiteral(left / right);
        default: throw new Error(`Unknown operator: ${operator}`);
    }
}

function optimizeIfStatement(ast) {
    const optimizedCondition = optimize(ast.condition);
    const optimizedConsequent = optimize(ast.consequent);
    const optimizedAlternate = ast.alternate ? optimize(ast.alternate) : null;

    if (optimizedCondition.type === NodeType.LITERAL) {
        if (optimizedCondition.value) {
            return optimizedConsequent;
        } else {
            return optimizedAlternate || createLiteral(null);
        }
    }

    return createIfStatement(optimizedCondition, optimizedConsequent, optimizedAlternate);
}

function optimizeWhileStatement(ast) {
    const optimizedTest = optimize(ast.test);
    const optimizedBody = optimize(ast.body);

    if (optimizedTest.type === NodeType.LITERAL && !optimizedTest.value) {
        return createLiteral(null);
    }

    return createWhileStatement(optimizedTest, optimizedBody);
}

function optimizeExpressionStatement(ast) {
    const optimizedExpression = optimize(ast.expression);
    return createExpressionStatement(optimizedExpression);
}

module.exports = {
    optimize
};
