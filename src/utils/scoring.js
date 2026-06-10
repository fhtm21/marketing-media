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

  // Stage weight multipliers: later stages carry more insight
  const STAGE_WEIGHTS = [1, 1.2, 1.2, 1.5, 1.5, 1.8, 1.8];

  const applyScore = (archetype, points, stage) => {
    if (!archetype || !scores.hasOwnProperty(archetype)) return;
    const weight = STAGE_WEIGHTS[stage] ?? 1;
    scores[archetype] += points * weight;
  };

  // Process each interaction and add points
  interactions.forEach((interaction) => {
    const { type, value = {}, stage } = interaction || {};
    
    // Apply scoring based on interaction type and value
    switch (type) {
      case 'cardDraw':
        // Card drawing interaction
        if (value.archetype) {
          applyScore(value.archetype, value.points || 1, stage);
        }
        break;
        
      case 'cloudReach':
        // Cloud reaching interaction — use the archetype the user jumped to
        applyScore(value.archetype, 2, stage);
        if (value.speed && value.speed > 0.7) {
          applyScore('trail', 1, stage);
          applyScore('create', 1, stage);
        }
        break;
        
      case 'constellationAim':
        // Constellation aiming interaction
        if (value.pattern) {
          switch (value.pattern) {
            case 'trailblazer': applyScore('trail', 2, stage); applyScore('create', 1, stage); break;
            case 'builder':     applyScore('tech', 2, stage);  applyScore('strat', 1, stage);  break;
            case 'creator':     applyScore('create', 2, stage); applyScore('design', 1, stage); break;
            case 'harmony':     applyScore('design', 2, stage); applyScore('change', 1, stage); break;
            case 'growth':      applyScore('change', 2, stage); applyScore('tech', 1, stage);   break;
            case 'strategist':  applyScore('strat', 2, stage);  applyScore('tech', 1, stage);   break;
          }
        }
        if (value.accuracy && value.accuracy > 0.8) {
          applyScore('strat', 1, stage);
          applyScore('tech', 1, stage);
        }
        break;
        
      case 'dreamRiver': {
        // Dream river — all three step choices sent as value.paths array
        const pathList = Array.isArray(value.paths)
          ? value.paths
          : value.path ? [{ path: value.path, archetype: value.archetype }] : [];
        pathList.forEach(({ path, archetype: pArch }) => {
          applyScore(pArch, 2, stage);
          switch (path) {
            case 'innovation': applyScore('design', 1, stage); break;
            case 'wisdom':     applyScore('tech', 1, stage);   break;
            case 'compassion': applyScore('design', 1, stage); break;
            case 'adventure':  applyScore('create', 1, stage); break;
            case 'cross':      applyScore('trail', 1, stage);  break;
            case 'negotiate':  applyScore('strat', 1, stage);  break;
            case 'fly':        applyScore('trail', 1, stage);  break;
            case 'help':       applyScore('design', 1, stage); break;
            case 'reflection': applyScore('strat', 1, stage);  break;
            case 'map':        applyScore('tech', 1, stage);   break;
            case 'stars':      applyScore('create', 1, stage); break;
            case 'lotus':      applyScore('tech', 1, stage);   break;
          }
        });
        break;
      }
        
      case 'wishTree':
        // Wish tree interaction
        if (value.category) {
          switch (value.category) {
            case 'success':    applyScore('trail', 2, stage);  applyScore('strat', 1, stage);  break;
            case 'love':       applyScore('design', 2, stage); applyScore('change', 1, stage); break;
            case 'adventure':  applyScore('trail', 2, stage);  applyScore('create', 1, stage); break;
            case 'wisdom':     applyScore('strat', 2, stage);  applyScore('tech', 1, stage);   break;
            case 'healing':    applyScore('change', 2, stage); applyScore('design', 1, stage); break;
            case 'innovation': applyScore('create', 2, stage); applyScore('trail', 1, stage);  break;
          }
        }
        if (value.depth && value.depth > 0.7) {
          applyScore('design', 1, stage);
          applyScore('strat', 1, stage);
        }
        break;
        
      case 'moonMirror':
        // Moon mirror reflection
        if (value.reflection) {
          switch (value.reflection) {
            case 'leader':    applyScore('trail', 2, stage);  applyScore('strat', 1, stage);  break;
            case 'artist':    applyScore('create', 2, stage); applyScore('design', 1, stage); break;
            case 'builder':   applyScore('tech', 2, stage);   applyScore('design', 1, stage); break;
            case 'healer':    applyScore('change', 2, stage); applyScore('design', 1, stage); break;
            case 'planner':   applyScore('strat', 2, stage);  applyScore('tech', 1, stage);   break;
            case 'innovator': applyScore('create', 2, stage); applyScore('trail', 1, stage);  break;
          }
        }
        if (value.clarity && value.clarity > 0.8) {
          applyScore('design', 1, stage);
          applyScore('strat', 1, stage);
        }
        break;
        
      case 'sunrisePath':
        // Sunrise path walk
        if (value.focus) {
          switch (value.focus) {
            case 'horizon': applyScore('trail', 2, stage);  applyScore('strat', 1, stage);  break;
            case 'flowers': applyScore('design', 2, stage); applyScore('change', 1, stage); break;
            case 'birds':   applyScore('create', 2, stage); applyScore('trail', 1, stage);  break;
            case 'water':   applyScore('strat', 2, stage);  applyScore('tech', 1, stage);   break;
            case 'rocks':   applyScore('tech', 2, stage);   applyScore('change', 1, stage); break;
            case 'light':   applyScore('create', 2, stage); applyScore('design', 1, stage); break;
          }
        }
        if (value.pace) {
          if (value.pace > 0.7) {
            applyScore('trail', 1, stage);
            applyScore('create', 1, stage);
          } else if (value.pace < 0.3) {
            applyScore('design', 1, stage);
            applyScore('change', 1, stage);
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
  });
  
  return dominant;
};

/**
 * Returns the second-highest scoring archetype (different from dominant).
 */
export const getSecondaryArchetype = (scores, dominant) => {
  const archetypes = ['trail', 'tech', 'create', 'design', 'change', 'strat'];
  let maxScore = -Infinity;
  let secondary = archetypes.find(a => a !== dominant) || 'tech';

  archetypes.forEach(archetype => {
    if (archetype !== dominant && scores[archetype] > maxScore) {
      maxScore = scores[archetype];
      secondary = archetype;
    }
  });

  return secondary;
};

export default { calculateScores, getDominantArchetype, getSecondaryArchetype };