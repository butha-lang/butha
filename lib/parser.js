// parser.js

const { TokenType } = require('./lexer');
const { SyntaxError } = require('./error');

// Helper functions for parsing
function parseExpression(tokens) {
    let token = tokens.shift();

    if (!token) {
        throw new SyntaxError("Unexpected end of input");
    }

    switch (token.type) {
        case TokenType.NUMBER:
            return { type: 'Literal', value: Number(token.value) };

        case TokenType.STRING:
            return { type: 'Literal', value: token.value.slice(1, -1) }; // Removing quotes

        case TokenType.IDENTIFIER:
            return { type: 'Identifier', name: token.value };

        case TokenType.LPAREN:
            const expr = parseExpression(tokens);
            if (tokens.shift().type !== TokenType.RPAREN) {
                throw new SyntaxError("Expected closing parenthesis");
            }
            return expr;

        case TokenType.BINARY_OP:
            const left = parseExpression(tokens);
            const operator = token.value;
            const right = parseExpression(tokens);
            return { type: 'BinaryExpression', operator, left, right };

        case TokenType.FUNCTION:
            const name = tokens.shift().value;
            if (tokens.shift().type !== TokenType.LPAREN) {
                throw new SyntaxError("Expected opening parenthesis for function parameters");
            }
            const params = [];
            while (tokens[0].type === TokenType.IDENTIFIER) {
                params.push(tokens.shift().value);
                if (tokens[0].type === TokenType.COMMA) {
                    tokens.shift(); // Skip comma
                } else {
                    break;
                }
            }
            if (tokens.shift().type !== TokenType.RPAREN) {
                throw new SyntaxError("Expected closing parenthesis for function parameters");
            }
            const body = parseExpression(tokens);
            return { type: 'FunctionDeclaration', name, params, body };

        case TokenType.CALL:
            const callee = parseExpression(tokens);
            if (tokens.shift().type !== TokenType.LPAREN) {
                throw new SyntaxError("Expected opening parenthesis for function call arguments");
            }
            const args = [];
            while (tokens[0].type !== TokenType.RPAREN) {
                args.push(parseExpression(tokens));
                if (tokens[0].type === TokenType.COMMA) {
                    tokens.shift(); // Skip comma
                }
            }
            if (tokens.shift().type !== TokenType.RPAREN) {
                throw new SyntaxError("Expected closing parenthesis for function call arguments");
            }
            return { type: 'CallExpression', callee, arguments: args };

        case TokenType.IF:
            const condition = parseExpression(tokens);
            if (tokens.shift().type !== TokenType.THEN) {
                throw new SyntaxError("Expected 'then' after if condition");
            }
            const consequent = parseExpression(tokens);
            const alternate = tokens[0].type === TokenType.ELSE ? parseExpression(tokens) : null;
            return { type: 'IfStatement', condition, consequent, alternate };

        case TokenType.WHILE:
            const test = parseExpression(tokens);
            if (tokens.shift().type !== TokenType.DO) {
                throw new SyntaxError("Expected 'do' after while condition");
            }
            const bodyWhile = parseExpression(tokens);
            return { type: 'WhileStatement', test, body: bodyWhile };

        default:
            throw new SyntaxError(`Unexpected token type: ${token.type}`);
    }
}

// Parser class
class Parser {
    constructor() {
        this.tokens = [];
    }

    parse(tokens) {
        this.tokens = tokens;
        const statements = [];
        while (this.tokens.length > 0) {
            statements.push(this.parseStatement());
        }
        return { type: 'Program', body: statements };
    }

    parseStatement() {
        const token = this.tokens[0];
        switch (token.type) {
            case TokenType.FUNCTION:
                return parseExpression(this.tokens);

            case TokenType.IDENTIFIER:
                if (this.tokens[1] && this.tokens[1].type === TokenType.LPAREN) {
                    return parseExpression(this.tokens);
                } else {
                    return { type: 'ExpressionStatement', expression: parseExpression(this.tokens) };
                }

            case TokenType.IF:
                return parseExpression(this.tokens);

            case TokenType.WHILE:
                return parseExpression(this.tokens);

            default:
                throw new SyntaxError(`Unexpected token type: ${token.type}`);
        }
    }
}

module.exports = { Parser };
