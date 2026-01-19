import { useState, useEffect, useCallback } from 'react';
import { getClanCapitalRaidSeasons } from '../services/clashOfClansApi';
import { saveCapitalSeason, getCapitalHistory } from '../services/storageService';

/**
 * Hook pour récupérer et gérer les données du capital d'un clan
 * @param {string} clanTag - Tag du clan
 * @param {number} limit - Nombre de saisons à récupérer
 * @param {boolean} autoRefresh - Rafraîchir automatiquement les données
 * @param {number} refreshInterval - Intervalle de rafraîchissement en ms
 */
export const useCapital = (clanTag, limit = 10, autoRefresh = false, refreshInterval = 300000) => {
  const [seasons, setSeasons] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCapital = useCallback(async () => {
    if (!clanTag) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getClanCapitalRaidSeasons(clanTag, limit);
      setSeasons(data.items);

      // Sauvegarder les saisons terminées
      if (data.items && data.items.length > 0) {
        data.items.forEach(season => {
          if (season.state === 'ended') {
            saveCapitalSeason(clanTag, season);
          }
        });
      }

      // Récupérer l'historique local
      const localHistory = getCapitalHistory(clanTag, limit);
      setHistory(localHistory);

      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération du capital');
      console.error('Erreur useCapital:', err);
    } finally {
      setLoading(false);
    }
  }, [clanTag, limit]);

  useEffect(() => {
    fetchCapital();
  }, [fetchCapital]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !clanTag) return;

    const interval = setInterval(() => {
      fetchCapital();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, clanTag, fetchCapital]);

  return {
    seasons,
    history,
    loading,
    error,
    refresh: fetchCapital,
  };
};

export default useCapital;
