// scoring.js — XP, stars, and distractor generation

// XP per attempt (TRD §10.1)
export function calcXP(attemptNumber, hintsUsed, streak) {
  let base = 10;
  if (attemptNumber === 2) base = 7;
  if (attemptNumber >= 3) base = 5;

  // Deduct 2 XP per hint used (min 2 XP)
  base = Math.max(2, base - hintsUsed * 2);

  // Streak bonus: +2 per streak (max +10)
  const streakBonus = Math.min(10, (streak > 1 ? (streak - 1) * 2 : 0));

  return base + streakBonus;
}

// Stars per world (TRD §10.2)
export function calcStars(correct, total = 10) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

// Can a world be unlocked?
export function canUnlockWorld(isPreviousWorldCompleted) {
  return isPreviousWorldCompleted === true;
}

// Total stars across all worlds
export function calcTotalStars(worldScores) {
  return Object.values(worldScores).reduce((sum, score) => {
    return sum + calcStars(score);
  }, 0);
}

// Generate MCQ distractors for angle questions
export function generateAngleDistractors(correct) {
  const offsets = [-30, -20, -10, 10, 20, 30].filter(o => {
    const v = correct + o;
    return v > 0 && v < 180 && v !== correct;
  });
  const picked = [];
  while (picked.length < 3 && offsets.length > 0) {
    const idx = Math.floor(Math.random() * offsets.length);
    const val = correct + offsets[idx];
    if (!picked.includes(val)) picked.push(val);
    offsets.splice(idx, 1);
  }
  // Fill if needed
  while (picked.length < 3) {
    const fallback = correct + (picked.length + 1) * 15;
    if (!picked.includes(fallback) && fallback > 0 && fallback < 360) {
      picked.push(fallback);
    }
  }
  return picked;
}

// Generate MCQ distractors for side/length questions
export function generateSideDistractors(correct) {
  const candidates = [correct - 4, correct - 2, correct + 2, correct + 4]
    .filter(v => v > 0 && v !== correct);
  const picked = [];
  while (picked.length < 3 && candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    picked.push(candidates[idx]);
    candidates.splice(idx, 1);
  }
  return picked;
}

// Shuffle options array keeping track of correct index
export function shuffleOptions(options) {
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.map(i => options[i]);
}
