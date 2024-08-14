// lexer.js

const TokenType = {
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    IDENTIFIER: 'IDENTIFIER',
    BINARY_OP: 'BINARY_OP',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    FUNCTION: 'FUNCTION',
    CALL: 'CALL',
    IF: 'IF',
    THEN: 'THEN',
    ELSE: 'ELSE',
    WHILE: 'WHILE',
    DO: 'DO',
    COMMA: 'COMMA',
    EOF: 'EOF',
    ERROR: 'ERROR'
};

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

// Lexer class
class Lexer {
    constructor() {
        this.pos = 0;
        this.currentChar = null;
    }

    // Tokenize the input code
    tokenize(code) {
        this.code = code;
        this.pos = 0;
        this.currentChar = this.code[this.pos];
        const tokens = [];

        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
            } else if (/\d/.test(this.currentChar)) {
                tokens.push(this.number());
            } else if (/"[^"]*"/.test(this.currentChar + this.peek())) {
                tokens.push(this.string());
            } else if (/[a-zA-Z_]\w*/.test(this.currentChar)) {
                tokens.push(this.identifier());
            } else if (this.currentChar === '(') {
                tokens.push(new Token(TokenType.LPAREN, '('));
                this.advance();
            } else if (this.currentChar === ')') {
                tokens.push(new Token(TokenType.RPAREN, ')'));
                this.advance();
            } else if (this.currentChar === ',') {
                tokens.push(new Token(TokenType.COMMA, ','));
                this.advance();
            } else if (['+', '-', '*', '/'].includes(this.currentChar)) {
                tokens.push(new Token(TokenType.BINARY_OP, this.currentChar));
                this.advance();
            } else if (this.currentChar === 'i' && this.peek(1) === 'f') {
                tokens.push(new Token(TokenType.IF, 'if'));
                this.advance(); this.advance();
            } else if (this.currentChar === 't' && this.peek(3) === 'then') {
                tokens.push(new Token(TokenType.THEN, 'then'));
                this.advance(); this.advance(); this.advance(); this.advance();
            } else if (this.currentChar === 'e' && this.peek(3) === 'lse') {
                tokens.push(new Token(TokenType.ELSE, 'else'));
                this.advance(); this.advance(); this.advance(); this.advance();
            } else if (this.currentChar === 'w' && this.peek(4) === 'hile') {
                tokens.push(new Token(TokenType.WHILE, 'while'));
                this.advance(); this.advance(); this.advance(); this.advance(); this.advance();
            } else if (this.currentChar === 'd' && this.peek(1) === 'o') {
                tokens.push(new Token(TokenType.DO, 'do'));
                this.advance(); this.advance();
            } else if (this.currentChar === 'f' && this.peek(7) === 'unction') {
                tokens.push(new Token(TokenType.FUNCTION, 'function'));
                this.advance(); this.advance(); this.advance(); this.advance(); this.advance(); this.advance(); this.advance();
            } else if (this.currentChar === 'c' && this.peek(4) === 'call') {
                tokens.push(new Token(TokenType.CALL, 'call'));
                this.advance(); this.advance(); this.advance(); this.advance();
            } else {
                tokens.push(new Token(TokenType.ERROR, this.currentChar));
                this.advance();
            }
        }

        tokens.push(new Token(TokenType.EOF, null));
        return tokens;
    }

    // Skip whitespace
    skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    // Process a number token
    number() {
        let numberStr = '';
        while (this.currentChar !== null && /\d/.test(this.currentChar)) {
            numberStr += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.NUMBER, numberStr);
    }

    // Process a string token
    string() {
        let stringValue = '';
        this.advance(); // Skip the opening quote
        while (this.currentChar !== null && this.currentChar !== '"') {
            stringValue += this.currentChar;
            this.advance();
        }
        this.advance(); // Skip the closing quote
        return new Token(TokenType.STRING, '"' + stringValue + '"');
    }

    // Process an identifier token
    identifier() {
        let id = '';
        while (this.currentChar !== null && /[a-zA-Z_]\w*/.test(this.currentChar)) {
            id += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.IDENTIFIER, id);
    }

    // Advance the current character
    advance() {
        this.pos++;
        if (this.pos > this.code.length - 1) {
            this.currentChar = null;
        } else {
            this.currentChar = this.code[this.pos];
        }
    }

    // Peek ahead n characters
    peek(n = 1) {
        if (this.pos + n > this.code.length - 1) {
            return '';
        }
        return this.code.substring(this.pos + 1, this.pos + 1 + n);
    }
}

module.exports = { Lexer, TokenType };
