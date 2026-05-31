import { TanukiLexer } from '../src/common/lexer';
import { TanukiParserGenerator } from '../src/generator/parserGen';

describe('Mini-Compiler Challenge 2026 Deterministic Judge Tests', () => {
  let generator: TanukiParserGenerator;

  const ebnfSchema = `
    program       = { statement } ;  
    statement     = assignment_st | expr_st ;  
    assignment_st = IDENTIFIER , "=" , expr , ";" ;  
    expr_st       = expr , ";" ;

    expr          = term , { ( "+" | "-" ) , term } ;  
    term          = unary , { ( "*" | "/" | "%" ) , unary } ;  
    unary         = [ "-" ] , unary_target ;  
    unary_target  = power ;  
    power         = primary , [ "^" , power ] ;

    primary       = NUMBER  
                  | call_expr  
                  | IDENTIFIER  
                  | "(" , expr , ")" ;  
    call_expr     = IDENTIFIER , "(" , [ expr , { "," , expr } ] , ")" ;
  `;

  beforeEach(() => {
    generator = new TanukiParserGenerator();
    generator.loadEBNF(ebnfSchema);
  });

  it('Level 1: Basic assignment and arithmetic (x = 10 + 20;)', () => {
    const input = 'x = 10 + 20;';
    const lexer = new TanukiLexer(input);
    const tokens = lexer.tokenize();
    const ast = generator.parse(tokens);

    expect(ast).toEqual({
      type: 'Program',
      body: [
        {
          type: 'AssignmentStatement',
          left: { type: 'Identifier', name: 'x' },
          right: {
            type: 'BinaryExpression',
            operator: '+',
            left: { type: 'NumberLiteral', value: 10 },
            right: { type: 'NumberLiteral', value: 20 }
          }
        }
      ]
    });
  });

  it('Level 2: Right-associative Power operator (2 ^ 3 ^ 2;)', () => {
    // べき乗は右結合なので 2 ^ (3 ^ 2) = 512 となる構造を期待
    const input = '2 ^ 3 ^ 2;';
    const lexer = new TanukiLexer(input);
    const tokens = lexer.tokenize();
    const ast = generator.parse(tokens);

    expect(ast).toEqual({
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '^',
            left: { type: 'NumberLiteral', value: 2 },
            right: {
              type: 'BinaryExpression',
              operator: '^',
              left: { type: 'NumberLiteral', value: 3 },
              right: { type: 'NumberLiteral', value: 2 }
            }
          }
        }
      ]
    });
  });

  it('Level 3: Unary minus precedence over power (-5 ^ 2;)', () => {
    // EBNF上、unary は power の外側なので -(5^2) = -25 になる構造を期待
    const input = '-5 ^ 2;';
    const lexer = new TanukiLexer(input);
    const tokens = lexer.tokenize();
    const ast = generator.parse(tokens);

    expect(ast).toEqual({
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'UnaryExpression',
            operator: '-',
            argument: {
              type: 'BinaryExpression',
              operator: '^',
              left: { type: 'NumberLiteral', value: 5 },
              right: { type: 'NumberLiteral', value: 2 }
            }
          }
        }
      ]
    });
  });

  it('Level 4: Function call expression (calc(a, 10 + 20, 30);)', () => {
    const input = 'calc(a, 10 + 20, 30);';
    const lexer = new TanukiLexer(input);
    const tokens = lexer.tokenize();
    const ast = generator.parse(tokens);

    expect(ast).toEqual({
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: 'calc',
            arguments: [
              { type: 'Identifier', name: 'a' },
              {
                type: 'BinaryExpression',
                operator: '+',
                left: { type: 'NumberLiteral', value: 10 },
                right: { type: 'NumberLiteral', value: 20 }
              },
              { type: 'NumberLiteral', value: 30 }
            ]
          }
        }
      ]
    });
  });
});
