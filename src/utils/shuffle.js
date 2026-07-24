// shuffle.js — Fisher-Yates shuffle + session question generator

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick `count` items from each question type, then shuffle the combined set
export function generateSessionQuestions(bank, countPerType = 10) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });

  let session = [];
  Object.values(byType).forEach(group => {
    session = session.concat(shuffleArray(group).slice(0, countPerType));
  });
  return shuffleArray(session);
}

// Generate 10 questions per world (10 worlds = 100 questions total)
export function partitionIntoWorlds(questions) {
  const worlds = [];
  for (let i = 0; i < 10; i++) {
    worlds.push(questions.slice(i * 10, i * 10 + 10));
  }
  return worlds;
}
