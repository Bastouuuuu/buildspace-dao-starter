// Niveaux maximum de Town Hall
export const MAX_TOWN_HALL_LEVEL = 16;

// Niveaux maximum des héros par Town Hall
export const MAX_HERO_LEVELS = {
  1: { 'Barbarian King': 0, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  2: { 'Barbarian King': 0, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  3: { 'Barbarian King': 0, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  4: { 'Barbarian King': 0, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  5: { 'Barbarian King': 0, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  6: { 'Barbarian King': 0, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  7: { 'Barbarian King': 5, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  8: { 'Barbarian King': 10, 'Archer Queen': 0, 'Grand Warden': 0, 'Royal Champion': 0 },
  9: { 'Barbarian King': 30, 'Archer Queen': 30, 'Grand Warden': 0, 'Royal Champion': 0 },
  10: { 'Barbarian King': 40, 'Archer Queen': 40, 'Grand Warden': 0, 'Royal Champion': 0 },
  11: { 'Barbarian King': 50, 'Archer Queen': 50, 'Grand Warden': 20, 'Royal Champion': 0 },
  12: { 'Barbarian King': 65, 'Archer Queen': 65, 'Grand Warden': 40, 'Royal Champion': 0 },
  13: { 'Barbarian King': 75, 'Archer Queen': 75, 'Grand Warden': 50, 'Royal Champion': 25 },
  14: { 'Barbarian King': 80, 'Archer Queen': 80, 'Grand Warden': 55, 'Royal Champion': 30 },
  15: { 'Barbarian King': 90, 'Archer Queen': 90, 'Grand Warden': 65, 'Royal Champion': 40 },
  16: { 'Barbarian King': 95, 'Archer Queen': 95, 'Grand Warden': 70, 'Royal Champion': 45 },
};

// Niveaux maximum des troupes par Town Hall (simplifié - à compléter selon besoins)
export const MAX_TROOP_LEVELS = {
  7: 4,
  8: 5,
  9: 6,
  10: 7,
  11: 8,
  12: 9,
  13: 10,
  14: 11,
  15: 11,
  16: 12,
};

// Niveaux maximum des sorts par Town Hall
export const MAX_SPELL_LEVELS = {
  7: 4,
  8: 5,
  9: 6,
  10: 7,
  11: 8,
  12: 9,
  13: 10,
  14: 11,
  15: 11,
  16: 12,
};

// Troupes considérées comme "méta" pour différents TH
export const META_TROOPS = {
  9: ['Dragon', 'Witch', 'Hog Rider', 'Golem', 'P.E.K.K.A'],
  10: ['Bowler', 'Miner', 'Valkyrie', 'Hog Rider', 'Golem'],
  11: ['Electro Dragon', 'Bowler', 'Miner', 'Hog Rider', 'Golem'],
  12: ['Yeti', 'Electro Dragon', 'Bowler', 'Miner', 'Hog Rider'],
  13: ['Super Wizard', 'Yeti', 'Electro Dragon', 'Hog Rider', 'Golem'],
  14: ['Headhunter', 'Super Wizard', 'Yeti', 'Electro Dragon', 'Hog Rider'],
  15: ['Headhunter', 'Super Wizard', 'Yeti', 'Electro Dragon', 'Hog Rider'],
  16: ['Headhunter', 'Super Wizard', 'Yeti', 'Electro Dragon', 'Hog Rider'],
};

// Sorts considérés comme importants
export const IMPORTANT_SPELLS = [
  'Healing Spell',
  'Rage Spell',
  'Freeze Spell',
  'Clone Spell',
  'Invisibility Spell',
  'Poison Spell',
  'Earthquake Spell',
  'Haste Spell',
  'Skeleton Spell',
  'Bat Spell',
  'Recall Spell'
];

// Héros et leur importance
export const HERO_IMPORTANCE = {
  'Barbarian King': 1.0,
  'Archer Queen': 1.2,
  'Grand Warden': 1.1,
  'Royal Champion': 1.15,
};

// Ligues et leurs icônes/couleurs
export const LEAGUES = {
  'Unranked': { color: '#999999', icon: '⚪' },
  'Bronze League III': { color: '#CD7F32', icon: '🥉' },
  'Bronze League II': { color: '#CD7F32', icon: '🥉' },
  'Bronze League I': { color: '#CD7F32', icon: '🥉' },
  'Silver League III': { color: '#C0C0C0', icon: '🥈' },
  'Silver League II': { color: '#C0C0C0', icon: '🥈' },
  'Silver League I': { color: '#C0C0C0', icon: '🥈' },
  'Gold League III': { color: '#FFD700', icon: '🥇' },
  'Gold League II': { color: '#FFD700', icon: '🥇' },
  'Gold League I': { color: '#FFD700', icon: '🥇' },
  'Crystal League III': { color: '#4FC3F7', icon: '💎' },
  'Crystal League II': { color: '#4FC3F7', icon: '💎' },
  'Crystal League I': { color: '#4FC3F7', icon: '💎' },
  'Master League III': { color: '#E040FB', icon: '👑' },
  'Master League II': { color: '#E040FB', icon: '👑' },
  'Master League I': { color: '#E040FB', icon: '👑' },
  'Champion League III': { color: '#FF5252', icon: '🏆' },
  'Champion League II': { color: '#FF5252', icon: '🏆' },
  'Champion League I': { color: '#FF5252', icon: '🏆' },
  'Titan League III': { color: '#00E676', icon: '⭐' },
  'Titan League II': { color: '#00E676', icon: '⭐' },
  'Titan League I': { color: '#00E676', icon: '⭐' },
  'Legend League': { color: '#FFFFFF', icon: '🌟' },
};

// Rôles dans le clan
export const CLAN_ROLES = {
  'member': { name: 'Membre', icon: '👤', priority: 1 },
  'admin': { name: 'Aîné', icon: '⭐', priority: 2 },
  'coLeader': { name: 'Chef adjoint', icon: '👑', priority: 3 },
  'leader': { name: 'Chef', icon: '👑', priority: 4 },
};

// Seuils pour les alertes et scores
export const THRESHOLDS = {
  // Ratio donations (reçu/donné)
  DONATION_RATIO_LOW: 0.5, // Alerte si on reçoit beaucoup plus qu'on donne
  DONATION_RATIO_HIGH: 2.0, // Alerte si on donne beaucoup plus qu'on reçoit

  // War readiness score (0-100)
  WAR_READINESS_EXCELLENT: 85,
  WAR_READINESS_GOOD: 70,
  WAR_READINESS_AVERAGE: 50,
  WAR_READINESS_POOR: 30,

  // Écart héros (pourcentage du max)
  HERO_LAG_WARNING: 0.7, // Alerte si héros < 70% du max
  HERO_LAG_CRITICAL: 0.5, // Critique si héros < 50% du max

  // Inactivité (jours)
  INACTIVITY_WARNING: 7,
  INACTIVITY_CRITICAL: 14,

  // Taux de 3 étoiles en guerre
  THREE_STAR_RATE_EXCELLENT: 0.8,
  THREE_STAR_RATE_GOOD: 0.6,
  THREE_STAR_RATE_AVERAGE: 0.4,
};

// Poids des critères pour le War Readiness Score
export const WAR_SCORE_WEIGHTS = {
  HEROES: 0.4, // 40% du score
  TROOPS: 0.3, // 30% du score
  SPELLS: 0.2, // 20% du score
  DONATIONS: 0.1, // 10% du score
};

// Messages d'alerte
export const ALERT_MESSAGES = {
  LOW_DONATION_RATIO: "Vous recevez beaucoup plus que vous ne donnez",
  HIGH_DONATION_RATIO: "Vous donnez beaucoup plus que vous ne recevez",
  HEROES_LAG: "Vos héros sont en retard par rapport à votre TH",
  TROOPS_LAG: "Vos troupes principales ne sont pas au niveau max",
  SPELLS_LAG: "Vos sorts importants ne sont pas au niveau max",
  INACTIVE: "Aucune activité détectée récemment",
  TH_RUSHED: "Votre Town Hall est trop avancé par rapport à vos défenses",
};

// Couleurs pour les scores et statuts
export const STATUS_COLORS = {
  EXCELLENT: '#4CAF50',
  GOOD: '#8BC34A',
  AVERAGE: '#FFC107',
  POOR: '#FF9800',
  CRITICAL: '#F44336',
};

export default {
  MAX_TOWN_HALL_LEVEL,
  MAX_HERO_LEVELS,
  MAX_TROOP_LEVELS,
  MAX_SPELL_LEVELS,
  META_TROOPS,
  IMPORTANT_SPELLS,
  HERO_IMPORTANCE,
  LEAGUES,
  CLAN_ROLES,
  THRESHOLDS,
  WAR_SCORE_WEIGHTS,
  ALERT_MESSAGES,
  STATUS_COLORS,
};
