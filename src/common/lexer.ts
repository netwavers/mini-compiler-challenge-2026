import { Token } from './types';

export class TanukiSyntaxError extends Error {
  public line: number;
  public column: number;
  public position: number;

  constructor(message: string, line: number, column: number, position: number) {
    super(`${message} (at line ${line}, column ${column})`);
    this.name = 'TanukiSyntaxError';
    this.line = line;
    this.column = column;
    this.position = position;
  }
}

export class TanukiLexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  private peek(): string {
    if (this.position >= this.input.length) return '';
    return this.input[this.position];
  }

  private advance(): string {
    const char = this.peek();
    this.position++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      const char = this.peek();

      // 空白文字のスキップ
      if (char === ' ' || char === '\t' || char === '\r' || char === '\n') {
        this.advance();
        continue;
      }

      const startLine = this.line;
      const startColumn = this.column;
      const startPos = this.position;

      // 1文字の記号
      if (char === '+') {
        this.advance();
        tokens.push({ type: 'PLUS', value: '+', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '-') {
        this.advance();
        tokens.push({ type: 'MINUS', value: '-', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '*') {
        this.advance();
        tokens.push({ type: 'STAR', value: '*', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '/') {
        this.advance();
        tokens.push({ type: 'SLASH', value: '/', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '%') {
        this.advance();
        tokens.push({ type: 'PERCENT', value: '%', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '^') {
        this.advance();
        tokens.push({ type: 'CARET', value: '^', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '=') {
        this.advance();
        tokens.push({ type: 'EQ', value: '=', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === ';') {
        this.advance();
        tokens.push({ type: 'SEMICOLON', value: ';', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === ',') {
        this.advance();
        tokens.push({ type: 'COMMA', value: ',', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === '(') {
        this.advance();
        tokens.push({ type: 'LPAREN', value: '(', line: startLine, column: startColumn, position: startPos });
        continue;
      }
      if (char === ')') {
        this.advance();
        tokens.push({ type: 'RPAREN', value: ')', line: startLine, column: startColumn, position: startPos });
        continue;
      }

      // 数値リテラル
      if (/[0-9]/.test(char)) {
        let value = '';
        while (/[0-9]/.test(this.peek())) {
          value += this.advance();
        }
        if (this.peek() === '.') {
          // 小数点
          value += this.advance();
          if (!/[0-9]/.test(this.peek())) {
            throw new TanukiSyntaxError(`Invalid float literal`, this.line, this.column, this.position);
          }
          while (/[0-9]/.test(this.peek())) {
            value += this.advance();
          }
        }
        tokens.push({ type: 'NUMBER', value, line: startLine, column: startColumn, position: startPos });
        continue;
      }

      // 識別子
      if (/[a-zA-Z_]/.test(char)) {
        let value = '';
        while (/[a-zA-Z0-9_]/.test(this.peek())) {
          value += this.advance();
        }
        tokens.push({ type: 'IDENTIFIER', value, line: startLine, column: startColumn, position: startPos });
        continue;
      }

      throw new TanukiSyntaxError(`Unexpected character '${char}'`, startLine, startColumn, startPos);
    }

    tokens.push({ type: 'EOF', value: '', line: this.line, column: this.column, position: this.position });
    return tokens;
  }
}
