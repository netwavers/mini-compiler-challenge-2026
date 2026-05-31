import { TanukiLexer, TanukiSyntaxError } from '../src/common/lexer';
import { TanukiParserGenerator } from '../src/generator/parserGen';

describe('TanukiLexer Tests', () => {
  it('should tokenize basic assignment statement correctly with location info', () => {
    const input = 'x = 10 + 20;\n  y = x ^ 2;';
    const lexer = new TanukiLexer(input);
    const tokens = lexer.tokenize();

    // x
    expect(tokens[0]).toEqual({ type: 'IDENTIFIER', value: 'x', line: 1, column: 1, position: 0 });
    // =
    expect(tokens[1]).toEqual({ type: 'EQ', value: '=', line: 1, column: 3, position: 2 });
    // 10
    expect(tokens[2]).toEqual({ type: 'NUMBER', value: '10', line: 1, column: 5, position: 4 });
    // +
    expect(tokens[3]).toEqual({ type: 'PLUS', value: '+', line: 1, column: 8, position: 7 });
    // 20
    expect(tokens[4]).toEqual({ type: 'NUMBER', value: '20', line: 1, column: 10, position: 9 });
    // ;
    expect(tokens[5]).toEqual({ type: 'SEMICOLON', value: ';', line: 1, column: 12, position: 11 });
    // y
    expect(tokens[6]).toEqual({ type: 'IDENTIFIER', value: 'y', line: 2, column: 3, position: 15 });
    // =
    expect(tokens[7]).toEqual({ type: 'EQ', value: '=', line: 2, column: 5, position: 17 });
    // x
    expect(tokens[8]).toEqual({ type: 'IDENTIFIER', value: 'x', line: 2, column: 7, position: 19 });
    // ^
    expect(tokens[9]).toEqual({ type: 'CARET', value: '^', line: 2, column: 9, position: 21 });
    // 2
    expect(tokens[10]).toEqual({ type: 'NUMBER', value: '2', line: 2, column: 11, position: 23 });
    // ;
    expect(tokens[11]).toEqual({ type: 'SEMICOLON', value: ';', line: 2, column: 12, position: 24 });
    // EOF
    expect(tokens[12].type).toBe('EOF');
  });

  it('should tokenize float numbers correctly', () => {
    const input = '3.14159';
    const lexer = new TanukiLexer(input);
    const tokens = lexer.tokenize();
    expect(tokens[0]).toEqual({ type: 'NUMBER', value: '3.14159', line: 1, column: 1, position: 0 });
  });

  it('should throw TanukiSyntaxError on unexpected character', () => {
    const input = 'x = 10 @ 20;';
    const lexer = new TanukiLexer(input);
    expect(() => lexer.tokenize()).toThrow(TanukiSyntaxError);
  });
});

describe('TanukiParserGenerator Tests', () => {
  it('should parse empty tokens list into an empty ProgramNode', () => {
    const generator = new TanukiParserGenerator();
    generator.loadEBNF('program = statement ;');
    const ast = generator.parse([]);
    expect(ast).toEqual({ type: 'Program', body: [] });
  });
});
