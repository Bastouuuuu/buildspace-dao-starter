import axios from 'axios';

// Configuration de l'API Clash of Clans
const API_BASE_URL = 'https://api.clashofclans.com/v1';

// Créer une instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  }
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  const token = process.env.REACT_APP_COC_API_TOKEN || localStorage.getItem('coc_api_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Encoder les tags (remplacer # par %23)
const encodeTag = (tag) => {
  return tag.startsWith('#') ? encodeURIComponent(tag) : encodeURIComponent(`#${tag}`);
};

// ============================================
// PLAYER API
// ============================================

/**
 * Récupérer les informations d'un joueur
 * @param {string} playerTag - Tag du joueur (avec ou sans #)
 * @returns {Promise} - Données du joueur
 */
export const getPlayer = async (playerTag) => {
  try {
    const encodedTag = encodeTag(playerTag);
    const response = await apiClient.get(`/players/${encodedTag}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du joueur:', error);
    throw error;
  }
};

/**
 * Vérifier la propriété d'un compte joueur
 * @param {string} playerTag - Tag du joueur
 * @param {string} token - Token de vérification du joueur
 * @returns {Promise} - Résultat de la vérification
 */
export const verifyPlayerToken = async (playerTag, token) => {
  try {
    const encodedTag = encodeTag(playerTag);
    const response = await apiClient.post(`/players/${encodedTag}/verifytoken`, { token });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    throw error;
  }
};

// ============================================
// CLAN API
// ============================================

/**
 * Récupérer les informations d'un clan
 * @param {string} clanTag - Tag du clan
 * @returns {Promise} - Données du clan
 */
export const getClan = async (clanTag) => {
  try {
    const encodedTag = encodeTag(clanTag);
    const response = await apiClient.get(`/clans/${encodedTag}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du clan:', error);
    throw error;
  }
};

/**
 * Récupérer les membres d'un clan
 * @param {string} clanTag - Tag du clan
 * @returns {Promise} - Liste des membres
 */
export const getClanMembers = async (clanTag) => {
  try {
    const encodedTag = encodeTag(clanTag);
    const response = await apiClient.get(`/clans/${encodedTag}/members`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    throw error;
  }
};

/**
 * Récupérer le war log d'un clan
 * @param {string} clanTag - Tag du clan
 * @returns {Promise} - Historique des guerres
 */
export const getClanWarLog = async (clanTag) => {
  try {
    const encodedTag = encodeTag(clanTag);
    const response = await apiClient.get(`/clans/${encodedTag}/warlog`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du war log:', error);
    throw error;
  }
};

/**
 * Récupérer la guerre actuelle d'un clan
 * @param {string} clanTag - Tag du clan
 * @returns {Promise} - Données de la guerre actuelle
 */
export const getCurrentWar = async (clanTag) => {
  try {
    const encodedTag = encodeTag(clanTag);
    const response = await apiClient.get(`/clans/${encodedTag}/currentwar`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la guerre actuelle:', error);
    throw error;
  }
};

/**
 * Récupérer le groupe CWL d'un clan
 * @param {string} clanTag - Tag du clan
 * @returns {Promise} - Données du groupe CWL
 */
export const getClanWarLeagueGroup = async (clanTag) => {
  try {
    const encodedTag = encodeTag(clanTag);
    const response = await apiClient.get(`/clans/${encodedTag}/currentwar/leaguegroup`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du groupe CWL:', error);
    throw error;
  }
};

/**
 * Récupérer une guerre CWL spécifique
 * @param {string} warTag - Tag de la guerre
 * @returns {Promise} - Données de la guerre CWL
 */
export const getClanWarLeagueWar = async (warTag) => {
  try {
    const encodedTag = encodeTag(warTag);
    const response = await apiClient.get(`/clanwarleagues/wars/${encodedTag}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la guerre CWL:', error);
    throw error;
  }
};

/**
 * Récupérer les raids du capital d'un clan
 * @param {string} clanTag - Tag du clan
 * @returns {Promise} - Données des raids du capital
 */
export const getClanCapitalRaidSeasons = async (clanTag, limit = 10) => {
  try {
    const encodedTag = encodeTag(clanTag);
    const response = await apiClient.get(`/clans/${encodedTag}/capitalraidseasons`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des raids du capital:', error);
    throw error;
  }
};

// ============================================
// LOCATIONS & RANKINGS API
// ============================================

/**
 * Récupérer la liste des localisations
 * @returns {Promise} - Liste des localisations
 */
export const getLocations = async () => {
  try {
    const response = await apiClient.get('/locations');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des localisations:', error);
    throw error;
  }
};

/**
 * Récupérer le classement des clans par localisation
 * @param {string} locationId - ID de la localisation
 * @param {number} limit - Nombre de résultats
 * @returns {Promise} - Classement des clans
 */
export const getClanRankings = async (locationId = 'global', limit = 50) => {
  try {
    const response = await apiClient.get(`/locations/${locationId}/rankings/clans`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du classement des clans:', error);
    throw error;
  }
};

/**
 * Récupérer le classement des joueurs par localisation
 * @param {string} locationId - ID de la localisation
 * @param {number} limit - Nombre de résultats
 * @returns {Promise} - Classement des joueurs
 */
export const getPlayerRankings = async (locationId = 'global', limit = 50) => {
  try {
    const response = await apiClient.get(`/locations/${locationId}/rankings/players`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du classement des joueurs:', error);
    throw error;
  }
};

// ============================================
// LEAGUES API
// ============================================

/**
 * Récupérer la liste des ligues
 * @returns {Promise} - Liste des ligues
 */
export const getLeagues = async () => {
  try {
    const response = await apiClient.get('/leagues');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des ligues:', error);
    throw error;
  }
};

/**
 * Récupérer les informations d'une ligue
 * @param {string} leagueId - ID de la ligue
 * @returns {Promise} - Données de la ligue
 */
export const getLeague = async (leagueId) => {
  try {
    const response = await apiClient.get(`/leagues/${leagueId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la ligue:', error);
    throw error;
  }
};

/**
 * Récupérer les saisons d'une ligue
 * @param {string} leagueId - ID de la ligue
 * @returns {Promise} - Saisons de la ligue
 */
export const getLeagueSeasons = async (leagueId) => {
  try {
    const response = await apiClient.get(`/leagues/${leagueId}/seasons`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des saisons:', error);
    throw error;
  }
};

export default {
  // Player
  getPlayer,
  verifyPlayerToken,

  // Clan
  getClan,
  getClanMembers,
  getClanWarLog,
  getCurrentWar,
  getClanWarLeagueGroup,
  getClanWarLeagueWar,
  getClanCapitalRaidSeasons,

  // Rankings
  getLocations,
  getClanRankings,
  getPlayerRankings,

  // Leagues
  getLeagues,
  getLeague,
  getLeagueSeasons,
};
