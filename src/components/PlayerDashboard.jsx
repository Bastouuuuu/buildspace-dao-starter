import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePlayer from '../hooks/usePlayer';
import { calculateWarReadinessScore } from '../utils/warReadinessCalculator';
import { LEAGUES, CLAN_ROLES, STATUS_COLORS } from '../services/cocConstants';
import { getSettings, saveSettings } from '../services/storageService';

const PlayerDashboard = () => {
  const { playerTag } = useParams();
  const navigate = useNavigate();
  const { player, loading, error, evolution, refresh } = usePlayer(`#${playerTag}`, false);
  const [warScore, setWarScore] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (player) {
      const score = calculateWarReadinessScore(player);
      setWarScore(score);
    }
  }, [player]);

  const handleSetFavorite = () => {
    const settings = getSettings();
    settings.favoritePlayerTag = `#${playerTag}`;
    saveSettings(settings);
    alert('Joueur défini comme favori!');
  };

  const goToClan = () => {
    if (player && player.clan) {
      const clanTag = player.clan.tag.replace('#', '');
      navigate(`/clan/${clanTag}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement des données du joueur...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  if (!player) {
    return null;
  }

  const league = LEAGUES[player.league?.name] || LEAGUES['Unranked'];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Retour
        </button>
        <div className="header-actions">
          <button onClick={handleSetFavorite} className="favorite-button">
            ⭐ Définir comme favori
          </button>
          <button onClick={refresh} className="refresh-button">
            🔄 Rafraîchir
          </button>
        </div>
      </div>

      {/* Player Profile Card */}
      <div className="card player-profile-card">
        <div className="profile-header">
          <div className="profile-main">
            <h1>{player.name}</h1>
            <p className="player-tag">{player.tag}</p>
            <div className="profile-badges">
              <span className="badge badge-th">TH {player.townHallLevel}</span>
              {player.builderHallLevel && (
                <span className="badge badge-bh">BH {player.builderHallLevel}</span>
              )}
              <span className="badge badge-xp">Niveau {player.expLevel}</span>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Trophées</span>
              <span className="stat-value">{player.trophies}</span>
              <span className="stat-secondary">Best: {player.bestTrophies}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ligue</span>
              <span className="stat-value" style={{ color: league.color }}>
                {league.icon} {player.league?.name || 'Unranked'}
              </span>
            </div>
          </div>
        </div>

        {/* Clan Info */}
        {player.clan && (
          <div className="clan-info">
            <h3>Clan</h3>
            <div className="clan-details">
              <button onClick={goToClan} className="clan-link">
                {player.clan.name} ({player.clan.tag})
              </button>
              <span className="clan-role">
                {CLAN_ROLES[player.role]?.icon} {CLAN_ROLES[player.role]?.name}
              </span>
              <div className="donation-stats">
                <span>Donations: {player.donations}</span>
                <span>Reçues: {player.donationsReceived}</span>
                <span className={player.donations > player.donationsReceived ? 'positive' : 'neutral'}>
                  Ratio: {player.donationsReceived > 0
                    ? (player.donations / player.donationsReceived).toFixed(2)
                    : player.donations > 0 ? '∞' : '0'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* War Stats */}
        <div className="war-stats">
          <div className="stat-box">
            <span className="stat-label">Étoiles de guerre</span>
            <span className="stat-value">{player.warStars || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Attaques gagnées</span>
            <span className="stat-value">{player.attackWins || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Défenses gagnées</span>
            <span className="stat-value">{player.defenseWins || 0}</span>
          </div>
        </div>

        {/* Evolution */}
        {evolution && (
          <div className="evolution-stats">
            <h3>Évolution (7 derniers jours)</h3>
            <div className="evolution-grid">
              <div className="evolution-item">
                <span>Trophées</span>
                <span className={evolution.trophies >= 0 ? 'positive' : 'negative'}>
                  {evolution.trophies >= 0 ? '+' : ''}{evolution.trophies}
                </span>
              </div>
              <div className="evolution-item">
                <span>Étoiles</span>
                <span className={evolution.warStars >= 0 ? 'positive' : 'negative'}>
                  {evolution.warStars >= 0 ? '+' : ''}{evolution.warStars}
                </span>
              </div>
              <div className="evolution-item">
                <span>Donations</span>
                <span className={evolution.donations >= 0 ? 'positive' : 'negative'}>
                  {evolution.donations >= 0 ? '+' : ''}{evolution.donations}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Résumé
        </button>
        <button
          className={`tab ${activeTab === 'troops' ? 'active' : ''}`}
          onClick={() => setActiveTab('troops')}
        >
          Troupes & Sorts
        </button>
        <button
          className={`tab ${activeTab === 'heroes' ? 'active' : ''}`}
          onClick={() => setActiveTab('heroes')}
        >
          Héros
        </button>
        <button
          className={`tab ${activeTab === 'readiness' ? 'active' : ''}`}
          onClick={() => setActiveTab('readiness')}
        >
          War Readiness
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="tab-content">
          <div className="card">
            <h2>Aperçu</h2>
            <p>Utilisez les onglets ci-dessus pour explorer les détails du joueur.</p>
          </div>
        </div>
      )}

      {activeTab === 'troops' && (
        <div className="tab-content">
          <div className="card">
            <h2>Troupes</h2>
            <div className="troops-grid">
              {player.troops && player.troops
                .filter(t => t.village === 'home')
                .map(troop => (
                  <div key={troop.name} className="troop-item">
                    <span className="troop-name">{troop.name}</span>
                    <span className="troop-level">Niveau {troop.level}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="card">
            <h2>Sorts</h2>
            <div className="troops-grid">
              {player.spells && player.spells.map(spell => (
                <div key={spell.name} className="troop-item">
                  <span className="troop-name">{spell.name}</span>
                  <span className="troop-level">Niveau {spell.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'heroes' && (
        <div className="tab-content">
          <div className="card">
            <h2>Héros</h2>
            <div className="heroes-grid">
              {player.heroes && player.heroes.map(hero => (
                <div key={hero.name} className="hero-card">
                  <h3>{hero.name}</h3>
                  <div className="hero-level">
                    <span className="level-badge">Niveau {hero.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'readiness' && warScore && (
        <div className="tab-content">
          <div className="card war-readiness-card">
            <h2>War Readiness Score</h2>
            <div className="score-display">
              <div
                className="score-circle"
                style={{
                  background: `conic-gradient(${STATUS_COLORS[warScore.level]} ${warScore.totalScore}%, #333 0)`
                }}
              >
                <div className="score-inner">
                  <span className="score-number">{warScore.totalScore}</span>
                  <span className="score-label">{warScore.level}</span>
                </div>
              </div>
            </div>

            <div className="score-breakdown">
              <h3>Détails</h3>
              <div className="breakdown-item">
                <span>Héros ({(warScore.breakdown.heroes.weight * 100).toFixed(0)}%)</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${warScore.breakdown.heroes.score}%`,
                      backgroundColor: STATUS_COLORS[warScore.level]
                    }}
                  />
                </div>
                <span>{warScore.breakdown.heroes.score}/100</span>
              </div>

              <div className="breakdown-item">
                <span>Troupes ({(warScore.breakdown.troops.weight * 100).toFixed(0)}%)</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${warScore.breakdown.troops.score}%`,
                      backgroundColor: STATUS_COLORS[warScore.level]
                    }}
                  />
                </div>
                <span>{warScore.breakdown.troops.score}/100</span>
              </div>

              <div className="breakdown-item">
                <span>Sorts ({(warScore.breakdown.spells.weight * 100).toFixed(0)}%)</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${warScore.breakdown.spells.score}%`,
                      backgroundColor: STATUS_COLORS[warScore.level]
                    }}
                  />
                </div>
                <span>{warScore.breakdown.spells.score}/100</span>
              </div>

              <div className="breakdown-item">
                <span>Donations ({(warScore.breakdown.donations.weight * 100).toFixed(0)}%)</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${warScore.breakdown.donations.score}%`,
                      backgroundColor: STATUS_COLORS[warScore.level]
                    }}
                  />
                </div>
                <span>{warScore.breakdown.donations.score}/100</span>
              </div>
            </div>

            {warScore.recommendations.length > 0 && (
              <div className="recommendations">
                <h3>Recommandations</h3>
                {warScore.recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation priority-${rec.priority.toLowerCase()}`}>
                    <span className="priority-badge">{rec.priority}</span>
                    <p>{rec.message}</p>
                    {rec.details && (
                      <ul>
                        {rec.details.map((detail, i) => (
                          <li key={i}>
                            {detail.name}: Niveau {detail.level}/{detail.maxLevel}
                            ({detail.percentage.toFixed(0)}%)
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;
