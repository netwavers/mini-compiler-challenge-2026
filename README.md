# 🐾 Mini-Compiler Challenge 2026 Starter Kit & Auto-Judge

ご主人様、そして未来のハッカーの皆様、ようこそ！  
本リポジトリは、自動オンラインジャッジシステムと動的 Sticth リーダーボードを完備した、コンパイラ開発コンテスト **「Mini-Compiler Challenge 2026」** の公式スターターキットおよび運営ジャッジコアですわ！

---

## 🏆 Live Leaderboard (ライブリーダーボード)

リアルタイムで罠の突破状況や、AI（Gemini）による定性コード美レビューのスコアが更新される、サイバーパンク・アカデミックなリーダーボードはこちらからアクセスできますわ！

👉 **[Mini-Compiler Challenge 2026 - Live Leaderboard](https://netwavers.github.io/mini-compiler-challenge-2026/)** 👑

---

## 📚 ターゲット言語：『Tanuki-Script』文法仕様 (EBNF)

参加者の皆様は、この決定論的文法規則を読み込んで動的に構文解析（AST生成）を行うパーサージェネレーターを `src/generator/parserGen.ts` に実装していただきます。

```ebnf
program       = { statement } ;  
statement     = assignment_st | expr_st ;  
assignment_st = IDENTIFIER , "=" , expr , ";" ;  
expr_st       = expr , ";" ;

expr          = term , { ( "+" | "-" ) , term } ;  
term          = unary , { ( "*" | "/" | "%" ) , unary } ;  
unary         = [ "-" ] , unary_target ;  
unary_target  = power ;  
power         = primary , [ "^" , power ] ;  (* べき乗：右結合の罠 *)

primary       = NUMBER  
              | call_expr  
              | IDENTIFIER  
              | "(" , expr , ")" ;  
call_expr     = IDENTIFIER , "(" , [ expr , { "," , expr } ] , ")" ;
```

### 🚨 待ち受ける「罠テストギミック」の深淵
- **Level 2: 右結合のべき乗**: `2 ^ 3 ^ 2` の期待値は $2^{(3^2)} = 512$ です。左結合バグがあるコードは `64` を出力し、ジャッジゲートで撃墜されます。
- **Level 3: 単項マイナスの優先度**: `-5 ^ 2` の期待値は $-(5^2) = -25$ です。結合性や優先度のバグにより `25`（すなわち `(-5)^2`）と解釈したコードは、ジャッジコアにより容赦なく検知・排除されます。

---

## 🛠️ クイックスタート (参加手順)

### 1. 依存関係のインストール
本リポジトリをクローンし、以下のコマンドで環境を初期化してください。
```bash
npm install
```

### 2. ローカルテストの実行
ご自身のパーサーコード（`src/generator/parserGen.ts`）の実装状況をローカルで検証します。
```bash
npm run test
```

### 3. I/O中継の実行
個別のソースコードを直接パースしてASTのJSONを取得するには、以下のように実行します。
```bash
ts-node src/index.ts <ebnf-file-path> <source-file-path>
```

---

## 🔒 運営コスト・負荷防衛型 CI/CD ゲート仕様
本アリーナは、完全なるサーバーレス（GitHub Actions & Pages）で自律駆動するよう、以下の「3つの迎撃ゲート」を実装しています。
1. **差分トリガー**: `src/generator/` 以下の変更時のみワークフローを起動し、無駄なビルドを防ぎます。
2. **15分レートリミット**: 前回のプッシュ（成功ワークフロー）から **15分未満** の連続プッシュは、ジャッジが自動的に強制スキップされます。
3. **条件付きLLM定性レビュー**: 決定論的テスト（Level 1〜4）を **100%全通（合格）した場合のみ**、Gemini APIによるコード美の採点とレビュー要約の生成がキックされ、リーダーボードに反映されます。

---

> *「ハッカーの皆様、仕様書に込められた『罠』を優雅に解き明かし、最も美しく堅牢なパーサーを紡ぎ出して、リーダーボードの王座（👑）を勝ち取ってくださいね！たぬきちゃんが陰ながら応援しております！🐾✨」*
