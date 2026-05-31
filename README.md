# 🐾 Mini-Compiler Challenge 2026: 'Tanuki-Script' Parser-Generator Hack

ようこそ、挑戦者（とその相棒のAI）の皆さん。

当コンテストには、賞金もトロフィーもありません。手に入るのは、ブラックボックスだった言語処理系を自らの手で支配する**「一生モノの戦闘力」**と、あなたに伴走することで**「極限まで拡張されたAIの思考レイヤー」**だけです。

提示される厳格なEBNF仕様を読み込み、パーサー（構文解析器）コードを**「パーサジェネレーター」**を自作してください。

---

## 😈 挑戦を阻む「yaccプログラマ殺し」の罠

本コンテストの四則演算エンジンには、一般的な教科書通りの実装（コピペ）では絶対に突破できない**「結合性と優先順位の罠」**が仕込まれています。

- **Level 1: 基本四則演算**（左結合のループ処理）  
- **Level 2: べき乗演算子（`^`）の導入**（★罠：右結合の動的制御）  
- **Level 3: 単項マイナスと関数の地獄ネスト**（符号反転と優先順位の衝突解決）

LLMにコードを丸投げしても、動的なジェネレーターの再帰構造はハルシネーション（嘘）を誘発し、テストケースの波に飲まれるでしょう。あなたがAIの「思考レイヤー」となり、厳格な仕様を壁打ちしながら設計を導いてください。

---

## 📜 ターゲット言語：『Tanuki-Script』文法仕様（EBNF）

あなたのジェネレーター（`loadEBNF`）が解釈し、パーサーを動的生成すべき確定文法テキストです。

```ebnf  
program       = { statement } ;  
statement     = assignment_st | expr_st ;  
assignment_st = IDENTIFIER , "=" , expr , ";" ;  
expr_st       = expr , ";" ;

expr          = term , { ( "+" | "-" ) , term } ;  
term          = unary , { ( "*" | "/" | "%" ) , unary } ;  
unary         = [ "-" ] , unary_target ;  
unary_target  = power ;  
power         = primary , [ "^" , power ] ;  (* ★右結合 *)

primary       = NUMBER  
              | call_expr  
              | IDENTIFIER  
              | "(" , expr , ")" ;  
call_expr     = IDENTIFIER , "(" , [ expr , { "," , expr } ] , ")" ;
```

---

## 🚀 開発の始め方 & 防衛型ジャッジ規則

### 1. 環境構築

当テンプレートを **Fork** または **Clone** し、以下のコマンドで依存関係を解決してください（Bun / Node.js 環境に対応）。

```bash  
npm install
```
*(または `bun install`)*

### 2. 実装ターゲット

あなたがコードを記述するエリアは `src/generator/parserGen.ts` のみです。  
運営が提供する共通Lexer（字句解析器）から渡されるトークン列を処理し、指定された ASTNode（JSON）を出力するインターフェースを完成させてください。

### 3. セキュア・ライブジャッジ（提出方法）

変更を `main` ブランチに **git push** するだけで、裏側の隔離されたプライベート採点環境（Tanuki-Judge）へ安全にペイロードが送信され、自動採点が開始されます。

* **15分のレートリミット（Cooldown）：** サーバー負荷軽減のため、前回の提出から15分間は再採点されません。  
* **LLM定性コードレビュー：** すべての罠テストケース（100点）をクリアした美麗なコードにのみ、最新のLLM（シニアアーキテクト）が起動し、最大30点の「コード美スコア」と熱いフィードバックをPRに書き込みます。

---

## 🏆 リアルタイム・リーダーボード

世界中の挑戦者たちとAIの共鳴を目撃せよ。

👉 **[Mini-Compiler Challenge 2026 - Live Leaderboard](https://netwavers.github.io/mini-compiler-challenge-2026/)** 👑
