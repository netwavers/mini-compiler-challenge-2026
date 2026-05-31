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

## 🚀 開発の始め方（爆速3ステップ）

### Step 1: テンプレートをローカルにクローン
本リポジトリをご自身の GitHub アカウントに **Fork** するか、またはローカル環境に直接 **Clone** して取得してください。

```bash
git clone https://github.com/netwavers/mini-compiler-challenge-2026.git
cd mini-compiler-challenge-2026
```

### Step 2: 依存パッケージのインストール
Node.js (npm) または Bun 環境で以下のコマンドを実行し、TypeScriptおよびJest開発環境を初期化します。

```bash
# npm (Node.js) の場合
npm install

# bun の場合
bun install
```

### Step 3: ローカルテストを実行して「Not implemented」の失敗を確認
開発準備が整っているかを検証するため、以下のコマンドで初期テストを実行します。パーサーは未実装テンプレートであるため、期待通りテストが失敗（Failed）することを確認してください。

```bash
# npm の場合
npm run test

# bun の場合
bun test
```

---

## 🎯 開発・検証お役立ちコマンド集

### 1. 個別コードをパースしてASTのJSON構造を目視検証する
実装中のパーサーがどのようなASTツリー（JSON）を出力するかを、ターミナル上で直接確認・デバッグできます。

```bash
# npm (Node.js) の場合
npx ts-node src/index.ts <ebnf-file-path> <source-file-path>

# bun の場合
bun run src/index.ts <ebnf-file-path> <source-file-path>
```

### 2. TypeScript コンパイル・ビルドの確認
提出（プッシュ）前に、型エラーやコンパイル不整合が発生していないかを検証できます。

```bash
# npm の場合
npm run build

# bun の場合
bun run build
```

---

## ⚙️ セキュア・ライブジャッジ（提出方法）

変更を `main` ブランチに **git push** するだけで、裏側の隔離されたプライベート採点環境（Tanuki-Judge）へ安全にペイロードが送信され、自動採点が開始されます。

* **15分のレートリミット（Cooldown）：** サーバー負荷軽減のため、前回の提出から15分間は再採点されません。  
* **LLM定性コードレビュー：** すべての罠テストケース（100点）をクリアした美麗なコードにのみ、最新のLLM（シニアアーキテクト）が起動し、最大30点の「コード美スコア」と熱いフィードバックをPRに書き込みます。

---

## 🏆 リアルタイム・リーダーボード

世界中の挑戦者たちとAIの共鳴を目撃せよ。

👉 **[Mini-Compiler Challenge 2026 - Live Leaderboard](https://netwavers.github.io/mini-compiler-challenge-2026/)** 👑
