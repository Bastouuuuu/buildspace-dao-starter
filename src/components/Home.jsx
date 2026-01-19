import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSettings } from '../services/storageService';

const Home = () => {
  const navigate = useNavigate();
  const settings = getSettings();

  const [playerTag, setPlayerTag] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [apiToken, setApiToken] = useState('');

  const handlePlayerSearch = (e) => {
    e.preventDefault();
    if (playerTag.trim()) {
      const cleanTag = playerTag.trim().replace('#', '');
      navigate(`/player/${cleanTag}`);
    }
  };

  const handleClanSearch = (e) => {
    e.preventDefault();
    if (clanTag.trim()) {
      const cleanTag = clanTag.trim().replace('#', '');
      navigate(`/clan/${cleanTag}`);
    }
  };

  const handleSaveApiToken = () => {
    if (apiToken.trim()) {
      localStorage.setItem('coc_api_token', apiToken.trim());
      alert('Token API sauvegardé avec succès!');
    }
  };

  const goToFavoritePlayer = () => {
    if (settings.favoritePlayerTag) {
      navigate(`/player/${settings.favoritePlayerTag.replace('#', '')}`);
    }
  };

  const goToFavoriteClan = () => {
    if (settings.favoriteClanTag) {
      navigate(`/clan/${settings.favoriteClanTag.replace('#', '')}`);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Clash of Clans Dashboard</h1>
        <p className="subtitle">Analysez vos performances et celles de votre clan</p>
      </div>

      <div className="search-section">
        <div className="card search-card">
          <h2>Rechercher un Joueur</h2>
          <form onSubmit={handlePlayerSearch}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Tag du joueur (#ABC123...)"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                className="tag-input"
              />
              <button type="submit" className="search-button">
                Rechercher
              </button>
            </div>
          </form>
          {settings.favoritePlayerTag && (
            <button onClick={goToFavoritePlayer} className="favorite-button">
              Mon joueur favori ({settings.favoritePlayerTag})
            </button>
          )}
        </div>

        <div className="card search-card">
          <h2>Rechercher un Clan</h2>
          <form onSubmit={handleClanSearch}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Tag du clan (#ABC123...)"
                value={clanTag}
                onChange={(e) => setClanTag(e.target.value)}
                className="tag-input"
              />
              <button type="submit" className="search-button">
                Rechercher
              </button>
            </div>
          </form>
          {settings.favoriteClanTag && (
            <button onClick={goToFavoriteClan} className="favorite-button">
              Mon clan favori ({settings.favoriteClanTag})
            </button>
          )}
        </div>
      </div>

      <div className="card api-token-card">
        <h2>Configuration API</h2>
        <p className="help-text">
          Vous devez configurer votre token API Clash of Clans pour utiliser l'application.
          <br />
          Obtenez votre token sur:{' '}
          <a href="https://developer.clashofclans.com" target="_blank" rel="noopener noreferrer">
            developer.clashofclans.com
          </a>
        </p>
        <div className="input-group">
          <input
            type="password"
            placeholder="Token API Clash of Clans"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            className="tag-input"
          />
          <button onClick={handleSaveApiToken} className="save-button">
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2>Fonctionnalités</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Dashboard Joueur</h3>
            <ul>
              <li>Vue résumé du profil</li>
              <li>Tech Tree (troupes, sorts, héros)</li>
              <li>War Readiness Score</li>
              <li>Alertes et recommandations</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Dashboard Clan</h3>
            <ul>
              <li>Santé du clan</li>
              <li>War Room (guerres en cours)</li>
              <li>CWL Cockpit</li>
              <li>Capital Raids</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analyses</h3>
            <ul>
              <li>Historique des performances</li>
              <li>Statistiques de guerre</li>
              <li>Classements</li>
              <li>Évolution dans le temps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
