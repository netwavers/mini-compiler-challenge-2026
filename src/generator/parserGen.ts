import { Token, ASTNode } from '../common/types';

export class TanukiParserGenerator {
  private ebnfSchema: string = '';

  public loadEBNF(ebnfSchema: string): void {
    this.ebnfSchema = ebnfSchema;
    // EBNF文字列の解析・構文規則の内部ビルドをここに記述します
  }

  public parse(tokens: Token[]): ASTNode {
    // 構文解析を実行し、共通ASTNodeオブジェクトを返却
    throw new Error("Not implemented");
  }
}
