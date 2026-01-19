import { useState, useEffect, useCallback } from 'react';
import { getCurrentWar, getClanWarLog } from '../services/clashOfClansApi';
import { saveWarResult, getWarHistory, getWarStats } from '../services/storageService';

/**
 * Hook pour récupérer et gérer les données de guerre d'un clan
 * @param {string} clanTag - Tag du clan
 * @param {boolean} includeHistory - Inclure l'historique des guerres
 * @param {boolean} autoRefresh - Rafraîchir automatiquement les données
 * @param {number} refreshInterval - Intervalle de rafraîchissement en ms
 */
export const useWar = (clanTag, includeHistory = false, autoRefresh = false, refreshInterval = 300000) => {
  const [currentWar, setCurrentWar] = useState(null);
  const [warLog, setWarLog] = useState(null);
  const [warHistory, setWarHistory] = useState(null);
  const [warStats, setWarStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWar = useCallback(async () => {
    if (!clanTag) return;

    setLoading(true);
    setError(null);

    try {
      // Récupérer la guerre actuelle
      const currentWarData = await getCurrentWar(clanTag);
      setCurrentWar(currentWarData);

      // Si la guerre est terminée, la sauvegarder
      if (currentWarData.state === 'warEnded') {
        saveWarResult(clanTag, currentWarData);
      }

      // Récupérer l'historique si demandé
      if (includeHistory) {
        try {
          const logData = await getClanWarLog(clanTag);
          setWarLog(logData);
        } catch (err) {
          console.warn('War log non accessible:', err);
        }

        // Récupérer l'historique local
        const history = getWarHistory(clanTag, 20);
        setWarHistory(history);

        // Calculer les statistiques
        const stats = getWarStats(clanTag);
        setWarStats(stats);
      }

      return currentWarData;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération de la guerre');
      console.error('Erreur useWar:', err);
    } finally {
      setLoading(false);
    }
  }, [clanTag, includeHistory]);

  useEffect(() => {
    fetchWar();
  }, [fetchWar]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !clanTag) return;

    const interval = setInterval(() => {
      fetchWar();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, clanTag, fetchWar]);

  return {
    currentWar,
    warLog,
    warHistory,
    warStats,
    loading,
    error,
    refresh: fetchWar,
  };
};

export default useWar;
