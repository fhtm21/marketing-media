// ============================================================
// STARTUP DESTINY RPG — Scoring Logic
// Simple tally: each stage calls onComplete(key) → +1 to that archetype
// ============================================================

import { ARCH, ARCH_ORDER } from "./archetypes";

/** Returns a fresh zeroed scores object */
export const initScores = () => ({
  trail: 0,
  tech: 0,
  create: 0,
  design: 0,
  change: 0,
  strat: 0,
});

/** Returns a new scores object with key incremented by 1 */
export const addScore = (scores, key) => ({
  ...scores,
  [key]: (scores[key] ?? 0) + 1,
});

/** Returns the full ARCH object for the winning archetype */
export const getResult = (scores) => {
  const max = Math.max(...Object.values(scores));
  const winner = ARCH_ORDER.find((k) => scores[k] === max) ?? "trail";
  return ARCH[winner];
};