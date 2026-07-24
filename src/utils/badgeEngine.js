// badgeEngine.js — 8 badge unlock conditions (TRD §10.3)

export const BADGES = [
  {
    id: 'shape_explorer',
    icon: '🔍',
    label: 'Shape Explorer',
    desc: 'Complete the Wonder phase',
  },
  {
    id: 'story_keeper',
    icon: '📖',
    label: 'Story Keeper',
    desc: 'Read all 6 story panels',
  },
  {
    id: 'parallelogram_builder',
    icon: '🏗️',
    label: 'Parallelogram Builder',
    desc: 'Build a correct parallelogram in Station A',
  },
  {
    id: 'sharp_eye',
    icon: '👁️',
    label: 'Sharp Eye',
    desc: 'Identify all parallelograms without a wrong pick',
  },
  {
    id: 'angle_champion',
    icon: '📐',
    label: 'Angle Champion',
    desc: 'Complete all 3 simulation stations',
  },
  {
    id: 'streak_star',
    icon: '🔥',
    label: 'Streak Star',
    desc: 'Answer 5 questions correctly in a row',
  },
  {
    id: 'diagonal_detective',
    icon: '🔺',
    label: 'Diagonal Detective',
    desc: 'Correctly answer a diagonal bisection question',
  },
  {
    id: 'full_journey',
    icon: '🏆',
    label: 'Full Journey',
    desc: 'Complete all 5 phases',
  },
];

export const BADGE_MAP = Object.fromEntries(BADGES.map(b => [b.id, b]));

/**
 * Given the current state, return an array of newly unlocked badge IDs
 * Call after every state-changing action
 */
export function checkBadges(state) {
  const newBadges = [];
  const earned = state.badges || [];

  const has = id => earned.includes(id);

  if (!has('shape_explorer') && state.phase === 'story') {
    newBadges.push('shape_explorer');
  }

  if (!has('story_keeper') && state.storyPanel >= 5 && state.phase !== 'intro') {
    newBadges.push('story_keeper');
  }

  if (!has('parallelogram_builder') && state.buildStationComplete) {
    newBadges.push('parallelogram_builder');
  }

  if (!has('sharp_eye') && state.stationBPerfect) {
    newBadges.push('sharp_eye');
  }

  if (!has('angle_champion') && state.simStationsComplete >= 3) {
    newBadges.push('angle_champion');
  }

  if (!has('streak_star') && state.streak >= 5) {
    newBadges.push('streak_star');
  }

  if (!has('diagonal_detective') && state.diagonalCorrect) {
    newBadges.push('diagonal_detective');
  }

  if (!has('full_journey') && state.phase === 'complete') {
    newBadges.push('full_journey');
  }

  return newBadges;
}
