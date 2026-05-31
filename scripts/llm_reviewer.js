const fs = require('fs');
const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

// 参加者実装コードを読み込み
let parserGenContent = '';
try {
  parserGenContent = fs.readFileSync('src/generator/parserGen.ts', 'utf-8');
} catch (e) {
  console.error("Error reading parserGen.ts:", e.message);
  process.exit(1);
}

const prompt = `あなたは「Mini-Compiler Challenge 2026」の優秀な運営ジャッジAIです。
参加者が実装したコンパイラのパーサージェネレーターコード（src/generator/parserGen.ts）の定性コードレビューを、以下の基準で厳密に行ってください。

# 採点基準（各10点満点、計30点満点）  
1. アーキテクチャの疎結合性と美しさ (architecture)：解析部と実行部の分離、関数・クラスの抽象化度。  
2. 右結合・優先順位の攻略ロジック (trap_handling)：べき乗の右結合や単項演算子の罠を汎用的なルール解釈で解決しているか。  
3. エラーハンドリングと堅牢性 (robustness)：文法エラー時に発生位置（Line/Column/Position）を明示できているか。

# 出力フォーマット（以下のJSON構造のみを返してください。マークダウンの\`\`\`json等の装飾は一切不要です）
{  
  "scores": { "architecture": 0, "trap_handling": 0, "robustness": 0 },  
  "total_score": 0,  
  "review_summary": "200文字以内の要約（日本語）",  
  "technical_insights": ["美しかった点", "罠をどう解いたか"],  
  "improvement_feedback": ["具体的なリファクタリング提案"]  
}

※total_scoreは、scoresの3項目の合計（最大30点）にしてください。

レビュー対象コード:
\`\`\`typescript
${parserGenContent}
\`\`\`
`;

const postData = JSON.stringify({
  contents: [{
    parts: [{ text: prompt }]
  }],
  generationConfig: {
    responseMimeType: "application/json"
  }
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log("Sending request to Gemini API...");

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const responseJson = JSON.parse(data);
      if (responseJson.error) {
        console.error("Gemini API Error:", responseJson.error.message);
        process.exit(1);
      }
      
      let resultText = responseJson.candidates[0].content.parts[0].text.trim();
      
      // Strip markdown json code block if present
      if (resultText.startsWith('```')) {
        resultText = resultText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      
      const reviewResult = JSON.parse(resultText);
      
      // レビュー結果を一時保存
      fs.writeFileSync('review_result.json', JSON.stringify(reviewResult, null, 2));
      console.log("Qualitative review successfully generated and saved to review_result.json!");
      console.log("Result:", JSON.stringify(reviewResult, null, 2));
    } catch (e) {
      console.error("Failed to parse Gemini response:", e.message);
      console.error("Raw response data:", data);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error("HTTP Request Error:", e.message);
  process.exit(1);
});

req.write(postData);
req.end();
