// meta.js

const { NodeType, createProgram, createFunctionDeclaration, createCallExpression, createBinaryExpression, createLiteral, createIdentifier, createIfStatement, createWhileStatement, createExpressionStatement } = require('./ast');

// Function to annotate nodes with additional metadata
function annotateNode(node, metadata) {
    return {
        ...node,
        metadata: metadata || {}
    };
}

// Function to get metadata from a node
function getNodeMetadata(node) {
    return node.metadata || {};
}

// Function to inspect the structure of an AST node
function inspectNode(node) {
    switch (node.type) {
        case NodeType.PROGRAM:
            return inspectProgram(node);
        case NodeType.FUNCTION_DECLARATION:
            return inspectFunctionDeclaration(node);
        case NodeType.CALL_EXPRESSION:
            return inspectCallExpression(node);
        case NodeType.BINARY_EXPRESSION:
            return inspectBinaryExpression(node);
        case NodeType.LITERAL:
            return inspectLiteral(node);
        case NodeType.IDENTIFIER:
            return inspectIdentifier(node);
        case NodeType.IF_STATEMENT:
            return inspectIfStatement(node);
        case NodeType.WHILE_STATEMENT:
            return inspectWhileStatement(node);
        case NodeType.EXPRESSION_STATEMENT:
            return inspectExpressionStatement(node);
        default:
            throw new Error(`Unknown AST node type: ${node.type}`);
    }
}

function inspectProgram(node) {
    console.log('Program:');
    node.body.forEach(inspectNode);
}

function inspectFunctionDeclaration(node) {
    console.log(`FunctionDeclaration: ${node.name}`);
    console.log('  Params: ', node.params);
    console.log('  Body:');
    inspectNode(node.body);
}

function inspectCallExpression(node) {
    console.log('CallExpression:');
    console.log('  Callee:');
    inspectNode(node.callee);
    console.log('  Arguments:');
    node.arguments.forEach(inspectNode);
}

function inspectBinaryExpression(node) {
    console.log(`BinaryExpression: ${node.operator}`);
    console.log('  Left:');
    inspectNode(node.left);
    console.log('  Right:');
    inspectNode(node.right);
}

function inspectLiteral(node) {
    console.log(`Literal: ${node.value}`);
}

function inspectIdentifier(node) {
    console.log(`Identifier: ${node.name}`);
}

function inspectIfStatement(node) {
    console.log('IfStatement:');
    console.log('  Condition:');
    inspectNode(node.condition);
    console.log('  Consequent:');
    inspectNode(node.consequent);
    if (node.alternate) {
        console.log('  Alternate:');
        inspectNode(node.alternate);
    }
}

function inspectWhileStatement(node) {
    console.log('WhileStatement:');
    console.log('  Test:');
    inspectNode(node.test);
    console.log('  Body:');
    inspectNode(node.body);
}

function inspectExpressionStatement(node) {
    console.log('ExpressionStatement:');
    inspectNode(node.expression);
}

// Function to add metadata to all nodes in the AST
function annotateAST(ast, metadata) {
    switch (ast.type) {
        case NodeType.PROGRAM:
            return annotateProgram(ast, metadata);
        case NodeType.FUNCTION_DECLARATION:
            return annotateFunctionDeclaration(ast, metadata);
        case NodeType.CALL_EXPRESSION:
            return annotateCallExpression(ast, metadata);
        case NodeType.BINARY_EXPRESSION:
            return annotateBinaryExpression(ast, metadata);
        case NodeType.LITERAL:
            return annotateNode(ast, metadata);
        case NodeType.IDENTIFIER:
            return annotateNode(ast, metadata);
        case NodeType.IF_STATEMENT:
            return annotateIfStatement(ast, metadata);
        case NodeType.WHILE_STATEMENT:
            return annotateWhileStatement(ast, metadata);
        case NodeType.EXPRESSION_STATEMENT:
            return annotateExpressionStatement(ast, metadata);
        default:
            throw new Error(`Unknown AST node type: ${ast.type}`);
    }
}

function annotateProgram(ast, metadata) {
    const annotatedBody = ast.body.map(node => annotateAST(node, metadata));
    return createProgram(annotatedBody);
}

function annotateFunctionDeclaration(ast, metadata) {
    const annotatedBody = annotateAST(ast.body, metadata);
    return createFunctionDeclaration(ast.name, ast.params, annotatedBody);
}

function annotateCallExpression(ast, metadata) {
    const annotatedCallee = annotateAST(ast.callee, metadata);
    const annotatedArguments = ast.arguments.map(arg => annotateAST(arg, metadata));
    return createCallExpression(annotatedCallee, annotatedArguments);
}

function annotateBinaryExpression(ast, metadata) {
    const annotatedLeft = annotateAST(ast.left, metadata);
    const annotatedRight = annotateAST(ast.right, metadata);
    return createBinaryExpression(ast.operator, annotatedLeft, annotatedRight);
}

function annotateIfStatement(ast, metadata) {
    const annotatedCondition = annotateAST(ast.condition, metadata);
    const annotatedConsequent = annotateAST(ast.consequent, metadata);
    const annotatedAlternate = ast.alternate ? annotateAST(ast.alternate, metadata) : null;
    return createIfStatement(annotatedCondition, annotatedConsequent, annotatedAlternate);
}

function annotateWhileStatement(ast, metadata) {
    const annotatedTest = annotateAST(ast.test, metadata);
    const annotatedBody = annotateAST(ast.body, metadata);
    return createWhileStatement(annotatedTest, annotatedBody);
}

function annotateExpressionStatement(ast, metadata) {
    const annotatedExpression = annotateAST(ast.expression, metadata);
    return createExpressionStatement(annotatedExpression);
}

module.exports = {
    annotateNode,
    getNodeMetadata,
    inspectNode,
    annotateAST
};
