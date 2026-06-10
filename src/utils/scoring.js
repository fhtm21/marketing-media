/**
 * Scoring logic for Startup Destiny RPG
 * Maps interactions to archetype points
 */

export const calculateScores = (interactions) => {
  // Initialize scores for all archetypes
  const scores = {
    trail: 0,
    tech: 0,
    create: 0,
    design: 0,
    change: 0,
    strat: 0
  };

  // Safely handle undefined/null interactions
  if (!interactions || !Array.isArray(interactions)) {
    return scores;
  }

  // Process each interaction and add points
  interactions.forEach((interaction) => {
    const { type, value = {}, stage } = interaction || {};
    
    // Apply scoring based on interaction type and value
    switch (type) {
      case 'cardDraw':
        // Card drawing interaction
        if (value.archetype) {
          scores[value.archetype] += value.points || 1;
        }
        break;
        
      case 'cloudReach':
        // Cloud reaching interaction
        if (value.height) {
          // Higher reaches = more ambitious traits
          if (value.height >= 80) {
            scores.trail += 2; // Pioneer likes to reach high
            scores.create += 1;
          } else if (value.height >= 50) {
            scores.strat += 2; // Strategist likes medium-high planning
            scores.tech += 1;
          } else {
            scores.design += 1; // Designer appreciates grounded beauty
            scores.change += 1; // Changemaker values foundation
          }
        }
        if (value.speed) {
          // Quick reaches = energetic traits
          if (value.speed > 0.7) {
            scores.trail += 1;
            scores.create += 1;
          }
        }
        break;
        
      case 'constellationAim':
        // Constellation aiming interaction
        if (value.pattern) {
          switch (value.pattern) {
            case 'trailblazer': // Zigzag pattern
              scores.trail += 2;
              scores.create += 1;
              break;
            case 'builder': // Block/structure pattern
              scores.tech += 2;
              scores.strat += 1;
              break;
            case 'creator': // Flowing/artistic pattern
              scores.create += 2;
              scores.design += 1;
              break;
            case 'harmony': // Circular/bonding pattern
              scores.design += 2;
              scores.change += 1;
              break;
            case 'growth': // Branching/expanding pattern
              scores.change += 2;
              scores.tech += 1;
              break;
            case 'strategist': // Geometric/precise pattern
              scores.strat += 2;
              scores.tech += 1;
              break;
          }
        }
        if (value.accuracy) {
          // Precise aiming = strategic/technical traits
          if (value.accuracy > 0.8) {
            scores.strat += 1;
            scores.tech += 1;
          }
        }
        break;
        
      case 'dreamRiver':
        // Dream river path choice
        if (value.path) {
          switch (value.path) {
            case 'innovation': // Bright, flashing path
              scores.create += 2;
              scores.design += 1;
              break;
            case 'wisdom': // Glowing, steady path
              scores.strat += 2;
              scores.tech += 1;
              break;
            case 'compassion': // Soft, warm path
              scores.change += 2;
              scores.design += 1;
              break;
            case 'adventure': // Winding, mysterious path
              scores.trail += 2;
              scores.create += 1;
              break;
          }
        }
        break;
        
      case 'wishTree':
        // Wish tree interaction
        if (value.category) {
          switch (value.category) {
            case 'success': // Achievement wishes
              scores.trail += 2;
              scores.strat += 1;
              break;
            case 'love': // Relationship wishes
              scores.design += 2;
              scores.change += 1;
              break;
            case 'adventure': // Exploration wishes
              scores.trail += 2;
              scores.create += 1;
              break;
            case 'wisdom': // Knowledge wishes
              scores.strat += 2;
              scores.tech += 1;
              break;
            case 'healing': // Help others wishes
              scores.change += 2;
              scores.design += 1;
              break;
            case 'innovation': // New ideas wishes
              scores.create += 2;
              scores.trail += 1;
              break;
          }
        }
        // Depth of intention matters
        if (value.depth) {
          if (value.depth > 0.7) {
            // Deep wishes indicate reflective types
            scores.design += 1;
            scores.strat += 1;
          }
        }
        break;
        
      case 'moonMirror':
        // Moon mirror reflection
        if (value.reflection) {
          switch (value.reflection) {
            case 'leader': // Crown/reflection of authority
              scores.trail += 2;
              scores.strat += 1;
              break;
            case 'artist': // Palette/reflection of creativity
              scores.create += 2;
              scores.design += 1;
              break;
            case 'builder': // Tools/reflection of construction
              scores.tech += 2;
              scores.design += 1;
              break;
            case 'healer': // Hands/reflection of helping
              scores.change += 2;
              scores.design += 1;
              break;
            case 'planner': // Map/reflection of strategy
              scores.strat += 2;
              scores.tech += 1;
              break;
            case 'innovator': // Lightbulb/reflection of ideas
              scores.create += 2;
              scores.trail += 1;
              break;
          }
        }
        if (value.clarity) {
          // Clear reflection = self-aware types
          if (value.clarity > 0.8) {
            scores.design += 1;
            scores.strat += 1;
          }
        }
        break;
        
      case 'sunrisePath':
        // Sunrise path walk
        if (value.focus) {
          switch (value.focus) {
            case 'horizon': // Looking far ahead
              scores.trail += 2;
              scores.strat += 1;
              break;
            case 'flowers': // Beauty at feet
              scores.design += 2;
              scores.change += 1;
              break;
            case 'birds': // Freedom in sky
              scores.create += 2;
              scores.trail += 1;
              break;
            case 'water': // Reflection and depth
              scores.strat += 2;
              scores.tech += 1;
              break;
            case 'rocks': // Stability and foundation
              scores.tech += 2;
              scores.change += 1;
              break;
            case 'light': // Pure inspiration
              scores.create += 2;
              scores.design += 1;
              break;
          }
        }
        if (value.pace) {
          // Walking pace indicates energy type
          if (value.pace > 0.7) { // Fast walker
            scores.trail += 1;
            scores.create += 1;
          } else if (value.pace < 0.3) { // Slow walker
            scores.design += 1;
            scores.change += 1;
          }
        }
        break;
        
      default:
        // Unknown interaction type
        break;
    }
  });

  return scores;
};

/**
 * Determine the dominant archetype from scores
 * @param {Object} scores - Scores object with archetype keys
 * @returns {string} - Key of the dominant archetype
 */
export const getDominantArchetype = (scores) => {
  const archetypes = ['trail', 'tech', 'create', 'design', 'change', 'strat'];
  let maxScore = -Infinity;
  let dominant = 'trail'; // Default fallback
  
  archetypes.forEach(archetype => {
    if (scores[archetype] > maxScore) {
      maxScore = scores[archetype];
      dominant = archetype;
    }
    // In case of tie, choose the first in order (consistent with original)
  });
  
  return dominant;
};

export default { calculateScores, getDominantArchetype };