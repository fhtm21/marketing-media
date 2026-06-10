/**
 * Result generation with dreamy language for Startup Destiny RPG
 */

import { ARCHETYPES } from "./archetypes";

export const generateDreamyResult = (scores, dominantArchetype) => {
  const result = ARCHETYPES[dominantArchetype];
  
  // Generate constellation reading based on highest secondary scores
  const sortedScores = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([key]) => key);
  
  const primary = dominantArchetype;
  const secondary = sortedScores[1] || "trail";
  
  // Dreamy addition to fortune based on secondary
  const secondaryFortune = ARCHETYPES[secondary].fortune;
  
  // Generate a combined horoscope-style reading
  const reading = `Berdasarkan perjalanan mimpimu, bintang-bintang telah bersumpah bahwa kamu adalah ${result.name} - ${result.type}. 
  
Kekuatan utama yang terpancar dari jiwa terang kamu adalah: ${result.power}.

${result.fortune}

Sementara itu, ada energi ${ARCHETYPES[secondary].name} yang juga mengalir kuat dalam dirimu. ${secondaryFortune}

Masa depanmu cerah, dan alam semesta sedang menyiapkan jalan untukmu menuju ${result.prospek}`;

  return {
    ...result,
    dreamyReading: reading,
    primary,
    secondary,
    scoreBreakdown: scores
  };
};

export const getStageTitle = (stageIndex) => {
  const titles = [
    "Chapter 1: Tarot of Dreams",
    "Chapter 2: Reach the Clouds",
    "Chapter 3: Constellation Weaving",
    "Chapter 4: River of Destiny",
    "Chapter 5: Tree of Wishes",
    "Chapter 6: Mirror of Moonlight",
    "Chapter 7: Path of Dawn"
  ];
  return titles[stageIndex] || "The Dream Journey";
};

export const getStageSubtitle = (stageIndex) => {
  const subtitles = [
    "Draw cards from the starlight deck",
    "Jump to reach floating islands",
    "Aim and connect the stars",
    "Follow the glowing river",
    "Hang wishes on the ancient tree",
    "Gaze into the moonlit pool",
    "Walk the sunrise path"
  ];
  return subtitles[stageIndex] || "Continue your dream journey";
};

export default { generateDreamyResult, getStageTitle, getStageSubtitle };