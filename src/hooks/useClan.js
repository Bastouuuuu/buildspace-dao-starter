import { useState, useEffect, useCallback } from 'react';
import { getClan, getClanMembers } from '../services/clashOfClansApi';
import { addClanSnapshot } from '../services/storageService';

/**
 * Hook pour récupérer et gérer les données d'un clan
 * @param {string} clanTag - Tag du clan
 * @param {boolean} includeMembers - Inclure la liste des membres
 * @param {boolean} autoRefresh - Rafraîchir automatiquement les données
 * @param {number} refreshInterval - Intervalle de rafraîchissement en ms
 */
export const useClan = (clanTag, includeMembers = false, autoRefresh = false, refreshInterval = 300000) => {
  const [clan, setClan] = useState(null);
  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClan = useCallback(async () => {
    if (!clanTag) return;

    setLoading(true);
    setError(null);

    try {
      const clanData = await getClan(clanTag);
      setClan(clanData);

      // Sauvegarder un snapshot pour l'historique
      addClanSnapshot(clanTag, clanData);

      // Récupérer les membres si demandé
      if (includeMembers && clanData.memberList) {
        setMembers(clanData.memberList);
      }

      return clanData;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération du clan');
      console.error('Erreur useClan:', err);
    } finally {
      setLoading(false);
    }
  }, [clanTag, includeMembers]);

  useEffect(() => {
    fetchClan();
  }, [fetchClan]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !clanTag) return;

    const interval = setInterval(() => {
      fetchClan();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, clanTag, fetchClan]);

  return {
    clan,
    members,
    loading,
    error,
    refresh: fetchClan,
  };
};

export default useClan;
