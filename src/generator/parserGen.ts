import { Token, ASTNode, TokenType, IdentifierNode } from '../common/types';
import { TanukiSyntaxError } from '../common/lexer';

export class TanukiParserGenerator {
  private ebnfSchema: string = '';

  public loadEBNF(ebnfSchema: string): void {
    this.ebnfSchema = ebnfSchema;
  }

  public parse(tokens: Token[]): ASTNode {
    const parser = new TanukiParser(tokens);
    return parser.parse();
  }
}

class TanukiParser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    if (tokens.length === 0 || tokens[tokens.length - 1].type !== 'EOF') {
      const lastToken = tokens[tokens.length - 1];
      const dummyEOF: Token = {
        type: 'EOF',
        value: '',
        line: lastToken ? lastToken.line : 1,
        column: lastToken ? lastToken.column + 1 : 1,
        position: lastToken ? lastToken.position + 1 : 0
      };
      this.tokens = [...tokens, dummyEOF];
    } else {
      this.tokens = tokens;
    }
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new TanukiSyntaxError(message, token.line, token.column, token.position);
  }

  public parse(): ASTNode {
    const body: ASTNode[] = [];
    while (!this.isAtEnd()) {
      body.push(this.statement());
    }
    return { type: 'Program', body };
  }

  // statement = assignment_st | expr_st ;
  private statement(): ASTNode {
    // 先読みして IDENTIFIER = なら代入文
    if (this.check('IDENTIFIER') && this.tokens[this.current + 1]?.type === 'EQ') {
      return this.assignmentStatement();
    }
    return this.expressionStatement();
  }

  // assignment_st = IDENTIFIER , "=" , expr , ";" ;
  private assignmentStatement(): ASTNode {
    const leftToken = this.consume('IDENTIFIER', "Expect variable name.");
    const left: IdentifierNode = { type: 'Identifier', name: leftToken.value };
    this.consume('EQ', "Expect '=' after variable name.");
    const right = this.expr();
    this.consume('SEMICOLON', "Expect ';' after assignment statement.");
    return { type: 'AssignmentStatement', left, right };
  }

  // expr_st = expr , ";" ;
  private expressionStatement(): ASTNode {
    const expression = this.expr();
    this.consume('SEMICOLON', "Expect ';' after expression.");
    return { type: 'ExpressionStatement', expression };
  }

  // expr = term , { ( "+" | "-" ) , term } ;
  private expr(): ASTNode {
    let left = this.term();
    while (this.match('PLUS', 'MINUS')) {
      const operatorToken = this.tokens[this.current - 1];
      const operator = operatorToken.value as '+' | '-';
      const right = this.term();
      left = { type: 'BinaryExpression', operator, left, right };
    }
    return left;
  }

  // term = unary , { ( "*" | "/" | "%" ) , unary } ;
  private term(): ASTNode {
    let left = this.unary();
    while (this.match('STAR', 'SLASH', 'PERCENT')) {
      const operatorToken = this.tokens[this.current - 1];
      const operator = operatorToken.value as '*' | '/' | '%';
      const right = this.unary();
      left = { type: 'BinaryExpression', operator, left, right };
    }
    return left;
  }

  // unary = [ "-" ] , unary_target ;
  private unary(): ASTNode {
    if (this.match('MINUS')) {
      const argument = this.unaryTarget();
      return { type: 'UnaryExpression', operator: '-', argument };
    }
    return this.unaryTarget();
  }

  private unaryTarget(): ASTNode {
    return this.power();
  }

  // power = primary , [ "^" , power ] ;
  private power(): ASTNode {
    const left = this.primary();
    if (this.match('CARET')) {
      const right = this.power(); // 右結合なので再帰的にpowerを処理
      return { type: 'BinaryExpression', operator: '^', left, right };
    }
    return left;
  }

  // primary = NUMBER | call_expr | IDENTIFIER | "(" , expr , ")" ;
  private primary(): ASTNode {
    if (this.match('NUMBER')) {
      const valueStr = this.tokens[this.current - 1].value;
      return { type: 'NumberLiteral', value: parseFloat(valueStr) };
    }

    if (this.check('IDENTIFIER')) {
      // 先読みして '(' が続けば関数呼び出し
      if (this.tokens[this.current + 1]?.type === 'LPAREN') {
        return this.callExpr();
      }
      const idToken = this.advance();
      return { type: 'Identifier', name: idToken.value };
    }

    if (this.match('LPAREN')) {
      const expression = this.expr();
      this.consume('RPAREN', "Expect ')' after expression.");
      return expression;
    }

    const token = this.peek();
    throw new TanukiSyntaxError(`Unexpected token '${token.value}'`, token.line, token.column, token.position);
  }

  // call_expr = IDENTIFIER , "(" , [ expr , { "," , expr } ] , ")" ;
  private callExpr(): ASTNode {
    const calleeToken = this.consume('IDENTIFIER', "Expect function name.");
    this.consume('LPAREN', "Expect '(' after function name.");
    const args: ASTNode[] = [];
    if (!this.check('RPAREN')) {
      args.push(this.expr());
      while (this.match('COMMA')) {
        args.push(this.expr());
      }
    }
    this.consume('RPAREN', "Expect ')' after function arguments.");
    return { type: 'CallExpression', callee: calleeToken.value, arguments: args };
  }
}
