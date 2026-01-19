import { useState, useEffect, useCallback } from 'react';
import { getPlayer } from '../services/clashOfClansApi';
import { addPlayerSnapshot, getPlayerEvolution } from '../services/storageService';

/**
 * Hook pour récupérer et gérer les données d'un joueur
 * @param {string} playerTag - Tag du joueur
 * @param {boolean} autoRefresh - Rafraîchir automatiquement les données
 * @param {number} refreshInterval - Intervalle de rafraîchissement en ms
 */
export const usePlayer = (playerTag, autoRefresh = false, refreshInterval = 300000) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evolution, setEvolution] = useState(null);

  const fetchPlayer = useCallback(async () => {
    if (!playerTag) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPlayer(playerTag);
      setPlayer(data);

      // Sauvegarder un snapshot pour l'historique
      addPlayerSnapshot(playerTag, data);

      // Calculer l'évolution
      const evo = getPlayerEvolution(playerTag, 7);
      setEvolution(evo);

      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération du joueur');
      console.error('Erreur usePlayer:', err);
    } finally {
      setLoading(false);
    }
  }, [playerTag]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !playerTag) return;

    const interval = setInterval(() => {
      fetchPlayer();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, playerTag, fetchPlayer]);

  return {
    player,
    loading,
    error,
    evolution,
    refresh: fetchPlayer,
  };
};

export default usePlayer;
