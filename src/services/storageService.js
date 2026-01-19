/**
 * Service de stockage local pour historiser les données Clash of Clans
 * Permet de suivre l'évolution des statistiques dans le temps
 */

const STORAGE_KEYS = {
  PLAYER_HISTORY: 'coc_player_history',
  CLAN_HISTORY: 'coc_clan_history',
  WAR_HISTORY: 'coc_war_history',
  CAPITAL_HISTORY: 'coc_capital_history',
  SETTINGS: 'coc_settings',
  API_TOKEN: 'coc_api_token',
};

// ============================================
// UTILITIES
// ============================================

/**
 * Récupérer une valeur du localStorage
 */
const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${key}:`, error);
    return null;
  }
};

/**
 * Sauvegarder une valeur dans le localStorage
 */
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    return false;
  }
};

/**
 * Supprimer une valeur du localStorage
 */
const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key}:`, error);
    return false;
  }
};

// ============================================
// PLAYER HISTORY
// ============================================

/**
 * Ajouter un snapshot des données d'un joueur
 */
export const addPlayerSnapshot = (playerTag, playerData) => {
  const history = getFromStorage(STORAGE_KEYS.PLAYER_HISTORY) || {};

  if (!history[playerTag]) {
    history[playerTag] = [];
  }

  const snapshot = {
    timestamp: Date.now(),
    trophies: playerData.trophies,
    bestTrophies: playerData.bestTrophies,
    warStars: playerData.warStars,
    attackWins: playerData.attackWins,
    defenseWins: playerData.defenseWins,
    donations: playerData.donations,
    donationsReceived: playerData.donationsReceived,
    townHallLevel: playerData.townHallLevel,
    builderHallLevel: playerData.builderHallLevel,
    expLevel: playerData.expLevel,
  };

  history[playerTag].push(snapshot);

  // Garder seulement les 100 derniers snapshots
  if (history[playerTag].length > 100) {
    history[playerTag] = history[playerTag].slice(-100);
  }

  saveToStorage(STORAGE_KEYS.PLAYER_HISTORY, history);
  return snapshot;
};

/**
 * Récupérer l'historique d'un joueur
 */
export const getPlayerHistory = (playerTag, days = 30) => {
  const history = getFromStorage(STORAGE_KEYS.PLAYER_HISTORY) || {};

  if (!history[playerTag]) {
    return [];
  }

  const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
  return history[playerTag].filter(snapshot => snapshot.timestamp >= cutoffDate);
};

/**
 * Calculer les statistiques d'évolution d'un joueur
 */
export const getPlayerEvolution = (playerTag, days = 7) => {
  const history = getPlayerHistory(playerTag, days);

  if (history.length < 2) {
    return null;
  }

  const oldest = history[0];
  const latest = history[history.length - 1];

  return {
    trophies: latest.trophies - oldest.trophies,
    warStars: latest.warStars - oldest.warStars,
    attackWins: latest.attackWins - oldest.attackWins,
    defenseWins: latest.defenseWins - oldest.defenseWins,
    donations: latest.donations - oldest.donations,
    donationsReceived: latest.donationsReceived - oldest.donationsReceived,
    period: days,
    snapshots: history.length,
  };
};

// ============================================
// CLAN HISTORY
// ============================================

/**
 * Ajouter un snapshot des données d'un clan
 */
export const addClanSnapshot = (clanTag, clanData) => {
  const history = getFromStorage(STORAGE_KEYS.CLAN_HISTORY) || {};

  if (!history[clanTag]) {
    history[clanTag] = [];
  }

  const snapshot = {
    timestamp: Date.now(),
    clanLevel: clanData.clanLevel,
    clanPoints: clanData.clanPoints,
    clanVersusPoints: clanData.clanVersusPoints,
    members: clanData.members,
    warWins: clanData.warWins,
    warLosses: clanData.warLosses,
    warTies: clanData.warTies,
    warWinStreak: clanData.warWinStreak,
    capitalLeague: clanData.capitalLeague?.name,
  };

  history[clanTag].push(snapshot);

  // Garder seulement les 100 derniers snapshots
  if (history[clanTag].length > 100) {
    history[clanTag] = history[clanTag].slice(-100);
  }

  saveToStorage(STORAGE_KEYS.CLAN_HISTORY, history);
  return snapshot;
};

/**
 * Récupérer l'historique d'un clan
 */
export const getClanHistory = (clanTag, days = 30) => {
  const history = getFromStorage(STORAGE_KEYS.CLAN_HISTORY) || {};

  if (!history[clanTag]) {
    return [];
  }

  const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
  return history[clanTag].filter(snapshot => snapshot.timestamp >= cutoffDate);
};

// ============================================
// WAR HISTORY
// ============================================

/**
 * Sauvegarder une guerre terminée
 */
export const saveWarResult = (clanTag, warData) => {
  const history = getFromStorage(STORAGE_KEYS.WAR_HISTORY) || {};

  if (!history[clanTag]) {
    history[clanTag] = [];
  }

  const warResult = {
    timestamp: Date.now(),
    endTime: warData.endTime,
    result: warData.result,
    teamSize: warData.teamSize,
    attacksPerMember: warData.attacksPerMember,
    clan: {
      tag: warData.clan.tag,
      name: warData.clan.name,
      stars: warData.clan.stars,
      destructionPercentage: warData.clan.destructionPercentage,
      attacks: warData.clan.attacks,
    },
    opponent: {
      tag: warData.opponent.tag,
      name: warData.opponent.name,
      stars: warData.opponent.stars,
      destructionPercentage: warData.opponent.destructionPercentage,
    },
  };

  history[clanTag].push(warResult);

  // Garder seulement les 50 dernières guerres
  if (history[clanTag].length > 50) {
    history[clanTag] = history[clanTag].slice(-50);
  }

  saveToStorage(STORAGE_KEYS.WAR_HISTORY, history);
  return warResult;
};

/**
 * Récupérer l'historique des guerres d'un clan
 */
export const getWarHistory = (clanTag, limit = 10) => {
  const history = getFromStorage(STORAGE_KEYS.WAR_HISTORY) || {};

  if (!history[clanTag]) {
    return [];
  }

  return history[clanTag].slice(-limit).reverse();
};

/**
 * Calculer les statistiques de guerre d'un clan
 */
export const getWarStats = (clanTag) => {
  const wars = getWarHistory(clanTag, 50);

  if (wars.length === 0) {
    return null;
  }

  const stats = {
    total: wars.length,
    wins: wars.filter(w => w.result === 'win').length,
    losses: wars.filter(w => w.result === 'lose').length,
    ties: wars.filter(w => w.result === 'tie').length,
    avgStars: wars.reduce((sum, w) => sum + w.clan.stars, 0) / wars.length,
    avgDestruction: wars.reduce((sum, w) => sum + w.clan.destructionPercentage, 0) / wars.length,
  };

  stats.winRate = (stats.wins / stats.total) * 100;

  return stats;
};

// ============================================
// CAPITAL HISTORY
// ============================================

/**
 * Sauvegarder une saison de capital
 */
export const saveCapitalSeason = (clanTag, seasonData) => {
  const history = getFromStorage(STORAGE_KEYS.CAPITAL_HISTORY) || {};

  if (!history[clanTag]) {
    history[clanTag] = [];
  }

  const season = {
    timestamp: Date.now(),
    state: seasonData.state,
    startTime: seasonData.startTime,
    endTime: seasonData.endTime,
    capitalTotalLoot: seasonData.capitalTotalLoot,
    raidsCompleted: seasonData.raidsCompleted,
    totalAttacks: seasonData.totalAttacks,
    enemyDistrictsDestroyed: seasonData.enemyDistrictsDestroyed,
    defensiveReward: seasonData.defensiveReward,
  };

  history[clanTag].push(season);

  // Garder seulement les 20 dernières saisons
  if (history[clanTag].length > 20) {
    history[clanTag] = history[clanTag].slice(-20);
  }

  saveToStorage(STORAGE_KEYS.CAPITAL_HISTORY, history);
  return season;
};

/**
 * Récupérer l'historique des saisons de capital
 */
export const getCapitalHistory = (clanTag, limit = 10) => {
  const history = getFromStorage(STORAGE_KEYS.CAPITAL_HISTORY) || {};

  if (!history[clanTag]) {
    return [];
  }

  return history[clanTag].slice(-limit).reverse();
};

// ============================================
// SETTINGS
// ============================================

/**
 * Sauvegarder les paramètres de l'application
 */
export const saveSettings = (settings) => {
  return saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Récupérer les paramètres de l'application
 */
export const getSettings = () => {
  return getFromStorage(STORAGE_KEYS.SETTINGS) || {
    favoritePlayerTag: null,
    favoriteClanTag: null,
    theme: 'dark',
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
  };
};

/**
 * Sauvegarder le token API
 */
export const saveApiToken = (token) => {
  return saveToStorage(STORAGE_KEYS.API_TOKEN, token);
};

/**
 * Récupérer le token API
 */
export const getApiToken = () => {
  return getFromStorage(STORAGE_KEYS.API_TOKEN);
};

/**
 * Supprimer toutes les données
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
  return true;
};

export default {
  // Player
  addPlayerSnapshot,
  getPlayerHistory,
  getPlayerEvolution,

  // Clan
  addClanSnapshot,
  getClanHistory,

  // Wars
  saveWarResult,
  getWarHistory,
  getWarStats,

  // Capital
  saveCapitalSeason,
  getCapitalHistory,

  // Settings
  saveSettings,
  getSettings,
  saveApiToken,
  getApiToken,
  clearAllData,
};
