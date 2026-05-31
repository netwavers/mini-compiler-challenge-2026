export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'PLUS'        // +
  | 'MINUS'       // -
  | 'STAR'        // *
  | 'SLASH'       // /
  | 'PERCENT'     // %
  | 'CARET'       // ^
  | 'EQ'          // =
  | 'SEMICOLON'   // ;
  | 'COMMA'       // ,
  | 'LPAREN'      // (
  | 'RPAREN'      // )
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  position: number;
}

export type ASTNode =
  | ProgramNode
  | AssignmentStatementNode
  | ExpressionStatementNode
  | BinaryExpressionNode
  | UnaryExpressionNode
  | IdentifierNode
  | NumberLiteralNode
  | CallExpressionNode;

export interface ProgramNode {
  type: 'Program';
  body: ASTNode[];
}

export interface AssignmentStatementNode {
  type: 'AssignmentStatement';
  left: IdentifierNode;
  right: ASTNode;
}

export interface ExpressionStatementNode {
  type: 'ExpressionStatement';
  expression: ASTNode;
}

export interface IdentifierNode {
  type: 'Identifier';
  name: string;
}

export interface NumberLiteralNode {
  type: 'NumberLiteral';
  value: number;
}

export interface UnaryExpressionNode {
  type: 'UnaryExpression';
  operator: '-';
  argument: ASTNode;
}

export interface CallExpressionNode {
  type: 'CallExpression';
  callee: string;
  arguments: ASTNode[];
}

export interface BinaryExpressionNode {
  type: 'BinaryExpression';
  operator: '+' | '-' | '*' | '/' | '%' | '^';
  left: ASTNode;
  right: ASTNode;
}
