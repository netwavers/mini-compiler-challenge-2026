import * as fs from 'fs';
import { TanukiLexer } from './common/lexer';
import { TanukiParserGenerator } from './generator/parserGen';

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: ts-node src/index.ts <ebnf-file> <source-file>");
    process.exit(1);
  }

  const ebnfPath = args[0];
  const sourcePath = args[1];

  try {
    const ebnfSchema = fs.readFileSync(ebnfPath, 'utf-8');
    const sourceCode = fs.readFileSync(sourcePath, 'utf-8');

    // 1. 字句解析
    const lexer = new TanukiLexer(sourceCode);
    const tokens = lexer.tokenize();

    // 2. 構文解析
    const generator = new TanukiParserGenerator();
    generator.loadEBNF(ebnfSchema);
    const ast = generator.parse(tokens);

    // 3. 結果出力
    console.log(JSON.stringify(ast, null, 2));
  } catch (error: any) {
    console.error("Compilation / Parsing Error:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
