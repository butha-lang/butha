// ast.js

// Define different types of AST nodes
const NodeType = {
    PROGRAM: 'Program',
    FUNCTION_DECLARATION: 'FunctionDeclaration',
    CALL_EXPRESSION: 'CallExpression',
    BINARY_EXPRESSION: 'BinaryExpression',
    LITERAL: 'Literal',
    IDENTIFIER: 'Identifier',
    IF_STATEMENT: 'IfStatement',
    WHILE_STATEMENT: 'WhileStatement',
    EXPRESSION_STATEMENT: 'ExpressionStatement',
};

// Utility functions for working with AST nodes
function createProgram(body) {
    return {
        type: NodeType.PROGRAM,
        body: body
    };
}

function createFunctionDeclaration(name, params, body) {
    return {
        type: NodeType.FUNCTION_DECLARATION,
        name: name,
        params: params,
        body: body
    };
}

function createCallExpression(callee, arguments) {
    return {
        type: NodeType.CALL_EXPRESSION,
        callee: callee,
        arguments: arguments
    };
}

function createBinaryExpression(operator, left, right) {
    return {
        type: NodeType.BINARY_EXPRESSION,
        operator: operator,
        left: left,
        right: right
    };
}

function createLiteral(value) {
    return {
        type: NodeType.LITERAL,
        value: value
    };
}

function createIdentifier(name) {
    return {
        type: NodeType.IDENTIFIER,
        name: name
    };
}

function createIfStatement(condition, consequent, alternate) {
    return {
        type: NodeType.IF_STATEMENT,
        condition: condition,
        consequent: consequent,
        alternate: alternate
    };
}

function createWhileStatement(test, body) {
    return {
        type: NodeType.WHILE_STATEMENT,
        test: test,
        body: body
    };
}

function createExpressionStatement(expression) {
    return {
        type: NodeType.EXPRESSION_STATEMENT,
        expression: expression
    };
}

// Function to print the AST in a readable format
function printAST(ast, indent = 0) {
    const indentation = ' '.repeat(indent);
    switch (ast.type) {
        case NodeType.PROGRAM:
            console.log(`${indentation}Program`);
            ast.body.forEach(node => printAST(node, indent + 2));
            break;
        case NodeType.FUNCTION_DECLARATION:
            console.log(`${indentation}FunctionDeclaration: ${ast.name}`);
            console.log(`${indentation}  Params: [${ast.params.join(', ')}]`);
            printAST(ast.body, indent + 2);
            break;
        case NodeType.CALL_EXPRESSION:
            console.log(`${indentation}CallExpression`);
            printAST(ast.callee, indent + 2);
            console.log(`${indentation}  Arguments:`);
            ast.arguments.forEach(arg => printAST(arg, indent + 2));
            break;
        case NodeType.BINARY_EXPRESSION:
            console.log(`${indentation}BinaryExpression: ${ast.operator}`);
            printAST(ast.left, indent + 2);
            printAST(ast.right, indent + 2);
            break;
        case NodeType.LITERAL:
            console.log(`${indentation}Literal: ${ast.value}`);
            break;
        case NodeType.IDENTIFIER:
            console.log(`${indentation}Identifier: ${ast.name}`);
            break;
        case NodeType.IF_STATEMENT:
            console.log(`${indentation}IfStatement`);
            printAST(ast.condition, indent + 2);
            console.log(`${indentation}  Consequent:`);
            printAST(ast.consequent, indent + 2);
            if (ast.alternate) {
                console.log(`${indentation}  Alternate:`);
                printAST(ast.alternate, indent + 2);
            }
            break;
        case NodeType.WHILE_STATEMENT:
            console.log(`${indentation}WhileStatement`);
            printAST(ast.test, indent + 2);
            console.log(`${indentation}  Body:`);
            printAST(ast.body, indent + 2);
            break;
        case NodeType.EXPRESSION_STATEMENT:
            console.log(`${indentation}ExpressionStatement`);
            printAST(ast.expression, indent + 2);
            break;
        default:
            console.log(`${indentation}Unknown node type: ${ast.type}`);
    }
}

module.exports = {
    NodeType,
    createProgram,
    createFunctionDeclaration,
    createCallExpression,
    createBinaryExpression,
    createLiteral,
    createIdentifier,
    createIfStatement,
    createWhileStatement,
    createExpressionStatement,
    printAST
};
