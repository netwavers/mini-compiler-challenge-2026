const fs = require('fs');

const githubId = process.env.GITHUB_ACTOR || 'anonymous';
const avatarUrl = `https://github.com/${githubId}.png`;

let reviewResult = {
  scores: { architecture: 0, trap_handling: 0, robustness: 0 },
  total_score: 0,
  review_summary: "レビュー生成に失敗しました。"
};

try {
  if (fs.existsSync('review_result.json')) {
    reviewResult = JSON.parse(fs.readFileSync('review_result.json', 'utf-8'));
  }
} catch (e) {
  console.error("Failed to load review_result.json:", e.message);
}

// leaderboard.json の読み込み
let leaderboard = [];
if (fs.existsSync('leaderboard.json')) {
  try {
    leaderboard = JSON.parse(fs.readFileSync('leaderboard.json', 'utf-8'));
  } catch (e) {
    console.error("Failed to parse leaderboard.json, starting fresh:", e.message);
  }
}

// テストが全通している前提 (CI内でテスト成功時のみこのスクリプトが動くため)
const trapProgress = { level1: true, level2: true, level3: true };
const deterministicScore = 100.0; // テスト全通で100点
const llmTotal = (reviewResult.scores.architecture || 0) + (reviewResult.scores.trap_handling || 0) + (reviewResult.scores.robustness || 0);
const totalScore = deterministicScore + llmTotal;

const newEntry = {
  github_id: githubId,
  avatar_url: avatarUrl,
  total_score: totalScore,
  trap_progress: trapProgress,
  llm_scores: {
    architecture: reviewResult.scores.architecture || 0,
    trap_handling: reviewResult.scores.trap_handling || 0,
    robustness: reviewResult.scores.robustness || 0
  },
  last_push_at: new Date().toISOString(),
  review_summary: reviewResult.review_summary
};

// 既存のユーザー情報を更新するか、新規追加する
const existingIndex = leaderboard.findIndex(entry => entry.github_id === githubId);
if (existingIndex !== -1) {
  leaderboard[existingIndex] = newEntry;
} else {
  leaderboard.push(newEntry);
}

// スコア順にソートして順位（rank）を再アサイン
leaderboard.sort((a, b) => b.total_score - a.total_score);
leaderboard = leaderboard.map((entry, index) => ({
  rank: index + 1,
  ...entry
}));

// 保存
fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard, null, 2));
console.log("Successfully updated leaderboard.json!");
console.log(JSON.stringify(leaderboard, null, 2));
