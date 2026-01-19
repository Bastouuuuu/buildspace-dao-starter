import {
  MAX_HERO_LEVELS,
  MAX_TROOP_LEVELS,
  MAX_SPELL_LEVELS,
  META_TROOPS,
  IMPORTANT_SPELLS,
  HERO_IMPORTANCE,
  WAR_SCORE_WEIGHTS,
  THRESHOLDS,
} from '../services/cocConstants';

/**
 * Calculer le score des héros d'un joueur
 * @param {Object} player - Données du joueur
 * @returns {Object} - Score et détails
 */
export const calculateHeroScore = (player) => {
  const th = player.townHallLevel;
  const maxLevels = MAX_HERO_LEVELS[th] || MAX_HERO_LEVELS[16];

  if (!player.heroes || player.heroes.length === 0) {
    return { score: 0, details: [], percentage: 0 };
  }

  let totalScore = 0;
  let totalMax = 0;
  const details = [];

  player.heroes.forEach(hero => {
    const maxLevel = maxLevels[hero.name] || 0;
    const importance = HERO_IMPORTANCE[hero.name] || 1.0;

    if (maxLevel > 0) {
      const heroScore = (hero.level / maxLevel) * 100 * importance;
      totalScore += heroScore;
      totalMax += 100 * importance;

      details.push({
        name: hero.name,
        level: hero.level,
        maxLevel: maxLevel,
        percentage: (hero.level / maxLevel) * 100,
        gap: maxLevel - hero.level,
        importance: importance,
      });
    }
  });

  const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

  return {
    score: percentage,
    details: details.sort((a, b) => b.importance - a.importance),
    percentage: percentage,
  };
};

/**
 * Calculer le score des troupes d'un joueur
 * @param {Object} player - Données du joueur
 * @returns {Object} - Score et détails
 */
export const calculateTroopScore = (player) => {
  const th = player.townHallLevel;
  const maxLevel = MAX_TROOP_LEVELS[th] || MAX_TROOP_LEVELS[16];
  const metaTroops = META_TROOPS[th] || META_TROOPS[16];

  if (!player.troops || player.troops.length === 0) {
    return { score: 0, details: [], percentage: 0 };
  }

  let totalScore = 0;
  let totalMax = 0;
  const details = [];

  // Filtrer uniquement les troupes terrestres/aériennes (pas les super troupes ni siège)
  const regularTroops = player.troops.filter(troop => troop.village === 'home');

  regularTroops.forEach(troop => {
    const isMeta = metaTroops.includes(troop.name);
    const importance = isMeta ? 1.5 : 1.0; // Les troupes méta valent plus

    const troopScore = (troop.level / maxLevel) * 100 * importance;
    totalScore += troopScore;
    totalMax += 100 * importance;

    details.push({
      name: troop.name,
      level: troop.level,
      maxLevel: maxLevel,
      percentage: (troop.level / maxLevel) * 100,
      gap: maxLevel - troop.level,
      isMeta: isMeta,
      importance: importance,
    });
  });

  const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

  return {
    score: percentage,
    details: details.sort((a, b) => (b.isMeta ? 1 : 0) - (a.isMeta ? 1 : 0) || b.percentage - a.percentage),
    percentage: percentage,
    metaTroops: details.filter(d => d.isMeta),
  };
};

/**
 * Calculer le score des sorts d'un joueur
 * @param {Object} player - Données du joueur
 * @returns {Object} - Score et détails
 */
export const calculateSpellScore = (player) => {
  const th = player.townHallLevel;
  const maxLevel = MAX_SPELL_LEVELS[th] || MAX_SPELL_LEVELS[16];

  if (!player.spells || player.spells.length === 0) {
    return { score: 0, details: [], percentage: 0 };
  }

  let totalScore = 0;
  let totalMax = 0;
  const details = [];

  player.spells.forEach(spell => {
    const isImportant = IMPORTANT_SPELLS.includes(spell.name);
    const importance = isImportant ? 1.3 : 1.0;

    const spellScore = (spell.level / maxLevel) * 100 * importance;
    totalScore += spellScore;
    totalMax += 100 * importance;

    details.push({
      name: spell.name,
      level: spell.level,
      maxLevel: maxLevel,
      percentage: (spell.level / maxLevel) * 100,
      gap: maxLevel - spell.level,
      isImportant: isImportant,
      importance: importance,
    });
  });

  const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

  return {
    score: percentage,
    details: details.sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0) || b.percentage - a.percentage),
    percentage: percentage,
  };
};

/**
 * Calculer le score de donation d'un joueur
 * @param {Object} player - Données du joueur
 * @returns {Object} - Score et détails
 */
export const calculateDonationScore = (player) => {
  const donations = player.donations || 0;
  const received = player.donationsReceived || 0;

  const ratio = received > 0 ? donations / received : donations > 0 ? 2.0 : 1.0;

  // Score basé sur le ratio (optimal = 1.0)
  let score = 100;
  if (ratio < THRESHOLDS.DONATION_RATIO_LOW) {
    score = ratio * 100; // Pénalité si on reçoit beaucoup plus qu'on donne
  } else if (ratio > THRESHOLDS.DONATION_RATIO_HIGH) {
    score = 100 - ((ratio - THRESHOLDS.DONATION_RATIO_HIGH) * 10); // Légère pénalité si on donne trop
  }

  score = Math.max(0, Math.min(100, score)); // Clamp entre 0 et 100

  return {
    score: score,
    donations: donations,
    received: received,
    ratio: ratio,
    isBalanced: ratio >= THRESHOLDS.DONATION_RATIO_LOW && ratio <= THRESHOLDS.DONATION_RATIO_HIGH,
  };
};

/**
 * Calculer le War Readiness Score global d'un joueur
 * @param {Object} player - Données du joueur
 * @returns {Object} - Score global et détails
 */
export const calculateWarReadinessScore = (player) => {
  const heroScore = calculateHeroScore(player);
  const troopScore = calculateTroopScore(player);
  const spellScore = calculateSpellScore(player);
  const donationScore = calculateDonationScore(player);

  const totalScore =
    heroScore.score * WAR_SCORE_WEIGHTS.HEROES +
    troopScore.score * WAR_SCORE_WEIGHTS.TROOPS +
    spellScore.score * WAR_SCORE_WEIGHTS.SPELLS +
    donationScore.score * WAR_SCORE_WEIGHTS.DONATIONS;

  // Déterminer le niveau
  let level = 'POOR';
  if (totalScore >= THRESHOLDS.WAR_READINESS_EXCELLENT) {
    level = 'EXCELLENT';
  } else if (totalScore >= THRESHOLDS.WAR_READINESS_GOOD) {
    level = 'GOOD';
  } else if (totalScore >= THRESHOLDS.WAR_READINESS_AVERAGE) {
    level = 'AVERAGE';
  }

  // Générer les recommandations
  const recommendations = [];

  if (heroScore.score < 70) {
    recommendations.push({
      type: 'HEROES',
      priority: 'HIGH',
      message: 'Améliorez vos héros en priorité',
      details: heroScore.details.filter(h => h.gap > 0).slice(0, 2),
    });
  }

  if (troopScore.metaTroops.some(t => t.percentage < 80)) {
    recommendations.push({
      type: 'TROOPS',
      priority: 'HIGH',
      message: 'Améliorez vos troupes méta',
      details: troopScore.metaTroops.filter(t => t.percentage < 80).slice(0, 3),
    });
  }

  if (spellScore.score < 70) {
    recommendations.push({
      type: 'SPELLS',
      priority: 'MEDIUM',
      message: 'Améliorez vos sorts importants',
      details: spellScore.details.filter(s => s.isImportant && s.gap > 0).slice(0, 2),
    });
  }

  if (!donationScore.isBalanced) {
    recommendations.push({
      type: 'DONATIONS',
      priority: donationScore.ratio < THRESHOLDS.DONATION_RATIO_LOW ? 'MEDIUM' : 'LOW',
      message: donationScore.ratio < THRESHOLDS.DONATION_RATIO_LOW
        ? 'Augmentez vos donations'
        : 'Vous donnez beaucoup, c\'est bien !',
    });
  }

  return {
    totalScore: Math.round(totalScore),
    level: level,
    breakdown: {
      heroes: {
        score: Math.round(heroScore.score),
        weight: WAR_SCORE_WEIGHTS.HEROES,
        contribution: Math.round(heroScore.score * WAR_SCORE_WEIGHTS.HEROES),
        details: heroScore.details,
      },
      troops: {
        score: Math.round(troopScore.score),
        weight: WAR_SCORE_WEIGHTS.TROOPS,
        contribution: Math.round(troopScore.score * WAR_SCORE_WEIGHTS.TROOPS),
        details: troopScore.details,
        metaTroops: troopScore.metaTroops,
      },
      spells: {
        score: Math.round(spellScore.score),
        weight: WAR_SCORE_WEIGHTS.SPELLS,
        contribution: Math.round(spellScore.score * WAR_SCORE_WEIGHTS.SPELLS),
        details: spellScore.details,
      },
      donations: {
        score: Math.round(donationScore.score),
        weight: WAR_SCORE_WEIGHTS.DONATIONS,
        contribution: Math.round(donationScore.score * WAR_SCORE_WEIGHTS.DONATIONS),
        ratio: donationScore.ratio,
        isBalanced: donationScore.isBalanced,
      },
    },
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
  };
};

export default {
  calculateHeroScore,
  calculateTroopScore,
  calculateSpellScore,
  calculateDonationScore,
  calculateWarReadinessScore,
};
